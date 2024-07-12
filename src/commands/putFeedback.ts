/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PutFeedbackCommand, PutFeedbackCommandInput, PutFeedbackCommandOutput,
} from '@aws-sdk/client-qconnect';

import { Command } from './command';
import { QConnectClientResolvedConfig } from '../qConnectClient';
import { HttpRequest } from '../httpRequest';
import { buildClientRequestMiddleware } from '../utils/buildClientMiddleware';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';

export interface PutFeedbackInput extends PutFeedbackCommandInput {}

export interface PutFeedbackOutput extends PutFeedbackCommandOutput {}

export class PutFeedback extends Command<
  PutFeedbackInput,
  PutFeedbackOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: PutFeedbackInput) {
    super();
    this.vendorCode = VendorCodes.Wisdom;
    this.clientMethod = ClientMethods.PutFeedback;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<PutFeedbackOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle({
      request: this.serializeRequest(configuration),
      command: this.serializeCommand(configuration),
      options: options || {},
    });
  }

  serializeRequest(configuration: QConnectClientResolvedConfig): HttpRequest {
    const { assistantId, targetId, targetType, contentFeedback } = this.clientInput;

    if ((assistantId === undefined) || !assistantId.length) {
      throw new Error('Invalid assistantId.');
    }

    if ((targetId === undefined) || !targetId.length) {
      throw new Error('Invalid targetId.');
    }

    if (targetType === undefined) {
      throw new Error('Invalid targetType.');
    }

    if (contentFeedback === undefined) {
      throw new Error('Invalid contentFeedback.');
    }

    return super.serializeRequest(configuration);
  }

  serializeCommand(configuration: QConnectClientResolvedConfig): PutFeedbackCommand {
    const command = new PutFeedbackCommand(this.clientInput);

    const [middleware, opt] = buildClientRequestMiddleware<PutFeedbackInput, PutFeedbackOutput>(configuration.headers);

    command.middlewareStack.add(middleware, opt);

    return command;
  }
}
