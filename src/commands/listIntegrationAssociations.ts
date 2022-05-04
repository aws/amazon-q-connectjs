/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from './command';
import { WisdomClientResolvedConfig } from '../wisdomClient';
import { HttpRequest } from '../httpRequest';
import { ListIntegrationAssociationsRequest, ListIntegrationAssociationsResponse } from '../types/models';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';
import { ServiceIds } from '../types/serviceIds';

export interface ListIntegrationAssociationsInput extends ListIntegrationAssociationsRequest {}

export interface ListIntegrationAssociationsOutput extends ListIntegrationAssociationsResponse {}

export class ListIntegrationAssociations extends Command<
  ListIntegrationAssociationsInput,
  ListIntegrationAssociationsOutput,
  WisdomClientResolvedConfig
> {
  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: ListIntegrationAssociationsInput) {
    super();
    this.clientMethod = ClientMethods.ListIntegrationAssociations;
  }

  resolveRequestHandler(
    configuration: WisdomClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<ListIntegrationAssociationsOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle(this.serialize(configuration), options || {});
  }

  serialize(configuration: WisdomClientResolvedConfig): HttpRequest {
    const { InstanceId } = this.clientInput;

    if (InstanceId === undefined) {
      throw new Error('No value provided for InstanceId.');
    } else if (!InstanceId.length) {
      throw new Error('Empty value provided for InstanceId.');
    }

    return super.serialize({
      ...configuration,
      serviceId: ServiceIds.Acs,
    });
  }
}
