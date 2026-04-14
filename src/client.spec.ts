/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client } from './client';

describe('Client', () => {
  const client = new Client({} as any);

  const mockHandler = jest.fn((args: any) => Promise.resolve('success response'));
  const mockResolveRequestHandler = jest.fn((args: any) => mockHandler);
  const mockCommand = () => ({ resolveRequestHandler: mockResolveRequestHandler });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a response promise when only a command is supplied', async () => {
    await expect(
      client.call(mockCommand() as any),
    ).resolves.toEqual('success response');
  });

  it('should return a response promise when command and options are supplied', async () => {
    const options = { abortSignal: 'signal' };
    await expect(
      client.call(mockCommand() as any, options),
    ).resolves.toEqual('success response');
    expect(mockResolveRequestHandler.mock.calls.length).toEqual(1);
    expect(mockResolveRequestHandler.mock.calls[0][1 as any]).toEqual(options);
  });

  describe('initFrameConduit readiness gate', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should resolve _frameReady immediately for same-origin instanceUrl', async () => {
      // When instanceUrl includes window.location.origin, no iframe is needed.
      // The client should resolve immediately allowing call() to proceed.
      const sameOriginClient = new Client({ instanceUrl: window.location.origin } as any);
      const handler = jest.fn(() => Promise.resolve('response'));
      const command = { resolveRequestHandler: jest.fn(() => handler) };

      await expect(
        sameOriginClient.call(command as any),
      ).resolves.toEqual('response');
    });

    it('should resolve _frameReady immediately when frameWindow is pre-set', async () => {
      const mockIframe = document.createElement('iframe') as HTMLIFrameElement;
      const presetClient = new Client({ frameWindow: mockIframe } as any);
      const handler = jest.fn(() => Promise.resolve('response'));
      const command = { resolveRequestHandler: jest.fn(() => handler) };

      await expect(
        presetClient.call(command as any),
      ).resolves.toEqual('response');
    });

    it('should resolve _frameReady and log warning when connect.core is not available', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      // Use a cross-origin instanceUrl so initFrameConduit doesn't short-circuit on same-origin check
      const crossOriginClient = new Client({ instanceUrl: 'https://example.my.connect.aws' } as any);
      const handler = jest.fn(() => Promise.resolve('response'));
      const command = { resolveRequestHandler: jest.fn(() => handler) };

      await expect(
        crossOriginClient.call(command as any),
      ).resolves.toEqual('response');

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('connect.core is not available'),
      );

      warnSpy.mockRestore();
    });

    it('should wait for iframe load event before resolving _frameReady', async () => {
      // Mock connect.core.onInitialized to call callback immediately
      const mockIframe = document.createElement('iframe');
      mockIframe.id = 'AmazonQConnect';

      const originalConnect = (window as any).connect;
      (window as any).connect = {
        core: {
          onInitialized: (cb: () => void) => cb(),
        },
        agentApp: {
          initApp: () => {
            // Simulate initApp adding the iframe to the DOM
            document.body.appendChild(mockIframe);
          },
        },
      };

      const crossOriginClient = new Client({ instanceUrl: 'https://example.my.connect.aws' } as any);
      const handler = jest.fn(() => Promise.resolve('response'));
      const command = { resolveRequestHandler: jest.fn(() => handler) };

      // Start the call — it should be pending until iframe loads
      const callPromise = crossOriginClient.call(command as any);

      // Flush pending microtasks so that if _frameReady were already resolved,
      // the handler would have been invoked by now.
      // Use multiple awaits to drain the full microtask queue under fake timers.
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(handler).not.toHaveBeenCalled();

      // Simulate iframe load event
      mockIframe.dispatchEvent(new Event('load'));

      // Flush microtasks so the resolved _frameReady propagates through call()
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      // Now the call should resolve
      await expect(callPromise).resolves.toEqual('response');
      expect(handler).toHaveBeenCalled();

      // Cleanup
      document.body.removeChild(mockIframe);
      if (originalConnect) {
        (window as any).connect = originalConnect;
      } else {
        delete (window as any).connect;
      }
    });

    it('should resolve _frameReady via 30s timeout when iframe never loads', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Mock connect.core.onInitialized to call callback immediately,
      // but the iframe will never fire a 'load' event.
      const mockIframe = document.createElement('iframe');
      mockIframe.id = 'AmazonQConnect';

      const originalConnect = (window as any).connect;
      (window as any).connect = {
        core: {
          onInitialized: (cb: () => void) => cb(),
        },
        agentApp: {
          initApp: () => {
            document.body.appendChild(mockIframe);
          },
        },
      };

      const crossOriginClient = new Client({ instanceUrl: 'https://example.my.connect.aws' } as any);
      const handler = jest.fn(() => Promise.resolve('response'));
      const command = { resolveRequestHandler: jest.fn(() => handler) };

      // Start the call — it should be pending until timeout fires
      const callPromise = crossOriginClient.call(command as any);

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      // Handler should not have been called yet — iframe hasn't loaded
      expect(handler).not.toHaveBeenCalled();

      // Advance timers by 30 seconds to trigger the safety timeout
      jest.advanceTimersByTime(30_000);

      // Flush microtasks so the resolved _frameReady propagates through call()
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      // Now the call should resolve via the timeout fallback
      await expect(callPromise).resolves.toEqual('response');
      expect(handler).toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('iframe initialization timed out'),
      );

      // Cleanup
      document.body.removeChild(mockIframe);
      warnSpy.mockRestore();
      if (originalConnect) {
        (window as any).connect = originalConnect;
      } else {
        delete (window as any).connect;
      }
    });
  });
})
