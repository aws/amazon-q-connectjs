/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from './command';
import { QConnectClientResolvedConfig } from '../qConnectClient';
import { HttpRequest } from '../httpRequest';
import { FetchHttpHandler } from '../fetchHttpHandler';
import { GetAuthorizedWidgetsForUserRequest, GetAuthorizedWidgetsForUserResponse } from '../types/models';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';
import { ServiceIds } from '../types/serviceIds';

export interface GetAuthorizedWidgetsForUserCommand {}

export interface GetAuthorizedWidgetsForUserInput extends GetAuthorizedWidgetsForUserRequest {}

export interface GetAuthorizedWidgetsForUserOutput extends GetAuthorizedWidgetsForUserResponse {}

export class GetAuthorizedWidgetsForUser extends Command<
  GetAuthorizedWidgetsForUserInput,
  GetAuthorizedWidgetsForUserOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: GetAuthorizedWidgetsForUserInput) {
    super();
    this.vendorCode = VendorCodes.Connect;
    this.clientMethod = ClientMethods.GetAuthorizedWidgetsForUser;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<GetAuthorizedWidgetsForUserOutput>> {
    let { requestHandler } = configuration;

    // Override RequestHandler on internal APIs
    // Public API proxy requires public vendor code.
    requestHandler = new FetchHttpHandler();

    return () => requestHandler.handle({
      request: this.serializeRequest(configuration),
      command: this.serializeCommand(configuration),
      options: options || {},
    });
  }

  serializeRequest(configuration: QConnectClientResolvedConfig): HttpRequest {
    return super.serializeRequest({
      ...configuration,
      serviceId: ServiceIds.AgentApp,
    });
  }

  serializeCommand(_configuration: QConnectClientResolvedConfig): GetAuthorizedWidgetsForUserCommand {
    return null as unknown as GetAuthorizedWidgetsForUserCommand;
  }
}
