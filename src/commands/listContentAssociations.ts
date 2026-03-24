/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ListContentAssociationsCommand, ListContentAssociationsCommandInput, ListContentAssociationsCommandOutput
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

export interface ListContentAssociationsInput extends ListContentAssociationsCommandInput {}

export interface ListContentAssociationsOutput extends ListContentAssociationsCommandOutput {}

export class ListContentAssociations extends Command<
  ListContentAssociationsInput,
  ListContentAssociationsOutput,
  QConnectClientResolvedConfig
> {
  readonly vendorCode: VendorCodes;

  readonly clientMethod: ClientMethods;

  constructor(readonly clientInput: ListContentAssociationsInput) {
    super();
    this.vendorCode = VendorCodes.Wisdom;
    this.clientMethod = ClientMethods.ListContentAssociations;
  }

  resolveRequestHandler(
    configuration: QConnectClientResolvedConfig,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<ListContentAssociationsOutput>> {
    const requestHandler = super.getRequestHandler(configuration);
    return () => requestHandler.handle({
      request: this.serializeRequest(configuration),
      command: this.serializeCommand(configuration),
      options: options || {},
    });
  }

  serializeRequest(configuration: QConnectClientResolvedConfig): HttpRequest {
    const { contentId, knowledgeBaseId } = this.clientInput;

    if ((contentId === undefined) || !contentId.length) {
      throw new Error('Invalid contentId.');
    }

    if ((knowledgeBaseId === undefined) || !knowledgeBaseId.length) {
      throw new Error('Invalid knowledgeBaseId.');
    }

    return super.serializeRequest({
      ...configuration,
      headers: {
        ...configuration.headers,
        ...getDefaultHeaders({
          ...configuration,
          accessSection: configuration.accessSection ?? AccessSections.WISDOM_LIST_CONTENT_ASSOCIATIONS,
        }),
      },
    });
  }

  serializeCommand(configuration: QConnectClientResolvedConfig): ListContentAssociationsCommand {
    const command = new ListContentAssociationsCommand(this.clientInput);

    const [middleware, opt] = buildClientRequestMiddleware<ListContentAssociationsInput, ListContentAssociationsOutput>({
      ...configuration.headers,
      ...getDefaultHeaders({
        ...configuration,
        accessSection: configuration.accessSection ?? AccessSections.WISDOM_LIST_CONTENT_ASSOCIATIONS,
      }),
    });

    command.middlewareStack.add(middleware, opt);

    return command;
  }
}
