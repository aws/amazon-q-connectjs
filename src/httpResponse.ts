/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpResponse as $HttpResponse, HttpHeaders, HttpMessage, HttpStatus } from './types/http';

type HttpResponseOptions = HttpStatus & HttpMessage;

export class HttpResponse implements $HttpResponse<any> {
  public status: number;
  public statusText?: string;
  public ok?: boolean;
  public headers: HttpHeaders;
  public body?: any;

  constructor(options: HttpResponseOptions) {
    this.status = options.status;
    this.statusText = options.statusText;
    this.ok = options.ok;
    this.headers = options.headers || {};
    this.body = options.body;
  }
}
