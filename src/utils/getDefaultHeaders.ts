/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { HttpHeaders } from '../types/http';

const BASE_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export const getDefaultHeaders = ({ callSource, serviceId, accessSection }: any): HttpHeaders => {
  return {
    ...BASE_HEADERS,
    'x-access-section': accessSection || serviceId.toUpperCase(),
    'x-amazon-call-source': callSource,
    'x-amz-access-section': accessSection || serviceId,
  };
}
