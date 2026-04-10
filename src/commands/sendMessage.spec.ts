/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { SendMessage } from './sendMessage';
import { SDKHandler } from '../sdkHandler';
import * as clientMiddlware from '../utils/buildClientMiddleware';
import { getRuntimeConfig } from '../utils/runtimeConfig.browser';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { CallSources } from '../types/callSources';
import { AccessSections } from '../types/accessSections';

describe('SendMessage', () => {
  let command: SendMessage;

  const config = getRuntimeConfig({
    instanceUrl: 'https://example.com',
  });
  const assistantId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const sessionId = '75be2a14-94d7-41f2-835e-85368acb55df';
  const type = 'TEXT';
  const message = {
    value: {
      text: {
        value: 'Hello, how can I help you?'
      }
    }
  };

  const mockBuildClientRequestMiddlware = jest.spyOn(clientMiddlware, 'buildClientRequestMiddleware');

  it('should properly construct the command from the inputs provided', () => {
    command = new SendMessage({
      assistantId,
      sessionId,
      type,
      message
    });

    expect(command.vendorCode).toEqual(VendorCodes.Wisdom);
    expect(command.clientMethod).toEqual(ClientMethods.SendMessage);
    expect(command.clientInput).toEqual({
      assistantId,
      sessionId,
      type,
      message,
    });
  });

  it('should return the expected requestHandler with overrides when calling getRequestHandler', () => {
    command = new SendMessage({
      assistantId,
      sessionId,
      type,
      message
    });

    expect(command.getRequestHandler(config)).toBeInstanceOf(
      SDKHandler,
    );
  });

  it('should construct an HTTP request when calling serializeRequest, call source is PublicApiProxy, and an access section is not provided', () => {
    command = new SendMessage({
      assistantId,
      sessionId,
      type,
      message
    });

    expect(command.serializeRequest({ ...config, callSource: CallSources.PublicApiProxy })).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'WISDOM_SEND_MESSAGE',
          'x-amazon-call-source': 'public-api-proxy',
          'x-amz-access-section': 'WISDOM_SEND_MESSAGE',
          'x-amz-target': 'AgentAppService.WisdomV2.sendMessage',
          'x-amz-vendor': 'wisdom',
        }),
        body: JSON.stringify({
          assistantId,
          sessionId,
          type,
          message
        }),
      }),
    );
  });

  it('should construct an HTTP request when calling serializeRequest, call source is PublicApiProxy, and an access section is explicitly provided', () => {
    command = new SendMessage({
      assistantId,
      sessionId,
      type,
      message
    });

    expect(command.serializeRequest({ ...config, callSource: CallSources.PublicApiProxy, accessSection: 'SOME_ACCESS_SECTION' as AccessSections })).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'SOME_ACCESS_SECTION',
          'x-amazon-call-source': 'public-api-proxy',
          'x-amz-access-section': 'SOME_ACCESS_SECTION',
          'x-amz-target': 'AgentAppService.WisdomV2.sendMessage',
          'x-amz-vendor': 'wisdom',
        }),
        body: JSON.stringify({
          assistantId,
          sessionId,
          type,
          message
        }),
      }),
    );
  });

  it('should validate inputs when calling serializeRequest', () => {
    command = new SendMessage({} as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid assistantId.');

    command = new SendMessage({
      assistantId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid assistantId.');

    command = new SendMessage({
      assistantId,
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid sessionId.');

    command = new SendMessage({
      assistantId,
      sessionId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid sessionId.');

    command = new SendMessage({
      assistantId,
      sessionId,
    } as any);
  });

  it('should call buildClientMiddlware when calling serializeCommand', () => {
    command = new SendMessage({} as any);

    expect(mockBuildClientRequestMiddlware).not.toHaveBeenCalled();

    command.serializeCommand(config);

    expect(mockBuildClientRequestMiddlware).toHaveBeenCalled();
  });
});
