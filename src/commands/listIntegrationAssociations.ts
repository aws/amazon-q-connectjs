/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ListIntegrationAssociationsCommand, ListIntegrationAssociationsCommandInput, ListIntegrationAssociationsCommandOutput,
} from '@aws-sdk/client-connect';

import { Command } from './command';
import { QConnectClientResolvedConfig } from '../qConnectClient';
import { HttpRequest } from '../httpRequest';
import { buildClientRequestMiddleware } from '../utils/buildClientMiddleware';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';
import { ServiceIds } from '../types/serviceIds';
import { AccessSections } from '../types/accessSections';
import { getDefaultHeaders } from '../utils/getDefaultHeaders';

export interface ListIntegrationAssociationsInput extends ListIntegrationAssociationsCommandInput {}

export interface ListIntegrationAssociationsOutput extends ListIntegrationAssociationsCommandOutput {}

export class ListIntegrationAssociations extends Command<
  ListIntegrationAssociationsInput,
  ListIntegrationAssociationsOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: ListIntegrationAssociationsInput) {
    super();
    this.vendorCode = VendorCodes.Connect;
    this.clientMethod = ClientMethods.ListIntegrationAssociations;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<ListIntegrationAssociationsOutput>> {
    const requestHandler = super.getRequestHandler(configuration);
    return () => requestHandler.handle({
      request: this.serializeRequest(configuration),
      command: this.serializeCommand(configuration),
      options: options || {},
    });
  }

  serializeRequest(configuration: QConnectClientResolvedConfig): HttpRequest {
    const { InstanceId } = this.clientInput;

    if ((InstanceId === undefined) || !InstanceId.length) {
      throw new Error('Invalid InstanceId.');
    }

    return super.serializeRequest({
      ...configuration,
      serviceId: ServiceIds.Acs,
      headers: {
        ...configuration.headers,
        ...getDefaultHeaders({
          ...configuration,
          accessSection: configuration.accessSection ?? AccessSections.LIST_INTEGRATION_ASSOCIATIONS,
        }),
      },
    });
  }

  serializeCommand(configuration: QConnectClientResolvedConfig): ListIntegrationAssociationsCommand {
    const command = new ListIntegrationAssociationsCommand(this.clientInput);

    const [middleware, opt] = buildClientRequestMiddleware<ListIntegrationAssociationsInput, ListIntegrationAssociationsOutput>({
      ...configuration.headers,
      ...getDefaultHeaders({
        ...configuration,
        accessSection: configuration.accessSection ?? AccessSections.LIST_INTEGRATION_ASSOCIATIONS,
      }),
    });

    command.middlewareStack.add(middleware, opt);

    return command;
  }
}
