/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SearchSessionsCommand, SearchSessionsCommandInput, SearchSessionsCommandOutput,
} from '@aws-sdk/client-qconnect';

import { Command } from './command';
import { QConnectClientResolvedConfig } from '../qConnectClient';
import { HttpRequest } from '../httpRequest';
import { buildClientRequestMiddleware } from '../utils/buildClientMiddleware';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';

export interface SearchSessionsInput extends SearchSessionsCommandInput {}

export interface SearchSessionsOutput extends SearchSessionsCommandOutput {}

export class SearchSessions extends Command<
  SearchSessionsInput,
  SearchSessionsOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: SearchSessionsInput) {
    super();
    this.vendorCode = VendorCodes.Wisdom;
    this.clientMethod = ClientMethods.SearchSessions;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<SearchSessionsOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle({
      request: this.serializeRequest(configuration),
      command: this.serializeCommand(configuration),
      options: options || {},
    });
  }

  serializeRequest(configuration: QConnectClientResolvedConfig): HttpRequest {
    const { assistantId, searchExpression } = this.clientInput;

    if ((assistantId === undefined) || !assistantId.length) {
      throw new Error('Invalid assistantId.');
    }

    if ((searchExpression === undefined) || !searchExpression?.filters || !searchExpression?.filters?.length) {
      throw new Error('Invalid searchExpression.');
    }

    return super.serializeRequest(configuration);
  }

  serializeCommand(configuration: QConnectClientResolvedConfig): SearchSessionsCommand {
    const command = new SearchSessionsCommand(this.clientInput);

    const [middleware, opt] = buildClientRequestMiddleware<SearchSessionsInput, SearchSessionsOutput>(configuration.headers);

    command.middlewareStack.add(middleware, opt);

    return command;
  }
}
