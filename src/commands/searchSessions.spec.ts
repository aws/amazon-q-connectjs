/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { SearchSessions } from './searchSessions';
import * as clientMiddlware from '../utils/buildClientMiddleware';
import { getRuntimeConfig } from '../utils/runtimeConfig.browser';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';

describe('SearchSessions', () => {
  let command: SearchSessions;

  const config = getRuntimeConfig({
    instanceUrl: 'https://example.com',
  });
  const assistantId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const searchExpression = {
    filters: [
      {
        field: 'NAME',
        operator: 'EQUALS',
        value: '249bbb30-aede-42a8-be85-d8483c317686',
      },
    ],
  } as any;

  const mockBuildClientRequestMiddlware = jest.spyOn(clientMiddlware, 'buildClientRequestMiddleware');

  it('should properly construct the command from the inputs provided', () => {
    command = new SearchSessions({
      assistantId,
      searchExpression,
    });

    expect(command.vendorCode).toEqual(VendorCodes.Wisdom);
    expect(command.clientMethod).toEqual(ClientMethods.SearchSessions);
    expect(command.clientInput).toEqual({
      assistantId,
      searchExpression,
    });
  });

  it('should construct an HTTP request when calling serializeRequest', () => {
    command = new SearchSessions({
      assistantId,
      searchExpression,
    });

    expect(command.serializeRequest(config)).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'WISDOM',
          'x-amazon-call-source': 'agent-app',
          'x-amz-access-section': 'Wisdom',
          'x-amz-target': 'AgentAppService.WisdomV2.searchSessions',
          'x-amz-vendor': 'wisdom',
        }),
        body: JSON.stringify({
          assistantId,
          searchExpression,
        }),
      }),
    );
  });

  it('should validate inputs when calling serializeRequest', () => {
    command = new SearchSessions({} as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid assistantId.');

    command = new SearchSessions({
      assistantId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid assistantId.');

    command = new SearchSessions({
      assistantId,
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid searchExpression.');

    command = new SearchSessions({
      assistantId,
      searchExpression: { filters: [], },
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid searchExpression.');
  });

  it('should call buildClientMiddlware when calling serializeCommand', () => {
    command = new SearchSessions({} as any);

    expect(mockBuildClientRequestMiddlware).not.toHaveBeenCalled();

    command.serializeCommand({} as any);

    expect(mockBuildClientRequestMiddlware).toHaveBeenCalled();
  });
});
