/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from './command';
import { WisdomClientResolvedConfig } from '../wisdomClient';
import { HttpRequest } from '../httpRequest';
import { GetRecommendationsRequest, GetRecommendationsResponse } from '../types/models';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';

export interface GetRecommendationsInput extends GetRecommendationsRequest {}

export interface GetRecommendationsOutput extends GetRecommendationsResponse {}

export class GetRecommendations extends Command<
  GetRecommendationsInput,
  GetRecommendationsOutput,
  WisdomClientResolvedConfig
> {
  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: GetRecommendationsInput) {
    super();
    this.clientMethod = ClientMethods.GetRecommendations;
  }

  resolveRequestHandler(
    configuration: WisdomClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<GetRecommendationsOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle(this.serialize(configuration), options || {});
  }

  serialize(configuration: WisdomClientResolvedConfig): HttpRequest {
    const { assistantId, sessionId } = this.clientInput;

    if (assistantId === undefined) {
      throw new Error('No value provided for assistandId.');
    } else if (!assistantId.length) {
      throw new Error('Empty value provided for assistantId.');
    }

    if (sessionId === undefined) {
      throw new Error('No value provided for sessionId.');
    } else if (!sessionId.length) {
      throw new Error('Empty value provided for sessionId.');
    }

    return super.serialize(configuration);
  }
}
