/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { parseUrl } from '../utils/urlParser';

export const generateEndpoint = (instanceUrl: string): string => {
  const { hostname, port, protocol, path } = parseUrl(instanceUrl);
  return `${protocol}//${hostname}${port ? `:${port}` : ''}${path.replace(/\/$/, '')}/agent-app/api`;
};
