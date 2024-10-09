/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DescribeContactCommand, DescribeContactCommandInput, DescribeContactCommandOutput,
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

export interface DescribeContactInput extends DescribeContactCommandInput {}

export interface DescribeContactOutput extends DescribeContactCommandOutput {}

export class DescribeContact extends Command<
  DescribeContactCommandInput,
  DescribeContactCommandOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: DescribeContactCommandInput) {
    super();
    this.vendorCode = VendorCodes.Connect;
    this.clientMethod = ClientMethods.DescribeContact;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<DescribeContactCommandOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle({
      request: this.serializeRequest(configuration),
      command: this.serializeCommand(configuration),
      options: options || {},
    });
  }

  serializeRequest(configuration: QConnectClientResolvedConfig): HttpRequest {
    const { InstanceId, ContactId } = this.clientInput;

    if ((InstanceId === undefined) || !InstanceId.length) {
      throw new Error('Invalid InstanceId.');
    }

    if ((ContactId === undefined) || !ContactId.length) {
      throw new Error('Invalid ContactId.');
    }

    return super.serializeRequest({
      ...configuration,
      serviceId: ServiceIds.Acs,
    });
  }

  serializeCommand(configuration: QConnectClientResolvedConfig): DescribeContactCommand {
    const command = new DescribeContactCommand(this.clientInput);

    const [middleware, opt] = buildClientRequestMiddleware<DescribeContactInput, DescribeContactOutput>(configuration.headers);

    command.middlewareStack.add(middleware, opt);

    return command;
  }
}
