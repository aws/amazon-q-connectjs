/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GetNextMessageCommand, GetNextMessageCommandInput, GetNextMessageCommandOutput,
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

export interface GetNextMessageInput extends GetNextMessageCommandInput {}

export interface GetNextMessageOutput extends GetNextMessageCommandOutput {}

export class GetNextMessage extends Command<
  GetNextMessageInput,
  GetNextMessageOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: GetNextMessageInput) {
    super();
    this.vendorCode = VendorCodes.Wisdom;
    this.clientMethod = ClientMethods.GetNextMessage;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<GetNextMessageOutput>> {
    const requestHandler = super.getRequestHandler(configuration);
    return () => requestHandler.handle({
      request: this.serializeRequest(configuration),
      command: this.serializeCommand(configuration),
      options: options || {}
    });
  }

  serializeRequest(configuration: QConnectClientResolvedConfig): HttpRequest {
    const { assistantId, sessionId, nextMessageToken } = this.clientInput;

    if ((assistantId === undefined) || !assistantId.length) {
      throw new Error('Invalid assistantId.');
    }

    if ((sessionId === undefined) || !sessionId.length) {
      throw new Error('Invalid sessionId.');
    }

    if ((nextMessageToken === undefined) || !nextMessageToken.length) {
      throw new Error('Invalid nextMessageToken.');
    }

    return super.serializeRequest({
      ...configuration,
      headers: {
        ...configuration.headers,
        ...getDefaultHeaders({
          ...configuration,
          accessSection: configuration.accessSection ?? AccessSections.WISDOM_GET_NEXT_MESSAGE,
        }),
      },
    });
  }

  serializeCommand(configuration: QConnectClientResolvedConfig): GetNextMessageCommand {
    const command = new GetNextMessageCommand(this.clientInput);

    const [middleware, opt] = buildClientRequestMiddleware<GetNextMessageInput, GetNextMessageOutput>({
      ...configuration.headers,
      ...getDefaultHeaders({
        ...configuration,
        accessSection: configuration.accessSection ?? AccessSections.WISDOM_GET_NEXT_MESSAGE,
      }),
    });

    command.middlewareStack.add(middleware, opt);

    return command;
  }
}
