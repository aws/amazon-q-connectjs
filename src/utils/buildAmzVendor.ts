/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { VendorCodes } from '../types/vendorCodes';

export const buildAmzVendor = (vendorCode: VendorCodes) => {
  return {
    'x-amz-vendor': vendorCode,
  };
}
