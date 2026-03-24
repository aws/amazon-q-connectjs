/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  QueryAssistantCommand, QueryAssistantCommandInput, QueryAssistantCommandOutput,
} from '@aws-sdk/client-qconnect';

import { Command } from './command';
import { QConnectClientResolvedConfig } from '../qConnectClient';
import { HttpRequest } from '../httpRequest';
import { buildClientRequestMiddleware } from '../utils/buildClientMiddleware';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';
import { AccessSections } from '../types/accessSections';
import { getDefaultHeaders } from '../utils/getDefaultHeaders';

export interface QueryAssistantInput extends QueryAssistantCommandInput {}

export interface QueryAssistantOutput extends QueryAssistantCommandOutput {}

export class QueryAssistant extends Command<
  QueryAssistantInput,
  QueryAssistantOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: QueryAssistantInput) {
    super();
    this.vendorCode = VendorCodes.Wisdom;
    this.clientMethod = ClientMethods.QueryAssistant;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<QueryAssistantOutput>> {
    const requestHandler = super.getRequestHandler(configuration);
    return () => requestHandler.handle({
      request: this.serializeRequest(configuration),
      command: this.serializeCommand(configuration),
      options: options || {}
    });
  }

  serializeRequest(configuration: QConnectClientResolvedConfig): HttpRequest {
    const { assistantId } = this.clientInput;

    if ((assistantId === undefined) || !assistantId.length) {
      throw new Error('Invalid assistantId.');
    }

    return super.serializeRequest({
      ...configuration,
      headers: {
        ...configuration.headers,
        ...getDefaultHeaders({
          ...configuration,
          accessSection: configuration.accessSection ?? AccessSections.WISDOM_QUERY_ASSISTANT,
        }),
      },
    });
  }

  serializeCommand(configuration: QConnectClientResolvedConfig): QueryAssistantCommand {
    const command = new QueryAssistantCommand(this.clientInput);

    const [middleware, opt] = buildClientRequestMiddleware<QueryAssistantInput, QueryAssistantOutput>({
      ...configuration.headers,
      ...getDefaultHeaders({
        ...configuration,
        accessSection: configuration.accessSection ?? AccessSections.WISDOM_QUERY_ASSISTANT,
      }),
    });

    command.middlewareStack.add(middleware, opt);

    return command;
  }
}
