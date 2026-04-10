/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { NotifyRecommendationsReceived } from './notifyRecommendationsReceived';
import { SDKHandler } from '../sdkHandler';
import * as clientMiddlware from '../utils/buildClientMiddleware';
import { getRuntimeConfig } from '../utils/runtimeConfig.browser';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { CallSources } from '../types/callSources';
import { AccessSections } from '../types/accessSections';

describe('NotifyRecommendationsReceived', () => {
  let command: NotifyRecommendationsReceived;

  const config = getRuntimeConfig({
    instanceUrl: 'https://example.com',
  });
  const assistantId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const sessionId = 'b5b0e4af-026e-4472-9371-d171a9fdf75a';
  const recommendationIds = [
    '85be2a14-94d7-41f2-835e-85368acb55df',
    'b5b0e4af-026e-4472-9371-d171a9fdf75a',
  ];

  const mockBuildClientRequestMiddlware = jest.spyOn(clientMiddlware, 'buildClientRequestMiddleware');

  it('should properly construct the command from the inputs provided', () => {
    command = new NotifyRecommendationsReceived({
      assistantId,
      sessionId,
      recommendationIds,
    });

    expect(command.vendorCode).toEqual(VendorCodes.Wisdom);
    expect(command.clientMethod).toEqual(ClientMethods.NotifyRecommendationsReceived);
    expect(command.clientInput).toEqual({
      assistantId,
      sessionId,
      recommendationIds,
    });
  });

  it('should return the expected requestHandler with overrides when calling getRequestHandler', () => {
    command = new NotifyRecommendationsReceived({
      assistantId,
      sessionId,
      recommendationIds,
    });

    expect(command.getRequestHandler(config)).toBeInstanceOf(
      SDKHandler,
    );
  });

  it('should construct an HTTP request when calling serializeRequest, call source is PublicApiProxy, and an access section is not provided', () => {
    command = new NotifyRecommendationsReceived({
      assistantId,
      sessionId,
      recommendationIds,
    });

    expect(command.serializeRequest({ ...config, callSource: CallSources.PublicApiProxy })).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'WISDOM_NOTIFIY_RECOMMENDATIONS_RECEIVED',
          'x-amazon-call-source': 'public-api-proxy',
          'x-amz-access-section': 'WISDOM_NOTIFIY_RECOMMENDATIONS_RECEIVED',
          'x-amz-target': 'AgentAppService.WisdomV2.notifyRecommendationsReceived',
          'x-amz-vendor': 'wisdom',
        }),
        body: JSON.stringify({
          assistantId,
          sessionId,
          recommendationIds,
        }),
      }),
    );
  });

  it('should construct an HTTP request when calling serializeRequest, call source is PublicApiProxy, and an access section is explicitly provided', () => {
    command = new NotifyRecommendationsReceived({
      assistantId,
      sessionId,
      recommendationIds,
    });

    expect(command.serializeRequest({ ...config, callSource: CallSources.PublicApiProxy, accessSection: 'SOME_ACCESS_SECTION' as AccessSections.WISDOM })).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'SOME_ACCESS_SECTION',
          'x-amazon-call-source': 'public-api-proxy',
          'x-amz-access-section': 'SOME_ACCESS_SECTION',
          'x-amz-target': 'AgentAppService.WisdomV2.notifyRecommendationsReceived',
          'x-amz-vendor': 'wisdom',
        }),
        body: JSON.stringify({
          assistantId,
          sessionId,
          recommendationIds,
        }),
      }),
    );
  });

  it('should validate inputs when calling serializeRequest', () => {
    command = new NotifyRecommendationsReceived({} as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid assistantId.');

    command = new NotifyRecommendationsReceived({
      assistantId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid assistantId.');

    command = new NotifyRecommendationsReceived({
      assistantId,
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid sessionId.');

    command = new NotifyRecommendationsReceived({
      assistantId,
      sessionId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid sessionId.');

    command = new NotifyRecommendationsReceived({
      assistantId,
      sessionId,
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid recommendationIds.');

    command = new NotifyRecommendationsReceived({
      assistantId,
      sessionId,
      recommendationIds: [],
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid recommendationIds.');
  });


  it('should call buildClientMiddlware when calling serializeCommand', () => {
    command = new NotifyRecommendationsReceived({} as any);

    expect(mockBuildClientRequestMiddlware).not.toHaveBeenCalled();

    command.serializeCommand(config);

    expect(mockBuildClientRequestMiddlware).toHaveBeenCalled();
  });
});
