/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { SearchSessions } from './searchSessions';

describe('SearchSessions', () => {
  let command: SearchSessions;

  const assistantId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const searchExpression = { filters: [], };

  it('should properly construct the command from the inputs provided', () => {
    command = new SearchSessions({
      assistantId,
      searchExpression,
    });

    expect(command.clientMethod).toEqual('searchSessions');
    expect(command.clientInput).toEqual({
      assistantId,
      searchExpression,
    });
  });

  it('should validate inputs when calling serialize', () => {
    command = new SearchSessions({} as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid assistantId.');

    command = new SearchSessions({
      assistantId: '',
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid assistantId.');

    command = new SearchSessions({
      assistantId,
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid searchExpression.');

    command = new SearchSessions({
      assistantId,
      searchExpression: { filters: [], },
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid searchExpression.');
  });
});
