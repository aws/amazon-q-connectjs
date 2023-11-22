/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from './command';
import { QConnectClientResolvedConfig } from '../qConnectClient';
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
  QConnectClientResolvedConfig
> {
  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: GetRecommendationsInput) {
    super();
    this.clientMethod = ClientMethods.GetRecommendations;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<GetRecommendationsOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle(this.serialize(configuration), options || {});
  }

  serialize(configuration: QConnectClientResolvedConfig): HttpRequest {
    const { assistantId, sessionId } = this.clientInput;

    if ((assistantId === undefined) || !assistantId.length) {
      throw new Error('Invalid assistantId.');
    }

    if ((sessionId === undefined) || !sessionId.length) {
      throw new Error('Invalid sessionId.');
    }

    return super.serialize(configuration);
  }
}
