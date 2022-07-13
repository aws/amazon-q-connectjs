/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ListIntegrationAssociations } from './listIntegrationAssociations';

describe('ListIntegrationAssociations', () => {
  let command: ListIntegrationAssociations;

  const instanceId = '85be2a14-94d7-41f2-835e-85368acb55df';

  it('should properly construct the command from the inputs provided', () => {
    command = new ListIntegrationAssociations({
      InstanceId: instanceId,
    });

    expect(command.clientMethod).toEqual('listIntegrationAssociations');
    expect(command.clientInput).toEqual({
      InstanceId: instanceId,
    });
  });

  it('should validate inputs when calling serialize', () => {
    command = new ListIntegrationAssociations({} as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid InstanceId.');

    command = new ListIntegrationAssociations({
      InstanceId: '',
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid InstanceId.');
  });
});
