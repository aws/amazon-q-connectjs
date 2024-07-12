/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { DescribeContactFlow } from './describeContactFlow';
import * as clientMiddlware from '../utils/buildClientMiddleware';
import { getRuntimeConfig } from '../utils/runtimeConfig.browser';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';

describe('DescribeContactFlow', () => {
  let command: DescribeContactFlow;

  const config = getRuntimeConfig({
    instanceUrl: 'https://example.com',
  });
  const instanceId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const contactFlowId = '66c87b19-f867-45bc-923f-da04abf2a8f0';

  const mockBuildClientRequestMiddlware = jest.spyOn(clientMiddlware, 'buildClientRequestMiddleware');

  it('should properly construct the command from the inputs provided', () => {
    command = new DescribeContactFlow({
      InstanceId: instanceId,
      ContactFlowId: contactFlowId,
    });

    expect(command.vendorCode).toEqual(VendorCodes.Connect);
    expect(command.clientMethod).toEqual(ClientMethods.DescribeContactFlow);
    expect(command.clientInput).toEqual({
      InstanceId: instanceId,
      ContactFlowId: contactFlowId,
    });
  });

  it('should consturct an HTTP request when calling serializeRequest', () => {
    command = new DescribeContactFlow({
      InstanceId: instanceId,
      ContactFlowId: contactFlowId,
    });

    expect(command.serializeRequest(config)).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'WISDOM',
          'x-amazon-call-source': 'agent-app',
          'x-amz-access-section': 'Wisdom',
          'x-amz-target': 'AgentAppService.Acs.describeContactFlow',
          'x-amz-vendor': 'connect',
        }),
        body: JSON.stringify({
          InstanceId: instanceId,
          ContactFlowId: contactFlowId,
        }),
      }),
    );
  });

  it('should validate inputs when calling serializeRequest', () => {
    command = new DescribeContactFlow({} as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid InstanceId.');

    command = new DescribeContactFlow({
      InstanceId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid InstanceId.');
  });

  it('should call buildClientMiddlware when calling serializeCommand', () => {
    command = new DescribeContactFlow({} as any);

    expect(mockBuildClientRequestMiddlware).not.toHaveBeenCalled();

    command.serializeCommand({} as any);

    expect(mockBuildClientRequestMiddlware).toHaveBeenCalled();
  });
});
