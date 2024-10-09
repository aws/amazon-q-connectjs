/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { QConnectClientResolvedConfig } from '../qConnectClient';
import { HttpRequest } from '../httpRequest';
import { parseUrl } from '../utils/urlParser';
import { buildAmzTarget } from '../utils/buildAmzTarget';
import { buildAmzVendor } from '../utils/buildAmzVendor';
import { Command as $Command, InvokeFunction } from '../types/command';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { HttpResponse, HttpHandlerOptions } from '../types/http';

export abstract class Command<
  Input extends ClientInput,
  Output extends ClientOutput,
  ClientConfiguration,
  ClientInput extends object = any,
  ClientOutput extends object = any,
> implements $Command<ClientInput, Input, ClientOutput, Output, ClientConfiguration> {
  abstract clientInput: Input;

  abstract vendorCode: VendorCodes;

  abstract clientMethod: ClientMethods;

  abstract resolveRequestHandler(
    configuration: ClientConfiguration,
    options: HttpHandlerOptions,
  ): InvokeFunction<HttpResponse<Output>>;

  serializeRequest(configuration: QConnectClientResolvedConfig) {
    return new HttpRequest({
      ...parseUrl(configuration.endpoint),
      headers: {
        ...configuration.headers,
        ...buildAmzTarget(this.clientMethod, configuration),
        ...buildAmzVendor(this.vendorCode),
      },
      body: JSON.stringify(this.clientInput),
      frameWindow: configuration.frameWindow,
    });
  }
}
