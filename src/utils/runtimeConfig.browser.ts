/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { getRuntimeConfig as getSharedRuntimeConfig } from './runtimeConfig.shared';
import { WisdomClientConfig } from '../wisdomClient';
import { FetchHttpHandler } from '../fetchHttpHandler';
import { getDefaultHeaders } from './getDefaultHeaders';

/*
 * The default value for how many HTTP requests should be made for a
 * given SDK operation invocation before giving up
 */
const DEFAULT_MAX_ATTEMPTS = 3;

export const getRuntimeConfig = (config: WisdomClientConfig) => {
  const sharedRuntimeConfig = getSharedRuntimeConfig(config);

  return {
    ...sharedRuntimeConfig,
    ...config,
    headers: config.headers ?? getDefaultHeaders(sharedRuntimeConfig),
    maxAttempts: config.maxAttempts ?? DEFAULT_MAX_ATTEMPTS,
    requestHandler: config.requestHandler ?? new FetchHttpHandler(),
  }
}
