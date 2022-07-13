/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryAssistant } from './queryAssistant';

describe('QueryAssistant', () => {
  let command: QueryAssistant;

  const assistantId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const queryText = 'order';

  it('should properly construct the command from the inputs provided', () => {
    command = new QueryAssistant({
      assistantId,
      queryText
    });

    expect(command.clientMethod).toEqual('queryAssistant');
    expect(command.clientInput).toEqual({
      assistantId,
      queryText,
    });
  });

  it('should validate inputs when calling serialize', () => {
    command = new QueryAssistant({} as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid assistantId.');

    command = new QueryAssistant({
      assistantId: '',
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid assistantId.');

    command = new QueryAssistant({
      assistantId,
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid queryText.');

    command = new QueryAssistant({
      assistantId,
      queryText: '',
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid queryText.');
  });
});
