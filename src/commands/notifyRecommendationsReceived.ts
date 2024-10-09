/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  NotifyRecommendationsReceivedCommand, NotifyRecommendationsReceivedCommandInput, NotifyRecommendationsReceivedCommandOutput,
} from '@aws-sdk/client-qconnect';

import { Command } from './command';
import { QConnectClientResolvedConfig } from '../qConnectClient';
import { HttpRequest } from '../httpRequest';
import { buildClientRequestMiddleware } from '../utils/buildClientMiddleware';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';

export interface NotifyRecommendationsReceivedInput extends NotifyRecommendationsReceivedCommandInput {}

export interface NotifyRecommendationsReceivedOutput extends NotifyRecommendationsReceivedCommandOutput {}

export class NotifyRecommendationsReceived extends Command<
  NotifyRecommendationsReceivedInput,
  NotifyRecommendationsReceivedOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: NotifyRecommendationsReceivedInput) {
    super();
    this.vendorCode = VendorCodes.Wisdom;
    this.clientMethod = ClientMethods.NotifyRecommendationsReceived;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<NotifyRecommendationsReceivedOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle({
      request: this.serializeRequest(configuration),
      command: this.serializeCommand(configuration),
      options: options || {},
    });
  }

  serializeRequest(configuration: QConnectClientResolvedConfig): HttpRequest {
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

    return super.serializeRequest(configuration);
  }

  serializeCommand(configuration: QConnectClientResolvedConfig): NotifyRecommendationsReceivedCommand {
    const command = new NotifyRecommendationsReceivedCommand(this.clientInput);

    const [middleware, opt] = buildClientRequestMiddleware<NotifyRecommendationsReceivedInput, NotifyRecommendationsReceivedOutput>(configuration.headers);

    command.middlewareStack.add(middleware, opt);

    return command;
  }
}
