/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { getRuntimeConfig as getSharedRuntimeConfig } from './runtimeConfig.shared';
import { ClientConfiguration } from '../client';
import { FetchHttpHandler } from '../fetchHttpHandler';
import { SDKHandler } from '../sdkHandler';
import { getDefaultHeaders } from './getDefaultHeaders';
import { CallSources } from '../types/callSources';
import { RequestHandler } from '../types/requestHandler';
import { HttpHandlerOptions } from '../types/http';

/*
 * The default value for how many HTTP requests should be made for a
 * given SDK operation invocation before giving up
 */
const DEFAULT_MAX_ATTEMPTS = 3;

export const getRuntimeConfig = (config: ClientConfiguration) => {
  const sharedRuntimeConfig = getSharedRuntimeConfig(config);

  return {
    ...sharedRuntimeConfig,
    ...config,
    headers: config.headers ?? getDefaultHeaders(sharedRuntimeConfig),
    maxAttempts: config.maxAttempts ?? DEFAULT_MAX_ATTEMPTS,
    requestHandler: config.requestHandler ?? (sharedRuntimeConfig.callSource === CallSources.PublicApiProxy
      ? new SDKHandler()
      : new FetchHttpHandler()) as RequestHandler<any, any, HttpHandlerOptions>,
  }
}
