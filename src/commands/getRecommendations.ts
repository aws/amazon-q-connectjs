/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GetRecommendationsCommand, GetRecommendationsCommandInput, GetRecommendationsCommandOutput,
} from '@aws-sdk/client-qconnect';

import { Command } from './command';
import { QConnectClientResolvedConfig } from '../qConnectClient';
import { HttpRequest } from '../httpRequest';
import { FetchHttpHandler } from '../fetchHttpHandler';
import { buildClientRequestMiddleware } from '../utils/buildClientMiddleware';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { InvokeFunction } from '../types/command';
import { HttpResponse, HttpHandlerOptions } from '../types/http';

export interface GetRecommendationsInput extends GetRecommendationsCommandInput {}

export interface GetRecommendationsOutput extends GetRecommendationsCommandOutput {}

export class GetRecommendations extends Command<
  GetRecommendationsInput,
  GetRecommendationsOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: GetRecommendationsInput) {
    super();
    this.vendorCode = VendorCodes.Wisdom;
    this.clientMethod = ClientMethods.GetRecommendations;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<GetRecommendationsOutput>> {
    let { requestHandler } = configuration;

    if (this.clientInput.waitTimeSeconds && this.clientInput.waitTimeSeconds > 5) {
      // Override RequestHandler when using waitTimeSeconds
      // Public API proxy enforces timeout at 8s.
      // https://code.amazon.com/packages/LilyWebsitePublicApiProxy/blobs/fafd28384b4af1162f41b642e8cba06bee217948/--/lib/client/service-proxy.ts#L130
      requestHandler = new FetchHttpHandler();
    }

    return () => requestHandler.handle({
      request: this.serializeRequest(configuration),
      command: this.serializeCommand(configuration),
      options: options || {},
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

    return super.serializeRequest(configuration);
  }

  serializeCommand(configuration: QConnectClientResolvedConfig): GetRecommendationsCommand {
    const command = new GetRecommendationsCommand(this.clientInput);

    const [middleware, opt] = buildClientRequestMiddleware<GetRecommendationsInput, GetRecommendationsOutput>(configuration.headers);

    command.middlewareStack.add(middleware, opt);

    return command;
  }
}
