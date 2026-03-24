/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { parseUrl } from '../utils/urlParser';
import { Proxies } from '../types/proxies';

export const generateEndpoint = (instanceUrl: string, proxyPath: Proxies): string => {
  const { hostname, port, protocol, path } = parseUrl(instanceUrl);
  return `${protocol}//${hostname}${port ? `:${port}` : ''}${path.replace(/\/$/, '')}${proxyPath}`;
};
