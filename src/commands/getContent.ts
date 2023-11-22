/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from './command';
import { QConnectClientResolvedConfig } from '../qConnectClient';
import { HttpRequest } from '../httpRequest';
import { GetContentRequest, GetContentResponse } from '../types/models';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';

export interface GetContentInput extends GetContentRequest {}

export interface GetContentOutput extends GetContentResponse {}

export class GetContent extends Command<
  GetContentInput,
  GetContentOutput,
  QConnectClientResolvedConfig
> {
  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: GetContentInput) {
    super();
    this.clientMethod = ClientMethods.GetContent;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<GetContentOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle(this.serialize(configuration), options || {});
  }

  serialize(configuration: QConnectClientResolvedConfig): HttpRequest {
    const { contentId, knowledgeBaseId } = this.clientInput;

    if ((contentId === undefined) || !contentId.length) {
      throw new Error('Invalid contentId.');
    }

    if ((knowledgeBaseId === undefined) || !knowledgeBaseId.length) {
      throw new Error('Invalid knowledgeBaseId.');
    }

    return super.serialize(configuration);
  }
}
