/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConnectClient as ConnectSDKClient } from '@aws-sdk/client-connect';
import { QConnectClient as QConnectSDKClient } from '@aws-sdk/client-qconnect';

import { QConnectClientResolvedConfig } from './qConnectClient';
import { HttpRequestOptions } from './httpRequest';
import { fetchWithChannel, subscribeToChannel } from './utils/communicationProxy';
import { parseAmzTarget } from './utils/buildAmzTarget';
import { buildClientResponseMiddleware } from './utils/buildClientMiddleware';
import { getBaseCredentials } from './utils/getBaseCredentials';
import { HttpResponse, HttpHandlerOptions } from './types/http';
import { RequestHandler } from './types/requestHandler';
import { Commands } from './types/command';
import { VendorCodes } from './types/vendorCodes';

/*
 * Represents the http options that can be passed to a browser sdk client.
 */
 export interface SDKHandlerOptions {
  /*
   * The number of milliseconds a request can take before being automatically
   * terminated.
   */
  requestTimeout?: number;
}

export class SDKHandler implements RequestHandler<HttpRequestOptions, HttpResponse<any>, HttpHandlerOptions> {
  private runtimeConfig?: QConnectClientResolvedConfig;

  private config?: SDKHandlerOptions;

  private sdkClients?: {
    [VendorCodes.Connect]: ConnectSDKClient,
    [VendorCodes.Wisdom]: QConnectSDKClient,
  }

  constructor(config?: SDKHandlerOptions) {
    this.config = config ?? {};

    subscribeToChannel(this.channelRequestHandler.bind(this));
  }

  setRuntimeConfig(config: QConnectClientResolvedConfig) {
    this.runtimeConfig = config;

    this.initializeClients();
  }

  initializeClients() {
    const endpoint = `${this.runtimeConfig?.endpoint}/api-proxy`;

    this.sdkClients = {
      [VendorCodes.Connect]: new ConnectSDKClient({
        region: 'us-west-2',
        endpoint: `${endpoint}/${VendorCodes.Connect}`,
        credentials: getBaseCredentials(),
      }),
      [VendorCodes.Wisdom]: new QConnectSDKClient({
        region: 'us-west-2',
        endpoint: `${endpoint}/${VendorCodes.Wisdom}`,
        credentials: getBaseCredentials(),
      }),
    }
  }

  async responseHandler(response: any): Promise<HttpResponse<any>> {
    const { statusCode, reason, headers, body } = response;

    return {
      status: statusCode,
      statusText: reason,
      ok: reason === 'OK',
      headers,
      body,
    };
  }

  async channelRequestHandler(_: string, options: RequestInit): Promise<HttpResponse<any>>  {
    try {
      const { headers, body } = options;

      // Source the x-amz-target from the incoming headers
      const amzTarget = (headers as any)?.['x-amz-target'];

      // Parse the client method from x-amz-target
      const clientMethod = parseAmzTarget(amzTarget);

      // Source the helper command from the client method
      const Command = Commands[clientMethod];

      // Initialize helper command from the incoming request body
      // this sets up a serializer to validate request args
      const clientCommand = new Command(JSON.parse(body as string));

      const config = this.runtimeConfig as QConnectClientResolvedConfig;

      return this.handle({
        request: clientCommand.serializeRequest(config),
        command: clientCommand.serializeCommand(config),
      });
    } catch (e: any) {
      console.error(`Something went wrong during request: ${e?.message}`);
      return Promise.reject(e);
    }
  }

  async sdkRequestHandler(command: any, options: RequestInit): Promise<HttpResponse<any>> {
    try {
      const { headers } = options;

      // Source the x-amz-vendor from the incoming headers
      const amzVendor = (headers as any)?.['x-amz-vendor'] as VendorCodes;

      // Source the SDK client from the client method
      const client = (this.sdkClients as any)?.[amzVendor];

      // Source client response middleware
      let httpResponse: any;
      const [middleware, ops] = buildClientResponseMiddleware(
        (response: any) => {
          httpResponse = response;
        },
      );

      command?.middlewareStack.add(middleware, ops);

      const deserializedResponse = await client?.send(command, options);

      return this.responseHandler({
        ...httpResponse,
        body: deserializedResponse,
      });
    } catch (e: any) {
      console.error(`Something went wrong during request handling: ${e?.message}`);
      return Promise.reject(e);
    }
  }

  async sdkRequest({
    command,
    options,
  }: {
    command: any,
    options: RequestInit,
  }): Promise<HttpResponse<any>> {
    try {
      if (this.runtimeConfig?.frameWindow) {
        const response = await fetchWithChannel(
          (this.runtimeConfig.frameWindow.contentWindow as Window),
          this.runtimeConfig.frameWindow.src,
          {
            url: this.runtimeConfig.endpoint,
            options,
          },
        );
        return Promise.resolve(response);
      } else {
        return this.sdkRequestHandler(command, options);
      }
    } catch (e: any) {
      console.error(`Something went wrong during SDK request: ${e?.message}, ${e?.$response}`);
      return Promise.reject(e);
    }
  }

  requestTimeout(timeoutInMs?: number): Promise<never> {
    return new Promise<never>((_, reject) => {
      if (timeoutInMs) {
        setTimeout(() => {
          const timeoutError = new Error(`Request did not complete within ${timeoutInMs} ms.`);
          timeoutError.name = "TimeoutError";
          reject(timeoutError);
        }, timeoutInMs);
      }
    });
  }

  abortRequest(abortSignal?: AbortSignal): Promise<never> {
    return new Promise<never>((_, reject) => {
      if (abortSignal) {
        abortSignal.onabort = () => {
          const abortError = new Error('Request aborted.');
          abortError.name = 'AbortError';
          reject(abortError);
        };
      }
    });
  }

  handle({
    request,
    command,
    options,
  }: {
    request: HttpRequestOptions,
    command?: any,
    options?: HttpHandlerOptions,
  }): Promise<HttpResponse<any>> {
    const { abortSignal } = options || {};
    const { requestTimeout } = this.config || {};

    // if the request was already aborted, prevent doing extra work
    if (abortSignal?.aborted) {
      const abortError = new Error("Request aborted");
      abortError.name = "AbortError";
      return Promise.reject(abortError);
    }

    const { method, headers, body, frameWindow } = request;

    const requestOptions: RequestInit = {
      method,
      headers,
      body,
      // some browsers support abort signal
      ...(!frameWindow && AbortController && abortSignal && { signal : abortSignal }),
    };

    return Promise.race([
      this.sdkRequest({ command, options: requestOptions }),
      this.requestTimeout(requestTimeout),
      this.abortRequest(abortSignal),
    ]);
  }
}
