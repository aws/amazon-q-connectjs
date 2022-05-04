/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpEndpoint } from '../types/http';

export const getBaseUrl = (): string => {
  return global.location.href;
};

export const parseUrl = (url: string): HttpEndpoint => {
  const { hostname, pathname, port, protocol } = new URL(url);

  return {
    hostname,
    port: port ? parseInt(port) : undefined,
    protocol,
    path: pathname,
  };
};
