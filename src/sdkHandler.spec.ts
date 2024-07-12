/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { SDKHandler } from './sdkHandler';
import { HttpRequest } from './httpRequest';
import { getRuntimeConfig } from './utils/runtimeConfig.shared';
import { QConnectClientResolvedConfig } from './qConnectClient';

const mockSDKResponse = 'success response';

const mockHTTPResponse = {
  headers: {
    entries: jest.fn().mockReturnValue([
      ['foo', 'bar'],
    ]),
  },
  blob: jest.fn(() => Promise.resolve(mockSDKResponse)),
  json: jest.fn().mockReturnValue(mockSDKResponse),
};

const mockConnectSDKClientSend = jest.fn().mockResolvedValue(mockSDKResponse);

const mockQConnectSDKClientSend = jest.fn().mockResolvedValue(mockSDKResponse);

jest.mock('@aws-sdk/client-connect', () => {
  return {
    ConnectClient: jest.fn().mockImplementation(() => {
      return {
        send: mockConnectSDKClientSend
      };
    }),
  };
});

jest.mock('@aws-sdk/client-qconnect', () => {
  return {
    QConnectClient: jest.fn().mockImplementation(() => {
      return {
        send: mockQConnectSDKClientSend,
      };
    }),
  };
});

describe('SDKHandler', () => {
  console.error = jest.fn();

  const mockAbortSignal = { aborted: false, onabort: null };

  const mockAbort = jest.fn(() => mockAbortSignal.aborted = true);

  const mockAbortController = () => ({
    abort: mockAbort,
    signal: mockAbortSignal,
  });

  const mockCommand = {
    middlewareStack: {
      add: jest.fn(),
    },
  };

  const mockMessageChannel = jest.fn().mockReturnValue({
    port1: {
      onmessage: jest.fn(),
    },
    port2: {
      onmessage: jest.fn(),
    },
  });

  const sdkHandler = new SDKHandler();

  sdkHandler.setRuntimeConfig(
    getRuntimeConfig({
      instanceUrl: 'https://foo.amazonaws.com',
    }) as QConnectClientResolvedConfig,
  );

  beforeEach(() => {
    jest.clearAllMocks();

    global.AbortController = jest.fn().mockReturnValue(mockAbortController);
    global.MessageChannel = mockMessageChannel;
  });

  it('should make requests using the AWS SDK clients if no frame window provided', async () => {
    const response = await sdkHandler.handle({
      request: {
        headers: {
          'x-amz-vendor': 'wisdom',
        },
        body: JSON.stringify({
          instanceId: '1234567890',
        }),
      },
      command: mockCommand,
      options: {}
    });

    expect(mockConnectSDKClientSend.mock.calls.length).toEqual(0);
    expect(mockQConnectSDKClientSend.mock.calls.length).toEqual(1);
    expect(response.body).toEqual(mockHTTPResponse.json());
  });

  it ('should make requests using message channel if frame window provided', () => {
    const sdkHandler = new SDKHandler();

    sdkHandler.setRuntimeConfig(
      {
        ...getRuntimeConfig({
          instanceUrl: 'https://foo.amazonaws.com',
        }) as QConnectClientResolvedConfig,
        frameWindow: {
          contentWindow: global,
          src: 'https://foo.amazonaws.com/wisdom-v2',
        } as any,
      },
    );

    sdkHandler.handle({
      request: {
        headers: {
          'x-amz-vendor': 'wisdom',
        },
        body: JSON.stringify({
          instanceId: '1234567890',
        }),
      },
      command: mockCommand,
      options: {} as any,
    });

    expect(mockMessageChannel.mock.calls.length).toEqual(1);
  });

  it('should not make requests if already aborted', async () => {
    await expect(
      sdkHandler.handle({
        request: {
          headers: {
            'x-amz-vendor': 'wisdom',
          },
          body: JSON.stringify({
            instanceId: '1234567890',
          }),
        },
        command: mockCommand,
        options: {
          abortSignal: {
            aborted: true,
            onabort: null,
          } as any,
        },
      }),
    ).rejects.toHaveProperty('name', 'AbortError');

    expect(mockConnectSDKClientSend.mock.calls.length).toEqual(0);
    expect(mockQConnectSDKClientSend.mock.calls.length).toEqual(0);
  });

  it('should pass an abortSignal if supported', async () => {
    await sdkHandler.handle({
      request: {
        headers: {
          'x-amz-vendor': 'wisdom',
        },
        body: JSON.stringify({
          instanceId: '1234567890',
        }),
      },
      command: mockCommand,
      options: {
        abortSignal: {
          aborted: false,
          onabort: null,
        } as any,
      },
    });

    expect(mockConnectSDKClientSend.mock.calls.length).toBe(0);
    expect(mockQConnectSDKClientSend.mock.calls.length).toBe(1);
    expect(mockQConnectSDKClientSend.mock.calls[0][1]).toHaveProperty('signal');
  });

  it('should pass a timeout from a provider to requestTimeout method', async () => {
    const sdkHandler = new SDKHandler({
      requestTimeout: 500,
    });

    const requestTimeoutMock = jest.spyOn(sdkHandler, 'requestTimeout');

    await sdkHandler.handle({
      request: {
        headers: {
          'x-amz-vendor': 'wisdom',
        },
        body: JSON.stringify({
          instanceId: '1234567890',
        }),
      },
      command: mockCommand,
      options: {} as any,
    });

    expect(mockConnectSDKClientSend.mock.calls.length).toBe(0);
    expect(mockQConnectSDKClientSend.mock.calls.length).toBe(0);
    expect(requestTimeoutMock.mock.calls[0][0]).toBe(500);
  });

  it('should throw an unsupported service prefix error if the incoming MessageChannel request x-amz-target is invalid', async () => {
    const requestOptions = {
      headers: {
        'x-amz-target': 'some-client-method',
      },
    };

    expect(async () => {
      await sdkHandler.channelRequestHandler('', requestOptions);
    }).rejects.toThrow('Unsupported service prefix.');
  });

  it('should throw an unsupported service error if the incoming MessageChannel request x-amz-target is invalid', async () => {
    const requestOptions = {
      headers: {
        'x-amz-target': 'AgentAppService.Cases.some-client-method',
      },
    };

    expect(async () => {
      await sdkHandler.channelRequestHandler('', requestOptions);
    }).rejects.toThrow('Unsupported service.');
  });

  it('should throw an unsupported client method error if the incoming MessageChannel request x-amz-target is invalid', async () => {
    const requestOptions = {
      headers: {
        'x-amz-target': 'AgentAppService.WisdomV2.some-client-method',
      },
    };

    expect(async () => {
      await sdkHandler.channelRequestHandler('', requestOptions);
    }).rejects.toThrow('Unsupported client method.');
  });

  it('should throw an invalid user input error if the incoming MessageChannel request body is invalid', async () => {
    const requestUrl = 'https://other-origin-domain.amazonaws.com';
    let requestOptions = {
      headers: {
        'x-amz-target': 'AgentAppService.Acs.listIntegrationAssociations',
      },
      body: JSON.stringify({}),
    };

    expect(async () => {
      await sdkHandler.channelRequestHandler(requestUrl, requestOptions);
    }).rejects.toThrow('Invalid InstanceId.');

    requestOptions = {
      headers: {
        'x-amz-target': 'AgentAppService.Lcms.getContact',
      },
      body: JSON.stringify({
        instanceId: '1234567890',
      }),
    };

    expect(async () => {
      await sdkHandler.channelRequestHandler(requestUrl, requestOptions);
    }).rejects.toThrow('Invalid awsAccountId.');
  });
});
