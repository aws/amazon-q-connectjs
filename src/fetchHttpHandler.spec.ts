/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { FetchHttpHandler } from './fetchHttpHandler';
import { HttpRequest } from './httpRequest';
import { getRuntimeConfig } from './utils/runtimeConfig.shared';
import { QConnectClientResolvedConfig } from './qConnectClient';

describe('FetchHttpHandler', () => {
  let mockRequest = new HttpRequest({
    headers: {},
    hostname: 'foo.amazonaws.com',
    method: 'POST',
    path: "/test/?example=param",
    protocol: "https",
  });

  const mockResponse = {
    headers: {
      entries: jest.fn().mockReturnValue([
        ['foo', 'bar'],
      ]),
    },
    blob: jest.fn(() => Promise.resolve('success response')),
    json: jest.fn().mockReturnValue('success response'),
  };

  const mockAbortSignal = { aborted: false, onabort: null };
  const mockAbort = jest.fn(() => mockAbortSignal.aborted = true);
  const mockAbortController = () => ({
    abort: mockAbort,
    signal: mockAbortSignal,
  });

  const mockFetch = jest.fn().mockResolvedValue(mockResponse);
  const mockMessageChannel = jest.fn().mockReturnValue({
    port1: {
      onmessage: jest.fn(),
    },
    port2: {
      onmessage: jest.fn(),
    },
  });

  const fetchHttpHandler = new FetchHttpHandler();
  fetchHttpHandler.setRuntimeConfig(
    getRuntimeConfig({
      instanceUrl: 'https://foo.amazonaws.com',
    }) as QConnectClientResolvedConfig,
  );

  beforeEach(() => {
    jest.clearAllMocks();

    global.AbortController = jest.fn().mockReturnValue(mockAbortController);
    global.fetch = mockFetch;
    global.MessageChannel = mockMessageChannel;
  });

  it ('should make requests using fetch if no frame window provided', async () => {
    const response = await fetchHttpHandler.handle({} as any, {});

    expect(mockFetch.mock.calls.length).toEqual(1);
    expect(response.body).toEqual(mockResponse.json());
  });

  it ('should make requests using message channel if frame window provided', () => {
    fetchHttpHandler.handle({
      frameWindow: {
        contentWindow: global,
        src: 'https://foo.amazonaws.com/wisdom-v2',
      },
    } as any, {});

    expect(mockMessageChannel.mock.calls.length).toEqual(1);
  });

  it('should properly construct the url', async () => {
    await fetchHttpHandler.handle(mockRequest, {});

    expect(mockFetch.mock.calls.length).toEqual(1);
    expect(mockFetch.mock.calls[0][0]).toEqual('https://foo.amazonaws.com/test/?example=param');

    mockRequest = new HttpRequest({
      port: 4000,
    });
    await fetchHttpHandler.handle(mockRequest, {});

    expect(mockFetch.mock.calls.length).toEqual(2);
    expect(mockFetch.mock.calls[1][0]).toEqual('https://localhost:4000/agent-app/api');
  });

  it('should not make requests if already aborted', async () => {
    await expect(
      fetchHttpHandler.handle(
        {} as any,
        {
          abortSignal: {
            aborted: true,
            onabort: null,
          } as any,
        }
      ),
    ).rejects.toHaveProperty('name', 'AbortError');

    expect(mockFetch.mock.calls.length).toBe(0);
  });

  it('should pass an abortSignal if supported', async () => {
    await fetchHttpHandler.handle(
      {} as any,
      {
        abortSignal: {
          aborted: false,
          onabort: null,
        } as any,
      },
    );

    expect(mockFetch.mock.calls.length).toBe(1);
    expect(mockFetch.mock.calls[0][1]).toHaveProperty('signal');
  });

  it('should pass a timeout from a provider to requestTimeout method', async () => {
    const fetchHttpHandler = new FetchHttpHandler({
      requestTimeout: 500,
    });

    const requestTimeoutMock = jest.spyOn(fetchHttpHandler, 'requestTimeout');

    await fetchHttpHandler.handle({} as any, {});

    expect(mockFetch.mock.calls.length).toBe(1);
    expect(requestTimeoutMock.mock.calls[0][0]).toBe(500);
  });

  it('should throw a timeout error if it times out before the request finishes', async () => {
    const mockFetch = jest.fn(() => (new Promise(() => null)));
    (global as any).fetch = mockFetch;

    const fetchHttpHandler = new FetchHttpHandler({
      requestTimeout: 5,
    });

    await expect(fetchHttpHandler.handle({} as any, {})).rejects.toHaveProperty('name', 'TimeoutError');
    expect(mockFetch.mock.calls.length).toBe(1);
  });

  it('should throw an unsupported service prefix error if the incoming MessageChannel request x-amz-target is invalid', async () => {
    const requestOptions = {
      headers: {
        'x-amz-target': 'some-client-method',
      },
    };

    await expect(fetchHttpHandler.channelRequestHandler('', requestOptions)).rejects.toThrowError('Unsupported service prefix.');
  });

  it('should throw an unsupported service error if the incoming MessageChannel request x-amz-target is invalid', async () => {
    const requestOptions = {
      headers: {
        'x-amz-target': 'AgentAppService.Cases.some-client-method',
      },
    };

    await expect(fetchHttpHandler.channelRequestHandler('', requestOptions)).rejects.toThrowError('Unsupported service.');
  });

  it('should throw an unsupported client method error if the incoming MessageChannel request x-amz-target is invalid', async () => {
    const requestOptions = {
      headers: {
        'x-amz-target': 'AgentAppService.WisdomV2.some-client-method',
      },
    };

    await expect(fetchHttpHandler.channelRequestHandler('', requestOptions)).rejects.toThrowError('Unsupported client method.');
  });

  it('should throw an invalid user input error if the incoming MessageChannel request body is invalid', async () => {
    const requestUrl = 'https://other-origin-domain.amazonaws.com';
    let requestOptions = {
      headers: {
        'x-amz-target': 'AgentAppService.Acs.listIntegrationAssociations',
      },
      body: JSON.stringify({}),
    };

    await expect(fetchHttpHandler.channelRequestHandler(requestUrl, requestOptions)).rejects.toThrowError('Invalid InstanceId.');

    requestOptions = {
      headers: {
        'x-amz-target': 'AgentAppService.Lcms.getContact',
      },
      body: JSON.stringify({
        instanceId: '1234567890',
      }),
    };

    await expect(fetchHttpHandler.channelRequestHandler(requestUrl, requestOptions)).rejects.toThrowError('Invalid awsAccountId.');
  });

  it('should reconstruct the url even if the incoming MessageChannel request body is valid', async () => {
    const requestUrl = 'https://other-origin-domain.amazonaws.com';
    const requestOptions = {
      headers: {
        'x-amz-target': 'AgentAppService.Acs.listIntegrationAssociations',
      },
      body: JSON.stringify({
        InstanceId: '1234567890',
      }),
    };

    await fetchHttpHandler.channelRequestHandler(requestUrl, requestOptions);

    expect(mockFetch.mock.calls.pop()).toEqual([
      'https://foo.amazonaws.com/agent-app/api',
      {
        method: 'POST',
        headers: {
          'x-amz-target': 'AgentAppService.Acs.listIntegrationAssociations'
        },
        body: JSON.stringify({
          InstanceId: '1234567890',
        }),
      },
    ]);
  });
});
