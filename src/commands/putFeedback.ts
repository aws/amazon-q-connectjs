/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from './command';
import { QConnectClientResolvedConfig } from '../qConnectClient';
import { HttpRequest } from '../httpRequest';
import { PutFeedbackRequest, PutFeedbackResponse } from '../types/models';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';

export interface PutFeedbackInput extends PutFeedbackRequest {}

export interface PutFeedbackOutput extends PutFeedbackResponse {}

export class PutFeedback extends Command<
  PutFeedbackInput,
  PutFeedbackOutput,
  QConnectClientResolvedConfig
> {
  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: PutFeedbackInput) {
    super();
    this.clientMethod = ClientMethods.PutFeedback;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<PutFeedbackOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle(this.serialize(configuration), options || {});
  }

  serialize(configuration: QConnectClientResolvedConfig): HttpRequest {
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

    return super.serialize(configuration);
  }
}
