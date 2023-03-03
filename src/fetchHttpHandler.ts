/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { WisdomClientResolvedConfig } from './wisdomClient';
import { HttpRequestOptions } from './httpRequest';
import { fetchWithChannel, subscribeToChannel } from './utils/communicationProxy';
import { HttpResponse, HttpHeaders, HttpHandlerOptions } from './types/http';
import { RequestHandler } from './types/requestHandler';
import { Commands } from './types/command';
import { parseAmzTarget } from './utils/buildAmzTarget';

/*
 * Represents the http options that can be passed to a browser http client.
 */
 export interface FetchHttpHandlerOptions {
  /*
   * The number of milliseconds a request can take before being automatically
   * terminated.
   */
  requestTimeout?: number;
}

export class FetchHttpHandler implements RequestHandler<HttpRequestOptions, HttpResponse<any>, HttpHandlerOptions> {
  private runtimeConfig?: WisdomClientResolvedConfig;
  private config?: FetchHttpHandlerOptions;

  constructor(config?: FetchHttpHandlerOptions) {
    this.config = config ?? {};

    subscribeToChannel(this.channelRequestHandler.bind(this));
  }

  setRuntimeConfig(config: WisdomClientResolvedConfig) {
    this.runtimeConfig = config;
  }

  async responseHandler(response: any): Promise<HttpResponse<any>> {
    const { status, statusText, ok, headers, body } = response;
    const fetchHeaders: any = headers;
    const transformedHeaders: HttpHeaders = {};

    for (const pair of <Array<string[]>>fetchHeaders.entries()) {
      transformedHeaders[pair[0]] = pair[1];
    }

    const hasReadableStream = body !== undefined;

    // Return the response with buffered body
    if (!hasReadableStream) {
      return response.blob()
        .then(() => {
          return {
            status,
            statusText,
            ok,
            headers: transformedHeaders,
            body: response.json(),
          };
        });
    }

    const reader = body.getReader();
    let res = new Uint8Array(0);
    let isDone = false;

    while (!isDone) {
      const { done, value } = await reader.read();
      if (value) {
        const prior = res;
        res = new Uint8Array(prior.length + value.length);
        res.set(prior);
        res.set(value, prior.length);
      }
      isDone = done;
    }

    return {
      status,
      statusText,
      ok,
      headers: transformedHeaders,
      body: JSON.parse(new TextDecoder('utf8').decode(res)),
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

      return this.handle(clientCommand.serialize(this.runtimeConfig as WisdomClientResolvedConfig), {});
    } catch (e) {
      console.log('Something went wrong during request.', e);
      return Promise.reject(e);
    }
  }

  async fetchRequestHandler(url: string, options: RequestInit): Promise<HttpResponse<any>> {
    try {
      const response = await fetch(url, options);
      return this.responseHandler(response);
    } catch (e) {
      console.log('Something went wrong during request.', e);
      return Promise.reject(e);
    }
  }

  async fetchRequest(url: string, options: RequestInit, frameWindow?: HTMLIFrameElement): Promise<HttpResponse<any>> {
    try {
      if (frameWindow) {
        const response = await fetchWithChannel(
          (frameWindow.contentWindow as Window),
          frameWindow.src,
          { url, options },
        );
        return Promise.resolve(response);
      } else {
        return this.fetchRequestHandler(url, options);
      }
    } catch (e) {
      console.log('Something went wrong during request.', e);
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

  handle(
    request: HttpRequestOptions,
    options?: HttpHandlerOptions,
  ): Promise<HttpResponse<any>> {
    const { abortSignal } = options || {};
    const { requestTimeout } = this.config || {};

    // if the request was already aborted, prevent doing extra work
    if (abortSignal?.aborted) {
      const abortError = new Error("Request aborted");
      abortError.name = "AbortError";
      return Promise.reject(abortError);
    }

    const { protocol, hostname, port, path, method, headers, body, frameWindow } = request;
    const url = `${protocol}//${hostname}${port ? `:${port}` : ''}${path}`;

    const requestOptions: RequestInit = {
      method,
      headers,
      body,
      // some browsers support abort signal
      ...(!frameWindow && AbortController && abortSignal && { signal : abortSignal }),
    };

    return Promise.race([
      this.fetchRequest(url, requestOptions, frameWindow),
      this.requestTimeout(requestTimeout),
      this.abortRequest(abortSignal),
    ]);
  }
}
