/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DescribeContactFlowCommand, DescribeContactFlowCommandInput, DescribeContactFlowCommandOutput,
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

export interface DescribeContactFlowInput extends DescribeContactFlowCommandInput {}

export interface DescribeContactFlowOutput extends DescribeContactFlowCommandOutput {}

export class DescribeContactFlow extends Command<
  DescribeContactFlowCommandInput,
  DescribeContactFlowCommandOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: DescribeContactFlowCommandInput) {
    super();
    this.vendorCode = VendorCodes.Connect;
    this.clientMethod = ClientMethods.DescribeContactFlow;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<DescribeContactFlowCommandOutput>> {
    const { requestHandler } = configuration;
    return () => requestHandler.handle({
      request: this.serializeRequest(configuration),
      command: this.serializeCommand(configuration),
      options: options || {},
    });
  }

  serializeRequest(configuration: QConnectClientResolvedConfig): HttpRequest {
    const { InstanceId, ContactFlowId } = this.clientInput;

    if ((InstanceId === undefined) || !InstanceId.length) {
      throw new Error('Invalid InstanceId.');
    }

    if ((ContactFlowId === undefined) || !ContactFlowId.length) {
      throw new Error('Invalid ContactFlowId.');
    }

    return super.serializeRequest({
      ...configuration,
      serviceId: ServiceIds.Acs,
    });
  }

  serializeCommand(configuration: QConnectClientResolvedConfig): DescribeContactFlowCommand {
    const command = new DescribeContactFlowCommand(this.clientInput);

    const [middleware, opt] = buildClientRequestMiddleware<DescribeContactFlowInput, DescribeContactFlowOutput>(configuration.headers);

    command.middlewareStack.add(middleware, opt);

    return command;
  }
}
