/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GetSessionCommand, GetSessionCommandInput, GetSessionCommandOutput,
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

export interface GetSessionInput extends GetSessionCommandInput {}

export interface GetSessionOutput extends GetSessionCommandOutput {}

export class GetSession extends Command<
  GetSessionInput,
  GetSessionOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: GetSessionInput) {
    super();
    this.vendorCode = VendorCodes.Wisdom;
    this.clientMethod = ClientMethods.GetSession;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<GetSessionOutput>> {
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
          accessSection: configuration.accessSection ?? AccessSections.WISDOM_GET_SESSION,
        }),
      },
    });
  }

  serializeCommand(configuration: QConnectClientResolvedConfig): GetSessionCommand {
    const command = new GetSessionCommand(this.clientInput);

    const [middleware, opt] = buildClientRequestMiddleware<GetSessionInput, GetSessionOutput>({
      ...configuration.headers,
      ...getDefaultHeaders({
        ...configuration,
        accessSection: configuration.accessSection ?? AccessSections.WISDOM_GET_SESSION,
      }),
    });

    command.middlewareStack.add(middleware, opt);

    return command;
  }
}
