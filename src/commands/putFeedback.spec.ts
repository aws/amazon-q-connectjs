/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */


import { PutFeedback } from './putFeedback';
import { SDKHandler } from '../sdkHandler';
import * as clientMiddlware from '../utils/buildClientMiddleware';
import { getRuntimeConfig } from '../utils/runtimeConfig.browser';
import { Relevance, TargetType } from '../types/models';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { CallSources } from '../types/callSources';
import { AccessSections } from '../types/accessSections';

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

  it('should return the expected requestHandler with overrides when calling getRequestHandler', () => {
    command = new PutFeedback({
      assistantId,
      targetId,
      targetType,
      contentFeedback,
    });

    expect(command.getRequestHandler(config)).toBeInstanceOf(
      SDKHandler,
    );
  });

  it('should construct an HTTP request when calling serializeRequest, call source is PublicApiProxy, and an access section is not provided', () => {
    command = new PutFeedback({
      assistantId,
      targetId,
      targetType,
      contentFeedback,
    });

    expect(command.serializeRequest({ ...config, callSource: CallSources.PublicApiProxy })).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'WISDOM_PUT_FEEDBACK',
          'x-amazon-call-source': 'public-api-proxy',
          'x-amz-access-section': 'WISDOM_PUT_FEEDBACK',
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

  it('should construct an HTTP request when calling serializeRequest, call source is PublicApiProxy, and an access section is explicitly provided', () => {
    command = new PutFeedback({
      assistantId,
      targetId,
      targetType,
      contentFeedback,
    });

    expect(command.serializeRequest({ ...config, callSource: CallSources.PublicApiProxy, accessSection: 'SOME_ACCESS_SECTION' as AccessSections.WISDOM })).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'SOME_ACCESS_SECTION',
          'x-amazon-call-source': 'public-api-proxy',
          'x-amz-access-section': 'SOME_ACCESS_SECTION',
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

    command.serializeCommand(config);

    expect(mockBuildClientRequestMiddlware).toHaveBeenCalled();
  });
});
