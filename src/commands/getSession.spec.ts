/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { GetSession } from './getSession';
import { SDKHandler } from '../sdkHandler';
import * as clientMiddlware from '../utils/buildClientMiddleware';
import { getRuntimeConfig } from '../utils/runtimeConfig.browser';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { CallSources } from '../types/callSources';
import { AccessSections } from '../types/accessSections';

describe('GetSession', () => {
  let command: GetSession;

  const config = getRuntimeConfig({
    instanceUrl: 'https://example.com',
  });
  const assistantId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const sessionId = '75be2a14-94d7-41f2-835e-85368acb55df';

  const mockBuildClientRequestMiddlware = jest.spyOn(clientMiddlware, 'buildClientRequestMiddleware');

  it('should properly construct the command from the inputs provided', () => {
    command = new GetSession({
      assistantId,
      sessionId,
    });

    expect(command.vendorCode).toEqual(VendorCodes.Wisdom);
    expect(command.clientMethod).toEqual(ClientMethods.GetSession);
    expect(command.clientInput).toEqual({
      assistantId,
      sessionId,
    });
  });

  it('should return the expected requestHandler with overrides when calling getRequestHandler', () => {
    command = new GetSession({
      assistantId,
      sessionId,
    });

    expect(command.getRequestHandler(config)).toBeInstanceOf(
      SDKHandler,
    );
  });

  it('should construct an HTTP request when calling serializeRequest, call source is PublicApiProxy, and an access section is not provided', () => {
    command = new GetSession({
      assistantId,
      sessionId,
    });

    expect(command.serializeRequest({ ...config, callSource: CallSources.PublicApiProxy })).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'WISDOM_GET_SESSION',
          'x-amazon-call-source': 'public-api-proxy',
          'x-amz-access-section': 'WISDOM_GET_SESSION',
          'x-amz-target': 'AgentAppService.WisdomV2.getSession',
          'x-amz-vendor': 'wisdom',
        }),
        body: JSON.stringify({
          assistantId,
          sessionId,
        }),
      }),
    );
  });

  it('should construct an HTTP request when calling serializeRequest, call source is PublicApiProxy, and an access section is explicitly provided', () => {
    command = new GetSession({
      assistantId,
      sessionId,
    });

    expect(command.serializeRequest({ ...config, callSource: CallSources.PublicApiProxy, accessSection: 'SOME_ACCESS_SECTION' as AccessSections })).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'SOME_ACCESS_SECTION',
          'x-amazon-call-source': 'public-api-proxy',
          'x-amz-access-section': 'SOME_ACCESS_SECTION',
          'x-amz-target': 'AgentAppService.WisdomV2.getSession',
          'x-amz-vendor': 'wisdom',
        }),
        body: JSON.stringify({
          assistantId,
          sessionId,
        }),
      }),
    );
  });

  it('should validate inputs when calling serializeRequest', () => {
    command = new GetSession({} as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid assistantId.');

    command = new GetSession({
      assistantId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid assistantId.');

    command = new GetSession({
      assistantId,
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid sessionId.');

    command = new GetSession({
      assistantId,
      sessionId: '',
    });

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid sessionId.');

    command = new GetSession({
      assistantId,
      sessionId,
    });
  });

  it('should call buildClientMiddlware when calling serializeCommand', () => {
    command = new GetSession({} as any);

    expect(mockBuildClientRequestMiddlware).not.toHaveBeenCalled();

    command.serializeCommand(config);

    expect(mockBuildClientRequestMiddlware).toHaveBeenCalled();
  });
});
