/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClientConfiguration } from '../client';
import { getBaseUrl } from './urlParser';
import { Logger } from '../types/logger';
import { CallSources } from '../types/callSources';
import { ServiceIds } from '../types/serviceIds';
import { generateEndpoint } from '../utils/appConfig';

export const getRuntimeConfig = (config: ClientConfiguration) => {
  return {
    logger: config?.logger ?? ({} as Logger),
    serviceId: config?.serviceId ?? ServiceIds.AmazonQConnect,
    callSource: config?.callSource ?? CallSources.AgentApp,
    instanceUrl: config?.instanceUrl ?? getBaseUrl(),
    endpoint: config?.endpoint || generateEndpoint(config?.instanceUrl || getBaseUrl()),
  }
}
