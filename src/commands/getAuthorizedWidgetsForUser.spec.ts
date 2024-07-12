/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { GetAuthorizedWidgetsForUser } from './getAuthorizedWidgetsForUser';
import { getRuntimeConfig } from '../utils/runtimeConfig.browser';
import { ClientMethods } from '../types/clientMethods';
import { VendorCodes } from '../types/vendorCodes';

describe('GetAuthorizedWidgetsForUser', () => {
  let command: GetAuthorizedWidgetsForUser;

  const config = getRuntimeConfig({
    instanceUrl: 'https://example.com',
  });

  it('should properly construct the command from the inputs provided', () => {
    command = new GetAuthorizedWidgetsForUser({});

    expect(command.vendorCode).toEqual(VendorCodes.Connect);
    expect(command.clientMethod).toEqual(ClientMethods.GetAuthorizedWidgetsForUser);
    expect(command.clientInput).toEqual({});
  });

  it('should construct an HTTP request when calling serializeRequest', () => {
    command = new GetAuthorizedWidgetsForUser({});

    expect(command.serializeRequest(config)).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'WISDOM',
          'x-amazon-call-source': 'agent-app',
          'x-amz-access-section': 'Wisdom',
          'x-amz-target': 'AgentAppService.AgentApp.getAuthorizedWidgetsForUser',
          'x-amz-vendor': 'connect',
        }),
        body: JSON.stringify({}),
      }),
    );
  });
});
