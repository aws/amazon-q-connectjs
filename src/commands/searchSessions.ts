/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from './command';
import { WisdomClientResolvedConfig } from '../wisdomClient';
import { HttpRequest } from '../httpRequest';
import { SearchSessionsRequest, SearchSessionsResponse } from '../types/models';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';

export interface SearchSessionsInput extends SearchSessionsRequest {}

export interface SearchSessionsOutput extends SearchSessionsResponse {}

export class SearchSessions extends Command<
  SearchSessionsInput,
  SearchSessionsOutput,
  WisdomClientResolvedConfig
> {
  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: SearchSessionsInput) {
    super();
    this.clientMethod = ClientMethods.SearchSessions;
  }

  resolveRequestHandler(
    configuration: WisdomClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<SearchSessionsOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle(this.serialize(configuration), options || {});
  }

  serialize(configuration: WisdomClientResolvedConfig): HttpRequest {
    const { assistantId, searchExpression } = this.clientInput;

    if (assistantId === undefined) {
      throw new Error('No value provided for assistandId.');
    } else if (!assistantId.length) {
      throw new Error('Empty value provided for assistantId.');
    }

    if (searchExpression === undefined) {
      throw new Error('No value provided for searchExpression.');
    } else if (!searchExpression.filters.length) {
      throw new Error('No filters provided for searchExpression.');
    }

    return super.serialize(configuration);
  }
}
