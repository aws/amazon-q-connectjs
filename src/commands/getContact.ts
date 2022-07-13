/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from './command';
import { WisdomClientResolvedConfig } from '../wisdomClient';
import { HttpRequest } from '../httpRequest';
import { GetContactRequest, GetContactResponse } from '../types/models';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';
import { ServiceIds } from '../types/serviceIds';

export interface GetContactInput extends GetContactRequest {}

export interface GetContactOutput extends GetContactResponse {}

export class GetContact extends Command<
  GetContactInput,
  GetContactOutput,
  WisdomClientResolvedConfig
> {
  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: GetContactInput) {
    super();
    this.clientMethod = ClientMethods.GetContact;
  }

  resolveRequestHandler(
    configuration: WisdomClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<GetContactOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle(this.serialize(configuration), options || {});
  }

  serialize(configuration: WisdomClientResolvedConfig): HttpRequest {
    const { awsAccountId, instanceId, contactId } = this.clientInput;

    if ((awsAccountId === undefined) || !awsAccountId.length) {
      throw new Error('Invalid awsAccountId.');
    }

    if ((instanceId === undefined) || !instanceId.length) {
      throw new Error('Invalid instanceId.');
    }

    if ((contactId === undefined) || !contactId.length) {
      throw new Error('Invalid contactId.');
    }

    return super.serialize({
      ...configuration,
      serviceId: ServiceIds.Lcms,
    });
  }
}
