/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClientMethods, QConnectMethods, AgentAppMethods, AcsMethods, LcmsMethods } from '../types/clientMethods';
import { WidgetServices } from '../types/widgetServices';
import { QConnectClientResolvedConfig } from '../qConnectClient';

export const buildAmzTarget = (clientMethod: ClientMethods, { serviceId }: QConnectClientResolvedConfig) => {
  return {
    'x-amz-target': `AgentAppService.${WidgetServices[serviceId]}.${clientMethod}`,
  };
}

export const parseAmzTarget = (xAmzTarget: string): ClientMethods => {
  // Parse the widget service and client method from the x-amz-target
  const [prefix, widgetService, clientMethod]  = xAmzTarget?.split('.') || [];

  // Verify the service prefix
  if (!prefix || prefix !== 'AgentAppService') {
    throw new Error('Unsupported service prefix.')
  }

  // Verify the widget service as a supported widget service
  if (!widgetService || !(<any>Object).values(WidgetServices).includes(widgetService)) {
    throw new Error('Unsupported service.')
  }

  // Verify the client method as a supported client method
  let serviceMethods;

  switch (widgetService) {
    case WidgetServices.AmazonQConnect:
      serviceMethods = QConnectMethods;
      break;
    case WidgetServices.AgentApp:
      serviceMethods = AgentAppMethods;
      break;
    case WidgetServices.Acs:
      serviceMethods = AcsMethods;
      break;
    case WidgetServices.Lcms:
      serviceMethods = LcmsMethods;
      break;
  }

  if (!clientMethod || !(<any>Object).values(serviceMethods).includes(clientMethod)) {
    throw new Error('Unsupported client method.');
  }

  return clientMethod as ClientMethods;
}