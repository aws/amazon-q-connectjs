/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClientMethods } from '../types/clientMethods';
import { WidgetServices } from '../types/widgetServices';
import { WisdomClientResolvedConfig } from '../wisdomClient';

export const buildAmzTarget = (clientMethod: ClientMethods, { serviceId }: WisdomClientResolvedConfig) => {
  return {
    'x-amz-target': `AgentAppService.${WidgetServices[serviceId]}.${clientMethod}`,
  };
}