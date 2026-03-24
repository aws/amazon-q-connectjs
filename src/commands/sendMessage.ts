/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SendMessageCommand, SendMessageCommandInput, SendMessageCommandOutput,
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

export interface SendMessageInput extends SendMessageCommandInput {}

export interface SendMessageOutput extends SendMessageCommandOutput {}

export class SendMessage extends Command<
  SendMessageInput,
  SendMessageOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: SendMessageInput) {
    super();
    this.vendorCode = VendorCodes.Wisdom;
    this.clientMethod = ClientMethods.SendMessage;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<SendMessageOutput>> {
    const requestHandler = super.getRequestHandler(configuration);
    return () => requestHandler.handle({
      request: this.serializeRequest(configuration),
      command: this.serializeCommand(configuration),
      options: options || {}
    });
  }

  serializeRequest(configuration: QConnectClientResolvedConfig): HttpRequest {
    const { assistantId, sessionId } = this.clientInput;

    if ((assistantId === undefined) || !assistantId.length) {
      throw new Error('Invalid assistantId.');
    }

    if ((sessionId === undefined) || !sessionId.length) {
      throw new Error('Invalid sessionId.');
    }

    return super.serializeRequest({
      ...configuration,
      headers: {
        ...configuration.headers,
        ...getDefaultHeaders({
          ...configuration,
          accessSection: configuration.accessSection ?? AccessSections.WISDOM_SEND_MESSAGE,
        }),
      },
    });
  }

  serializeCommand(configuration: QConnectClientResolvedConfig): SendMessageCommand {
    const command = new SendMessageCommand(this.clientInput);

    const [middleware, opt] = buildClientRequestMiddleware<SendMessageInput, SendMessageOutput>({
      ...configuration.headers,
      ...getDefaultHeaders({
        ...configuration,
        accessSection: configuration.accessSection ?? AccessSections.WISDOM_SEND_MESSAGE,
      }),
    });

    command.middlewareStack.add(middleware, opt);

    return command;
  }
}
