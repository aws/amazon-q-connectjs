/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { MessageChannel } from 'worker_threads';

import { QConnectClient } from './qConnectClient';
import { GetAuthorizedWidgetsForUser } from './commands/getAuthorizedWidgetsForUser';
import { GetContent } from './commands/getContent';
import { GetRecommendations } from './commands/getRecommendations';
import { ListIntegrationAssociations } from './commands/listIntegrationAssociations';
import { NotifyRecommendationsReceived } from './commands/notifyRecommendationsReceived';
import { QueryAssistant } from './commands/queryAssistant';
import { SearchSessions } from './commands/searchSessions';
import { GetContact } from './commands/getContact';
import { PutFeedback } from './commands/putFeedback';
import {
  FilterOperator,
  FilterField,
  QueryConditionFieldName,
  QueryConditionComparisonOperator,
  QueryResultType,
  Relevance,
  TargetType,
} from './types/models';


describe('QConnectClient', () => {
  let client: QConnectClient;

  const awsAccountId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const assistantId = 'b5b0e4af-026e-4472-9371-d171a9fdf75a';
  const contactId = 'E6B381BD-83B5-47C7-AB48-6170607E13BB';
  const contentId =  'c6ca58b9-b046-4664-ba63-da17f51fc332';
  const instanceId = '6BF7FA0A-35A4-48F6-8260-D2939B4D6D1D';
  const knowledgeBaseId = 'f9b5fa90-b3ce-45c9-9967-582c87074864';
  const sessionId = '249bbb30-aede-42a8-be85-d8483c317686';
  const targetId =  '4EA10D8D-0769-4E94-8B08-DFED196F33CD';

  const instanceUrl = 'https://foo.amazonaws.com';
  const mockHandler = jest.fn((args: any) => Promise.resolve('success response'));
  const mockResolveRequestHandler = jest.fn((args: any) => mockHandler);

  (global as any).location = { href: 'https://foo.amazonaws.com' };
  (global as any).MessageChannel = MessageChannel;

  beforeEach(() => {
    jest.clearAllMocks();

    client = new QConnectClient({
      instanceUrl,
    });
  });

  it('should properly construct the endpoint from the instanceUrl when not provided', () => {
    client = new QConnectClient({
      instanceUrl,
      endpoint: 'https://localhost:4000/example-api/',
    });
    expect(client.config.endpoint).toEqual('https://localhost:4000/example-api/');

    const cfInstanceUrl = 'https://foo.com.awsapps.com/connect/'
    client = new QConnectClient({
      instanceUrl: cfInstanceUrl,
    });
    expect(client.config.endpoint).toEqual('https://foo.com.awsapps.com/connect/agent-app/api');

    const nginxInstanceUrl = 'https://foo.my.connect.aws';
    client = new QConnectClient({
      instanceUrl: nginxInstanceUrl,
    });
    expect(client.config.endpoint).toEqual('https://foo.my.connect.aws/agent-app/api');
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
        contentId: contentId,
        knowledgeBaseId: knowledgeBaseId,
      }),
    ).resolves.toEqual('success response');
  });

  it('should return a response promise when calling getRecommendations', async () => {
    GetRecommendations.prototype.resolveRequestHandler = mockResolveRequestHandler as any;

    await expect(
      client.getRecommendations({
        assistantId: assistantId,
        sessionId: sessionId,
      }),
    ).resolves.toEqual('success response');
  });

  it('should return a response promise when calling listIntegrationAssociations', async () => {
    ListIntegrationAssociations.prototype.resolveRequestHandler = mockResolveRequestHandler as any;

    await expect(
      client.listIntegrationAssociations({
        InstanceId: instanceId,
      }),
    ).resolves.toEqual('success response');
  });

  it('should return a response promise when calling notifyRecommendationsReceived', async () => {
    NotifyRecommendationsReceived.prototype.resolveRequestHandler = mockResolveRequestHandler as any;

    await expect(
      client.notifyRecommendationsReceived({
        assistantId: assistantId,
        sessionId: sessionId,
        recommendationIds: [],
      }),
    ).resolves.toEqual('success response');
  });

  it('should return a response promise when calling queryAssistant', async () => {
    QueryAssistant.prototype.resolveRequestHandler = mockResolveRequestHandler as any;

    await expect(
      client.queryAssistant({
        assistantId: assistantId,
        maxResults: 10,
        queryText: 'aws',
        sessionId: sessionId,
        queryCondition: [
          {
            single: {
              field: QueryConditionFieldName.RESULT_TYPE,
              comparator: QueryConditionComparisonOperator.EQUALS,
              value: QueryResultType.GENERATIVE_ANSWER,
            }
          }
        ] 
      }),
    ).resolves.toEqual('success response');
  });

  it('should return a response promise when calling searchSessions', async () => {
    SearchSessions.prototype.resolveRequestHandler = mockResolveRequestHandler as any;

    await expect(
      client.searchSessions({
        assistantId: assistantId,
        searchExpression: {
          filters: [
            {
              operator: FilterOperator.EQUALS,
              field: FilterField.NAME,
              value: sessionId,
            },
          ],
        },
      }),
    ).resolves.toEqual('success response');
  });

  it('should return a response promise when calling getContact', async () => {
    GetContact.prototype.resolveRequestHandler = mockResolveRequestHandler as any;

    await expect(
      client.getContact({
        awsAccountId: awsAccountId,
        instanceId: instanceId,
        contactId: contactId,
      }),
    ).resolves.toEqual('success response');
  });

  it('should return a response promise when calling putFeedback', async () => {
    PutFeedback.prototype.resolveRequestHandler = mockResolveRequestHandler as any;

    await expect(
      client.putFeedback({
        assistantId: assistantId,
        targetId: targetId,
        targetType: TargetType.RECOMMENDATION,
        contentFeedback: {
          generativeContentFeedbackData: {
            relevance: Relevance.HELPFUL,
          },
        },
      }),
    ).resolves.toEqual('success response');
  });
});
