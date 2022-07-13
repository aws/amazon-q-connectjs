/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { GetRecommendations } from './getRecommendations';

describe('GetRecommendations', () => {
  let command: GetRecommendations;

  const assistantId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const sessionId = 'b5b0e4af-026e-4472-9371-d171a9fdf75a';

  it('should properly construct the command from the inputs provided', () => {
    command = new GetRecommendations({
      assistantId,
      sessionId,
    });

    expect(command.clientMethod).toEqual('getRecommendations');
    expect(command.clientInput).toEqual({
      assistantId,
      sessionId,
    });
  });

  it('should validate inputs when calling serialize', () => {
    command = new GetRecommendations({} as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid assistantId.');

    command = new GetRecommendations({
      assistantId: '',
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid assistantId.');

    command = new GetRecommendations({
      assistantId,
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid sessionId.');

    command = new GetRecommendations({
      assistantId,
      sessionId: '',
    });

    expect(() => command.serialize({} as any)).toThrow('Invalid sessionId.');
  });
});
