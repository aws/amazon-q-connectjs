/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { DescribeContactFlow } from './describeContactFlow';
import { SDKHandler } from '../sdkHandler';
import * as clientMiddlware from '../utils/buildClientMiddleware';
import { getRuntimeConfig } from '../utils/runtimeConfig.browser';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { CallSources } from '../types/callSources';
import { AccessSections } from '../types/accessSections';

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

  it('should return the expected requestHandler with overrides when calling getRequestHandler', () => {
    command = new DescribeContactFlow({
      InstanceId: instanceId,
      ContactFlowId: contactFlowId,
    });

    expect(command.getRequestHandler(config)).toBeInstanceOf(
      SDKHandler,
    );
  });

  it('should construct an HTTP request when calling serializeRequest, call source is PublicApiProxy, and no access section is provided', () => {
    command = new DescribeContactFlow({
      InstanceId: instanceId,
      ContactFlowId: contactFlowId,
    });

    expect(command.serializeRequest({ ...config, callSource: CallSources.PublicApiProxy })).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'DESCRIBE_CONTACT_FLOW',
          'x-amazon-call-source': 'public-api-proxy',
          'x-amz-access-section': 'DESCRIBE_CONTACT_FLOW',
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

  it('should construct an HTTP request when calling serializeRequest, call source is PublicApiProxy, and an access section is explicitly provided', () => {
    command = new DescribeContactFlow({
      InstanceId: instanceId,
      ContactFlowId: contactFlowId,
    });

    expect(command.serializeRequest({ ...config, callSource: CallSources.PublicApiProxy, accessSection: 'SOME_ACCESS_SECTION' as AccessSections })).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'SOME_ACCESS_SECTION',
          'x-amazon-call-source': 'public-api-proxy',
          'x-amz-access-section': 'SOME_ACCESS_SECTION',
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

    command.serializeCommand(config);

    expect(mockBuildClientRequestMiddlware).toHaveBeenCalled();
  });
});
