/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from './command';
import { WisdomClientResolvedConfig } from '../wisdomClient';
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
  WisdomClientResolvedConfig
> {
  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: GetContentInput) {
    super();
    this.clientMethod = ClientMethods.GetContent;
  }

  resolveRequestHandler(
    configuration: WisdomClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<GetContentOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle(this.serialize(configuration), options || {});
  }

  serialize(configuration: WisdomClientResolvedConfig): HttpRequest {
    const { contentId, knowledgeBaseId } = this.clientInput;

    if (contentId === undefined) {
      throw new Error('No value provided for contentId.');
    } else if (!contentId.length) {
      throw new Error('Empty value provided for contentId.');
    }

    if (knowledgeBaseId === undefined) {
      throw new Error('No value provided for knowledgeBaseId.');
    } else if (!knowledgeBaseId.length) {
      throw new Error('Empty value provided for knowledgeBaseId.');
    }

    return super.serialize(configuration);
  }
}
