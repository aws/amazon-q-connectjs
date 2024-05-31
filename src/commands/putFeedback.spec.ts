/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { PutFeedback } from './putFeedback';
import { Relevance, TargetType } from '../types/models';

describe('PutFeedback', () => {
  let command: PutFeedback;

  const assistantId = 'b5b0e4af-026e-4472-9371-d171a9fdf75a';
  const targetId =  '4EA10D8D-0769-4E94-8B08-DFED196F33CD';
  const targetType = TargetType.RECOMMENDATION;
  const contentFeedback = {
    generativeContentFeedbackData: {
      relevance: Relevance.HELPFUL,
    },
  };

  it('should properly construct the command from the inputs provided', () => {
    command = new PutFeedback({
      assistantId,
      targetId,
      targetType,
      contentFeedback,
    });

    expect(command.clientMethod).toEqual('putFeedback');
    expect(command.clientInput).toEqual({
      assistantId,
      targetId,
      targetType,
      contentFeedback,
    });
  });

  it('should validate inputs when calling serialize', () => {
    command = new PutFeedback({} as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid assistantId.');

    command = new PutFeedback({
      assistantId: '',
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid assistantId.');

    command = new PutFeedback({
      assistantId,
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid targetId.');

    command = new PutFeedback({
      assistantId,
      targetId: '',
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid targetId.');

    command = new PutFeedback({
      assistantId,
      targetId: '',
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid targetId.');

    command = new PutFeedback({
      assistantId,
      targetId,
      targetType,
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid contentFeedback.');
  });
});
