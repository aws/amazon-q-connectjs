/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from './command';
import { QConnectClientResolvedConfig } from '../qConnectClient';
import { HttpRequest } from '../httpRequest';
import { NotifyRecommendationsReceivedRequest, NotifyRecommendationsReceivedResponse } from '../types/models';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';

export interface NotifyRecommendationsReceivedInput extends NotifyRecommendationsReceivedRequest {}

export interface NotifyRecommendationsReceivedOutput extends NotifyRecommendationsReceivedResponse {}

export class NotifyRecommendationsReceived extends Command<
  NotifyRecommendationsReceivedInput,
  NotifyRecommendationsReceivedOutput,
  QConnectClientResolvedConfig
> {
  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: NotifyRecommendationsReceivedInput) {
    super();
    this.clientMethod = ClientMethods.NotifyRecommendationsReceived;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<NotifyRecommendationsReceivedOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle(this.serialize(configuration), options || {});
  }

  serialize(configuration: QConnectClientResolvedConfig): HttpRequest {
    const { assistantId, sessionId, recommendationIds } = this.clientInput;

    if ((assistantId === undefined) || !assistantId.length) {
      throw new Error('Invalid assistantId.');
    }

    if ((sessionId === undefined) || !sessionId.length) {
      throw new Error('Invalid sessionId.');
    }

    if ((recommendationIds === undefined) || !recommendationIds.length) {
      throw new Error('Invalid recommendationIds.');
    }

    return super.serialize(configuration);
  }
}
