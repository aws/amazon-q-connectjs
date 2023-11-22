/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { QConnectClientResolvedConfig } from "../qConnectClient";

export interface RequestHandler<RequestType, ResponseType, HandlerOptions> {
  setRuntimeConfig: (
    config: QConnectClientResolvedConfig,
  ) => void;

  handle: (
    request: RequestType,
    HandlerOptions?: HandlerOptions,
  ) => Promise<ResponseType>;
}
