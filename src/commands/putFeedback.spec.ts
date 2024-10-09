/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */


import { PutFeedback } from './putFeedback';
import * as clientMiddlware from '../utils/buildClientMiddleware';
import { getRuntimeConfig } from '../utils/runtimeConfig.browser';
import { Relevance, TargetType } from '../types/models';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';

describe('PutFeedback', () => {
  let command: PutFeedback;

  const config = getRuntimeConfig({
    instanceUrl: 'https://example.com',
  });
  const assistantId = 'b5b0e4af-026e-4472-9371-d171a9fdf75a';
  const targetId =  '4EA10D8D-0769-4E94-8B08-DFED196F33CD';
  const targetType = TargetType.RECOMMENDATION;
  const contentFeedback = {
    generativeContentFeedbackData: {
      relevance: Relevance.HELPFUL,
    },
  };

  const mockBuildClientRequestMiddlware = jest.spyOn(clientMiddlware, 'buildClientRequestMiddleware');

  it('should properly construct the command from the inputs provided', () => {
    command = new PutFeedback({
      assistantId,
      targetId,
      targetType,
      contentFeedback,
    });

    expect(command.vendorCode).toEqual(VendorCodes.Wisdom);
    expect(command.clientMethod).toEqual(ClientMethods.PutFeedback);
    expect(command.clientInput).toEqual({
      assistantId,
      targetId,
      targetType,
      contentFeedback,
    });
  });

  it('should construct an HTTP request when calling serializeRequest', () => {
    command = new PutFeedback({
      assistantId,
      targetId,
      targetType,
      contentFeedback,
    });

    expect(command.serializeRequest(config)).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'WISDOM',
          'x-amazon-call-source': 'agent-app',
          'x-amz-access-section': 'Wisdom',
          'x-amz-target': 'AgentAppService.WisdomV2.putFeedback',
          'x-amz-vendor': 'wisdom',
        }),
        body: JSON.stringify({
          assistantId,
          targetId,
          targetType,
          contentFeedback,
        }),
      }),
    );
  });

  it('should validate inputs when calling serializeRequest', () => {
    command = new PutFeedback({} as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid assistantId.');

    command = new PutFeedback({
      assistantId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid assistantId.');

    command = new PutFeedback({
      assistantId,
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid targetId.');

    command = new PutFeedback({
      assistantId,
      targetId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid targetId.');

    command = new PutFeedback({
      assistantId,
      targetId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid targetId.');

    command = new PutFeedback({
      assistantId,
      targetId,
      targetType,
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid contentFeedback.');
  });

  it('should call buildClientMiddlware when calling serializeCommand', () => {
    command = new PutFeedback({} as any);

    expect(mockBuildClientRequestMiddlware).not.toHaveBeenCalled();

    command.serializeCommand({} as any);

    expect(mockBuildClientRequestMiddlware).toHaveBeenCalled();
  });
});
