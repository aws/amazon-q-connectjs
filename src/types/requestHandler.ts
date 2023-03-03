/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { WisdomClientResolvedConfig } from "../wisdomClient";

export interface RequestHandler<RequestType, ResponseType, HandlerOptions> {
  setRuntimeConfig: (
    config: WisdomClientResolvedConfig,
  ) => void;

  handle: (
    request: RequestType,
    HandlerOptions?: HandlerOptions,
  ) => Promise<ResponseType>;
}
