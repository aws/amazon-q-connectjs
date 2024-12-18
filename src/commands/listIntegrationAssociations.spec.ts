/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ListIntegrationAssociations } from './listIntegrationAssociations';
import * as clientMiddlware from '../utils/buildClientMiddleware';
import { getRuntimeConfig } from '../utils/runtimeConfig.browser';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';

describe('ListIntegrationAssociations', () => {
  let command: ListIntegrationAssociations;

  const config = getRuntimeConfig({
    instanceUrl: 'https://example.com',
  });
  const instanceId = '85be2a14-94d7-41f2-835e-85368acb55df';

  const mockBuildClientRequestMiddlware = jest.spyOn(clientMiddlware, 'buildClientRequestMiddleware');

  it('should properly construct the command from the inputs provided', () => {
    command = new ListIntegrationAssociations({
      InstanceId: instanceId,
    });

    expect(command.vendorCode).toEqual(VendorCodes.Connect);
    expect(command.clientMethod).toEqual(ClientMethods.ListIntegrationAssociations);
    expect(command.clientInput).toEqual({
      InstanceId: instanceId,
    });
  });

  it('should construct an HTTP request when calling serializeRequest', () => {
    command = new ListIntegrationAssociations({
      InstanceId: instanceId,
    });

    expect(command.serializeRequest(config)).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'WISDOM',
          'x-amazon-call-source': 'agent-app',
          'x-amz-access-section': 'Wisdom',
          'x-amz-target': 'AgentAppService.Acs.listIntegrationAssociations',
          'x-amz-vendor': 'connect',
        }),
        body: JSON.stringify({
          InstanceId: instanceId,
        }),
      }),
    );
  });

  it('should validate inputs when calling serializeRequest', () => {
    command = new ListIntegrationAssociations({} as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid InstanceId.');

    command = new ListIntegrationAssociations({
      InstanceId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid InstanceId.');
  });

  it('should call buildClientMiddlware when calling serializeCommand', () => {
    command = new ListIntegrationAssociations({} as any);

    expect(mockBuildClientRequestMiddlware).not.toHaveBeenCalled();

    command.serializeCommand({} as any);

    expect(mockBuildClientRequestMiddlware).toHaveBeenCalled();
  });
});
