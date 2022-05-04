/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from './command';
import { WisdomClientResolvedConfig } from '../wisdomClient';
import { HttpRequest } from '../httpRequest';
import { GetAuthorizedWidgetsForUserRequest, GetAuthorizedWidgetsForUserResponse } from '../types/models';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';
import { ServiceIds } from '../types/serviceIds';

export interface GetAuthorizedWidgetsForUserInput extends GetAuthorizedWidgetsForUserRequest {}

export interface GetAuthorizedWidgetsForUserOutput extends GetAuthorizedWidgetsForUserResponse {}

export class GetAuthorizedWidgetsForUser extends Command<
  GetAuthorizedWidgetsForUserInput,
  GetAuthorizedWidgetsForUserOutput,
  WisdomClientResolvedConfig
> {
  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: GetAuthorizedWidgetsForUserInput) {
    super();
    this.clientMethod = ClientMethods.GetAuthorizedWidgetsForUser;
  }

  resolveRequestHandler(
    configuration: WisdomClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<GetAuthorizedWidgetsForUserOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle(this.serialize(configuration), options || {});
  }

  serialize(configuration: WisdomClientResolvedConfig): HttpRequest {
    return super.serialize({
      ...configuration,
      serviceId: ServiceIds.AgentApp,
    });
  }
}
