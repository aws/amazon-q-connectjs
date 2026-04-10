/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from './command';
import { QConnectClientResolvedConfig } from '../qConnectClient';
import { HttpRequest } from '../httpRequest';
import { FetchHttpHandler } from '../fetchHttpHandler';
import { GetContactRequest, GetContactResponse } from '../types/models';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';
import { Proxies } from '../types/proxies';
import { CallSources } from '../types/callSources';
import { ServiceIds } from '../types/serviceIds';
import { generateEndpoint } from '../utils/appConfig';
import { getDefaultHeaders } from '../utils/getDefaultHeaders';

export interface GetContactCommand {}

export interface GetContactInput extends GetContactRequest {}

export interface GetContactOutput extends GetContactResponse {}

export class GetContact extends Command<
  GetContactInput,
  GetContactOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: GetContactInput) {
    super();
    this.vendorCode = VendorCodes.Connect;
    this.clientMethod = ClientMethods.GetContact;
    this.overrideHandler = new FetchHttpHandler({
      overrideChannelSupport: true,
    });
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<GetContactOutput>> {
    const requestHandler = super.getRequestHandler(configuration);
    return () => requestHandler.handle({
      request: this.serializeRequest(configuration),
      command: this.serializeCommand(configuration),
      options: options || {},
    });
  }

  serializeRequest(configuration: QConnectClientResolvedConfig): HttpRequest {
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

    return super.serializeRequest({
      ...configuration,
      serviceId: ServiceIds.Lcms,
      callSource: CallSources.AgentApp,
      endpoint: generateEndpoint(configuration.instanceUrl, Proxies.AgentApp),
      headers: {
        ...configuration.headers,
        ...getDefaultHeaders({
          ...configuration,
          callSource: CallSources.AgentApp,
        }),
      },
    });
  }

  serializeCommand(_configuration: QConnectClientResolvedConfig): GetContactCommand {
    return null as unknown as GetContactCommand;
  }
}
