/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { NotifyRecommendationsReceived } from './notifyRecommendationsReceived';

describe('NotifyRecommendationsReceived', () => {
  let command: NotifyRecommendationsReceived;

  const assistantId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const sessionId = 'b5b0e4af-026e-4472-9371-d171a9fdf75a';
  const recommendationIds = [
    '85be2a14-94d7-41f2-835e-85368acb55df',
    'b5b0e4af-026e-4472-9371-d171a9fdf75a',
  ];

  it('should properly construct the command from the inputs provided', () => {
    command = new NotifyRecommendationsReceived({
      assistantId,
      sessionId,
      recommendationIds,
    });

    expect(command.clientMethod).toEqual('notifyRecommendationsReceived');
    expect(command.clientInput).toEqual({
      assistantId,
      sessionId,
      recommendationIds,
    });
  });

  it('should validate inputs when calling serialize', () => {
    command = new NotifyRecommendationsReceived({} as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid assistantId.');

    command = new NotifyRecommendationsReceived({
      assistantId: '',
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid assistantId.');

    command = new NotifyRecommendationsReceived({
      assistantId,
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid sessionId.');

    command = new NotifyRecommendationsReceived({
      assistantId,
      sessionId: '',
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid sessionId.');

    command = new NotifyRecommendationsReceived({
      assistantId,
      sessionId,
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid recommendationIds.');

    command = new NotifyRecommendationsReceived({
      assistantId,
      sessionId,
      recommendationIds: [],
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid recommendationIds.');
  });
});
