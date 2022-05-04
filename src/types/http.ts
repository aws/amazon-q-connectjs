/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * A mapping of header names to string values. Multiple values for the same
 * header should be represented as a single string with values separated by `, `.
 */
export interface HttpHeaders {
  [key: string]: string;
}

/*
 * A mapping of query parameter names to strings or arrays of strings,
 * with the second being used when a parameter contains a list of values.
 * Value can be set to null when query is not in key-value pairs.
 */
 export interface HttpQueryParameters {
  [key: string]: string | Array<string> | null;
}

/*
 * Represents options that may returned for the HTTP response status.
 */
export interface HttpStatus {
  status: number;
  statusText?: string;
  ok?: boolean;
}

/*
 * Represents an HTTP message with headers and an optional static body.
 */
export interface HttpMessage {
  headers: HttpHeaders;
  body?: any;
}

/*
 * Represents an Http endpoint with protocol, hostname, path,
 * and optional port and query.
 */
export interface HttpEndpoint {
  protocol: string;
  hostname: string;
  port?: number;
  path: string;
  query?: HttpQueryParameters;
}

/*
 * Interface for the HTTP request class.
 * Contains address information and standard message properties.
 */
 export interface HttpRequest extends HttpEndpoint, HttpMessage {
  method: string;
}

/*
 * Interface for the HTTP response class.
 * contains status information and standard message properties.
 */
export interface HttpResponse<OutputType> extends HttpMessage, HttpStatus {
  body?: OutputType;
}

/*
 * Represents the options that may be passed to an HTTP Handler.
 */
export interface HttpHandlerOptions {
  abortSignal?: AbortSignal;
}
