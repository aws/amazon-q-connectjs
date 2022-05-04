/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { MessageChannel } from 'worker_threads';

import { WisdomClient } from './wisdomClient';
import { GetAuthorizedWidgetsForUser } from './commands/getAuthorizedWidgetsForUser';
import { GetContent } from './commands/getContent';
import { GetRecommendations } from './commands/getRecommendations';
import { ListIntegrationAssociations } from './commands/listIntegrationAssociations';
import { NotifyRecommendationsReceived } from './commands/notifyRecommendationsReceived';
import { QueryAssistant } from './commands/queryAssistant';
import { SearchSessions } from './commands/searchSessions';

describe('WisdomClient', () => {
  const mockHandler = jest.fn((args: any) => Promise.resolve('success response'));
  const mockResolveRequestHandler = jest.fn((args: any) => mockHandler);

  (global as any).location = { href: 'https://foo.amazonaws.com' };
  (global as any).MessageChannel = MessageChannel;

  const client = new WisdomClient({
    instanceUrl: 'https://foo.amazonaws.com',
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a response promise when calling getAuthorizedWidgetsForUser', async () => {
    GetAuthorizedWidgetsForUser.prototype.resolveRequestHandler = mockResolveRequestHandler as any;

    await expect(
      client.getAuthorizedWidgetsForUser({}),
    ).resolves.toEqual('success response');
  });


  it('should return a response promise when calling getContent', async () => {
    GetContent.prototype.resolveRequestHandler = mockResolveRequestHandler as any;

    await expect(
      client.getContent({
        contentId: 'c6ca58b9-b046-4664-ba63-da17f51fc332',
        knowledgeBaseId: 'f9b5fa90-b3ce-45c9-9967-582c87074864',
      }),
    ).resolves.toEqual('success response');
  });

  it('should return a response promise when calling getRecommendations', async () => {
    GetRecommendations.prototype.resolveRequestHandler = mockResolveRequestHandler as any;

    await expect(
      client.getRecommendations({
        assistantId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
        sessionId: '249bbb30-aede-42a8-be85-d8483c317686',
      }),
    ).resolves.toEqual('success response');
  });

  it('should return a response promise when calling listIntegrationAssociations', async () => {
    ListIntegrationAssociations.prototype.resolveRequestHandler = mockResolveRequestHandler as any;

    await expect(
      client.listIntegrationAssociations({
        InstanceId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
      }),
    ).resolves.toEqual('success response');
  });

  it('should return a response promise when calling notifyRecommendationsReceived', async () => {
    NotifyRecommendationsReceived.prototype.resolveRequestHandler = mockResolveRequestHandler as any;

    await expect(
      client.notifyRecommendationsReceived({
        assistantId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
        sessionId: '249bbb30-aede-42a8-be85-d8483c317686',
        recommendationIds: [],
      }),
    ).resolves.toEqual('success response');
  });

  it('should return a response promise when calling queryAssistant', async () => {
    QueryAssistant.prototype.resolveRequestHandler = mockResolveRequestHandler as any;

    await expect(
      client.queryAssistant({
        assistantId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
        maxResults: 10,
        queryText: 'aws',
      }),
    ).resolves.toEqual('success response');
  });

  it('should return a response promise when calling searchSessions', async () => {
    SearchSessions.prototype.resolveRequestHandler = mockResolveRequestHandler as any;

    await expect(
      client.searchSessions({
        assistantId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
        searchExpression: {
          filters: [
            {
              operator: 'equals',
              field: 'name',
              value: '249bbb30-aede-42a8-be85-d8483c317686',
            },
          ],
        },
      }),
    ).resolves.toEqual('success response');
  });
});
