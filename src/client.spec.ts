/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client } from './client';
import { CHANNEL_READY_MSG, CHANNEL_READY_REQUEST_MSG } from './utils/communicationProxy';
import { AppNames } from './types/appNames';

/*
 * Helper: simulate the CHANNEL_READY handshake that the iframe's
 * subscribeToChannel sends after registering its message listener.
 *
 * origin must match the instanceUrl origin used by the client under test so
 * that the listenForChannelReady origin-validation check passes.
 */
function simulateChannelReady(origin = 'https://example.my.connect.aws') {
  window.dispatchEvent(
    new MessageEvent('message', {
      data: {
        source: AppNames.QConnectJS,   // 'wisdom-js'
        type: CHANNEL_READY_MSG,       // 'CHANNEL_READY'
      },
      origin,
    }),
  );
}

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
    let originalConnect: any;

    beforeEach(() => {
      jest.useFakeTimers();
      originalConnect = (window as any).connect;
      // Clean up any leftover iframes from previous tests
      document.querySelectorAll('iframe').forEach((el) => el.remove());
      document.querySelectorAll('#q-connect-container').forEach((el) => el.remove());
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
      if (originalConnect) {
        (window as any).connect = originalConnect;
      } else {
        delete (window as any).connect;
      }
      document.querySelectorAll('iframe').forEach((el) => el.remove());
      document.querySelectorAll('#q-connect-container').forEach((el) => el.remove());
    });

    it('should resolve _frameReady immediately for same-origin instanceUrl', async () => {
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

    it('should send CHANNEL_READY_REQUEST probe when pre-existing wisdom-v2 iframe found', async () => {
      const mockIframe = document.createElement('iframe');
      mockIframe.src = 'https://example.my.connect.aws/wisdom-v2/?theme=hidden_page';
      document.body.appendChild(mockIframe);

      const postedMessages: any[] = [];
      // Mock contentWindow.postMessage to capture the probe
      Object.defineProperty(mockIframe, 'contentWindow', {
        get: () => ({
          postMessage: (msg: any) => postedMessages.push(msg),
        }),
      });

      const debugSpy = jest.spyOn(console, 'debug').mockImplementation();

      const crossOriginClient = new Client({ instanceUrl: 'https://example.my.connect.aws' } as any);
      const handler = jest.fn(() => Promise.resolve('response'));
      const command = { resolveRequestHandler: jest.fn(() => handler) };

      const callPromise = crossOriginClient.call(command as any);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      // Should be pending — waiting for CHANNEL_READY handshake
      expect(handler).not.toHaveBeenCalled();

      // Verify the probe was sent
      expect(postedMessages.some((m) => m.type === CHANNEL_READY_REQUEST_MSG)).toBe(true);

      expect(debugSpy).toHaveBeenCalledWith(
        expect.stringContaining('Sending CHANNEL_READY_REQUEST probe'),
      );

      // Simulate the iframe responding with CHANNEL_READY
      simulateChannelReady();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      await expect(callPromise).resolves.toEqual('response');
      expect(handler).toHaveBeenCalled();

      debugSpy.mockRestore();
    });

    it('should NOT resolve _frameReady on iframe load event alone — must wait for CHANNEL_READY', async () => {
      const mockIframe = document.createElement('iframe');
      mockIframe.id = 'AmazonQConnect';

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

      const callPromise = crossOriginClient.call(command as any);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      // Should be pending — iframe hasn't loaded yet
      expect(handler).not.toHaveBeenCalled();

      // Simulate iframe load event — this sets frameWindow but does NOT resolve _frameReady
      mockIframe.dispatchEvent(new Event('load'));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      // Still pending — waiting for CHANNEL_READY handshake
      expect(handler).not.toHaveBeenCalled();

      // Now simulate the CHANNEL_READY handshake
      simulateChannelReady();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      // Now should resolve
      await expect(callPromise).resolves.toEqual('response');
      expect(handler).toHaveBeenCalled();
    });

    it('should resolve _frameReady on CHANNEL_READY handshake even before load event', async () => {
      const mockIframe = document.createElement('iframe');
      mockIframe.id = 'AmazonQConnect';
      mockIframe.src = 'https://example.my.connect.aws/wisdom-v2/?theme=hidden_page';

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

      const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
      const crossOriginClient = new Client({ instanceUrl: 'https://example.my.connect.aws' } as any);
      const handler = jest.fn(() => Promise.resolve('response'));
      const command = { resolveRequestHandler: jest.fn(() => handler) };

      const callPromise = crossOriginClient.call(command as any);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(handler).not.toHaveBeenCalled();

      // Simulate CHANNEL_READY handshake (before load event fires)
      simulateChannelReady();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      await expect(callPromise).resolves.toEqual('response');
      expect(handler).toHaveBeenCalled();

      expect(debugSpy).toHaveBeenCalledWith(
        expect.stringContaining(`received ${CHANNEL_READY_MSG} handshake`),
      );

      debugSpy.mockRestore();
    });

    it('should only call initApp once when both onInitialized fires and CCP iframe is already present', async () => {
      const ccpIframe = document.createElement('iframe');
      ccpIframe.src = 'https://example.my.connect.aws/ccp-v2/';
      document.body.appendChild(ccpIframe);

      const wisdomIframe = document.createElement('iframe');
      wisdomIframe.id = 'AmazonQConnect';

      let initAppCallCount = 0;
      (window as any).connect = {
        core: {
          onInitialized: (cb: () => void) => cb(),
        },
        agentApp: {
          initApp: () => {
            initAppCallCount++;
            document.body.appendChild(wisdomIframe);
          },
        },
      };

      const crossOriginClient = new Client({ instanceUrl: 'https://example.my.connect.aws' } as any);
      const handler = jest.fn(() => Promise.resolve('response'));
      const command = { resolveRequestHandler: jest.fn(() => handler) };

      const callPromise = crossOriginClient.call(command as any);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(initAppCallCount).toBe(1);

      simulateChannelReady();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      await expect(callPromise).resolves.toEqual('response');
      expect(handler).toHaveBeenCalled();
    });

    it('should create wisdom iframe immediately when CCP iframe already present', async () => {
      const ccpIframe = document.createElement('iframe');
      ccpIframe.src = 'https://example.my.connect.aws/ccp-v2/';
      document.body.appendChild(ccpIframe);

      const wisdomIframe = document.createElement('iframe');
      wisdomIframe.id = 'AmazonQConnect';

      (window as any).connect = {
        core: {
          onInitialized: (_cb: () => void) => { /* no-op */ },
        },
        agentApp: {
          initApp: () => {
            document.body.appendChild(wisdomIframe);
          },
        },
      };

      const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
      const crossOriginClient = new Client({ instanceUrl: 'https://example.my.connect.aws' } as any);
      const handler = jest.fn(() => Promise.resolve('response'));
      const command = { resolveRequestHandler: jest.fn(() => handler) };

      const callPromise = crossOriginClient.call(command as any);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(debugSpy).toHaveBeenCalledWith(
        expect.stringContaining('CCP iframe already present'),
      );

      expect(handler).not.toHaveBeenCalled();

      simulateChannelReady();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      await expect(callPromise).resolves.toEqual('response');
      expect(handler).toHaveBeenCalled();

      debugSpy.mockRestore();
    });

    it('should resolve _frameReady via 30s timeout when CHANNEL_READY never arrives (backward compat)', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const mockIframe = document.createElement('iframe');
      mockIframe.id = 'AmazonQConnect';

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

      const callPromise = crossOriginClient.call(command as any);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      mockIframe.dispatchEvent(new Event('load'));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(handler).not.toHaveBeenCalled();

      // Advance timers by 30 seconds to trigger the safety timeout
      jest.advanceTimersByTime(30_000);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      await expect(callPromise).resolves.toEqual('response');
      expect(handler).toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('timed out after 30s'),
      );

      warnSpy.mockRestore();
    });

    it('should resolve _frameReady via 30s timeout for pre-existing iframe without handshake', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const mockIframe = document.createElement('iframe');
      mockIframe.src = 'https://example.my.connect.aws/wisdom-v2/?theme=hidden_page';
      document.body.appendChild(mockIframe);

      const crossOriginClient = new Client({ instanceUrl: 'https://example.my.connect.aws' } as any);
      const handler = jest.fn(() => Promise.resolve('response'));
      const command = { resolveRequestHandler: jest.fn(() => handler) };

      const callPromise = crossOriginClient.call(command as any);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      // Pending — pre-existing iframe now waits for CHANNEL_READY
      expect(handler).not.toHaveBeenCalled();

      // Advance past 30s safety timeout
      jest.advanceTimersByTime(30_000);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      await expect(callPromise).resolves.toEqual('response');
      expect(handler).toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('timed out after 30s'),
      );

      warnSpy.mockRestore();
    });

    it('should resolve _frameReady on iframe error event', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const mockIframe = document.createElement('iframe');
      mockIframe.id = 'AmazonQConnect';

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

      const callPromise = crossOriginClient.call(command as any);
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(handler).not.toHaveBeenCalled();

      mockIframe.dispatchEvent(new Event('error'));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      await expect(callPromise).resolves.toEqual('response');
      expect(handler).toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('iframe error event'),
      );

      warnSpy.mockRestore();
    });

    it('should warn when agentApp.initApp does not create iframe element', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      (window as any).connect = {
        core: {
          onInitialized: (cb: () => void) => cb(),
        },
        agentApp: {
          initApp: () => { /* no-op — doesn't create iframe */ },
        },
      };

      const crossOriginClient = new Client({ instanceUrl: 'https://example.my.connect.aws' } as any);
      const handler = jest.fn(() => Promise.resolve('response'));
      const command = { resolveRequestHandler: jest.fn(() => handler) };

      await expect(
        crossOriginClient.call(command as any),
      ).resolves.toEqual('response');

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('did not create iframe element'),
      );

      warnSpy.mockRestore();
    });
  });
});
