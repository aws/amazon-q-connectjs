/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ListContentAssociations } from './listContentAssociations';
import { SDKHandler } from '../sdkHandler';
import * as clientMiddlware from '../utils/buildClientMiddleware';
import { getRuntimeConfig } from '../utils/runtimeConfig.browser';
import { VendorCodes } from '../types/vendorCodes';
import { ClientMethods } from '../types/clientMethods';
import { CallSources } from '../types/callSources';
import { AccessSections } from '../types/accessSections';

describe('ListContentAssociations', () => {
  let command: ListContentAssociations;

  const config = getRuntimeConfig({
    instanceUrl: 'https://example.com',
  });
  const contentId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const knowledgeBaseId = 'b5b0e4af-026e-4472-9371-d171a9fdf75a';

  const mockBuildClientRequestMiddlware = jest.spyOn(clientMiddlware, 'buildClientRequestMiddleware');

  it('should properly construct the command from the inputs provided', () => {
    command = new ListContentAssociations({
      knowledgeBaseId,
      contentId,
    });

    expect(command.vendorCode).toEqual(VendorCodes.Wisdom);
    expect(command.clientMethod).toEqual(ClientMethods.ListContentAssociations);
    expect(command.clientInput).toEqual({
      knowledgeBaseId,
      contentId,
    });
  });

  it('should return the expected requestHandler with overrides when calling getRequestHandler', () => {
    command = new ListContentAssociations({
      knowledgeBaseId,
      contentId,
    });

    expect(command.getRequestHandler(config)).toBeInstanceOf(
      SDKHandler,
    );
  });

  it('should construct an HTTP request when calling serializeRequest, call source is PublicApiProxy, and an access section is not provided', () => {
    command = new ListContentAssociations({
      knowledgeBaseId,
      contentId,
    });

    expect(command.serializeRequest({ ...config, callSource: CallSources.PublicApiProxy })).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'WISDOM_LIST_CONTENT_ASSOCIATIONS',
          'x-amazon-call-source': 'public-api-proxy',
          'x-amz-access-section': 'WISDOM_LIST_CONTENT_ASSOCIATIONS',
          'x-amz-target': 'AgentAppService.WisdomV2.listContentAssociations',
          'x-amz-vendor': 'wisdom',
        }),
        body: JSON.stringify({
          knowledgeBaseId,
          contentId,
        }),
      }),
    );
  });

  it('should construct an HTTP request when calling serializeRequest, call source is PublicApiProxy, and an access section is explicitly provided', () => {
    command = new ListContentAssociations({
      knowledgeBaseId,
      contentId,
    });

    expect(command.serializeRequest({ ...config, callSource: CallSources.PublicApiProxy, accessSection: 'SOME_ACCESS_SECTION' as AccessSections })).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'SOME_ACCESS_SECTION',
          'x-amazon-call-source': 'public-api-proxy',
          'x-amz-access-section': 'SOME_ACCESS_SECTION',
          'x-amz-target': 'AgentAppService.WisdomV2.listContentAssociations',
          'x-amz-vendor': 'wisdom',
        }),
        body: JSON.stringify({
          knowledgeBaseId,
          contentId,
        }),
      }),
    );
  });

  it('should validate inputs when calling serializeRequest', () => {
    command = new ListContentAssociations({} as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid contentId.');

    command = new ListContentAssociations({
      contentId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid contentId.');

    command = new ListContentAssociations({
      contentId,
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid knowledgeBaseId.');

    command = new ListContentAssociations({
      contentId,
      knowledgeBaseId: '',
    });

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid knowledgeBaseId.');
  });

  it('should call buildClientMiddlware when calling serializeCommand', () => {
    command = new ListContentAssociations({} as any);

    expect(mockBuildClientRequestMiddlware).not.toHaveBeenCalled();

    command.serializeCommand(config);

    expect(mockBuildClientRequestMiddlware).toHaveBeenCalled();
  });
});
