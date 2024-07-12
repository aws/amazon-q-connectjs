/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GetContentCommand, GetContentCommandInput, GetContentCommandOutput
} from '@aws-sdk/client-qconnect';

import { Command } from './command';
import { QConnectClientResolvedConfig } from '../qConnectClient';
import { HttpRequest } from '../httpRequest';
import { buildClientRequestMiddleware } from '../utils/buildClientMiddleware';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';

export interface GetContentInput extends GetContentCommandInput {}

export interface GetContentOutput extends GetContentCommandOutput {}

export class GetContent extends Command<
  GetContentInput,
  GetContentOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: GetContentInput) {
    super();
    this.vendorCode = VendorCodes.Wisdom;
    this.clientMethod = ClientMethods.GetContent;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<GetContentOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle({
      request: this.serializeRequest(configuration),
      command: this.serializeCommand(configuration),
      options: options || {},
    });
  }

  serializeRequest(configuration: QConnectClientResolvedConfig): HttpRequest {
    const { contentId, knowledgeBaseId } = this.clientInput;

    if ((contentId === undefined) || !contentId.length) {
      throw new Error('Invalid contentId.');
    }

    if ((knowledgeBaseId === undefined) || !knowledgeBaseId.length) {
      throw new Error('Invalid knowledgeBaseId.');
    }

    return super.serializeRequest(configuration);
  }

  serializeCommand(configuration: QConnectClientResolvedConfig): GetContentCommand {
    const command = new GetContentCommand(this.clientInput);

    const [middleware, opt] = buildClientRequestMiddleware<GetContentInput, GetContentOutput>(configuration.headers);

    command.middlewareStack.add(middleware, opt);

    return command;
  }
}
