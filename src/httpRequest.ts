/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpRequest as $HttpRequest, HttpEndpoint, HttpHeaders, HttpMessage, HttpQueryParameters } from './types/http';

export type HttpRequestOptions = Partial<HttpEndpoint> & Partial<HttpMessage> & {
  method?: string;
  frameWindow?: HTMLIFrameElement;
};

export class HttpRequest implements $HttpRequest {
  public method: string;
  public protocol: string;
  public hostname: string;
  public port?: number;
  public path: string;
  public query: HttpQueryParameters;
  public headers: HttpHeaders;
  public body?: any;
  public frameWindow?: HTMLIFrameElement;

  constructor(options: HttpRequestOptions) {
    this.method = options.method || 'POST';
    this.protocol = options.protocol
      ? options.protocol.charAt(options.protocol.length - 1) !== ':'
        ? `${options.protocol}:`
        : options.protocol
      : 'https:';
    this.hostname = options.hostname || 'localhost';
    this.port = options.port;
    this.path = options.path && options.path !== '/'
      ? options.path.charAt(0) !== '/'
        ? `/${options.path}`
        : options.path
      : '/agent-app/api';
    this.query = options.query || {};
    this.headers = options.headers || {};
    this.body = options.body;
    this.frameWindow = options.frameWindow;
  }
}
