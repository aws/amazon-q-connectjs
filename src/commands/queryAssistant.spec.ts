/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryAssistant } from './queryAssistant';
import * as clientMiddlware from '../utils/buildClientMiddleware';
import { getRuntimeConfig } from '../utils/runtimeConfig.browser';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';

describe('QueryAssistant', () => {
  let command: QueryAssistant;

  const config = getRuntimeConfig({
    instanceUrl: 'https://example.com',
  });
  const assistantId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const queryText = 'order';

  const mockBuildClientRequestMiddlware = jest.spyOn(clientMiddlware, 'buildClientRequestMiddleware');

  it('should properly construct the command from the inputs provided', () => {
    command = new QueryAssistant({
      assistantId,
      queryText
    });

    expect(command.vendorCode).toEqual(VendorCodes.Wisdom);
    expect(command.clientMethod).toEqual(ClientMethods.QueryAssistant);
    expect(command.clientInput).toEqual({
      assistantId,
      queryText,
    });
  });

  it('should construct an HTTP request when calling serializeRequest', () => {
    command = new QueryAssistant({
      assistantId,
      queryText
    });

    expect(command.serializeRequest(config)).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'WISDOM',
          'x-amazon-call-source': 'agent-app',
          'x-amz-access-section': 'Wisdom',
          'x-amz-target': 'AgentAppService.WisdomV2.queryAssistant',
          'x-amz-vendor': 'wisdom',
        }),
        body: JSON.stringify({
          assistantId,
          queryText
        }),
      }),
    );
  });

  it('should validate inputs when calling serializeRequest', () => {
    command = new QueryAssistant({} as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid assistantId.');

    command = new QueryAssistant({
      assistantId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid assistantId.');

    command = new QueryAssistant({
      assistantId,
    } as any);
  });

  it('should call buildClientMiddlware when calling serializeCommand', () => {
    command = new QueryAssistant({} as any);

    expect(mockBuildClientRequestMiddlware).not.toHaveBeenCalled();

    command.serializeCommand({} as any);

    expect(mockBuildClientRequestMiddlware).toHaveBeenCalled();
  });
});
