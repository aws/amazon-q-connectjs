/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Represents the ClientMethods that can be called by the QConnectClient.
 */
export enum ClientMethods {
  DescribeContact = 'describeContact',
  DescribeContactFlow = 'describeContactFlow',
  GetAuthorizedWidgetsForUser = 'getAuthorizedWidgetsForUser',
  GetContent = 'getContent',
  GetRecommendations = 'getRecommendations',
  ListContentAssociations = 'listContentAssociations',
  ListIntegrationAssociations = 'listIntegrationAssociations',
  NotifyRecommendationsReceived = 'notifyRecommendationsReceived',
  QueryAssistant = 'queryAssistant',
  SearchSessions = 'searchSessions',
  GetContact = 'getContact',
  PutFeedback = 'putFeedback',
}

export enum QConnectMethods {
  GetContent = 'getContent',
  GetRecommendations = 'getRecommendations',
  ListContentAssociations = 'listContentAssociations',
  NotifyRecommendationsReceived = 'notifyRecommendationsReceived',
  QueryAssistant = 'queryAssistant',
  SearchSessions = 'searchSessions',
  PutFeedback = 'putFeedback',
}

export enum AgentAppMethods {
  GetAuthorizedWidgetsForUser = 'getAuthorizedWidgetsForUser',
}

export enum AcsMethods {
  DescribeContact = 'describeContact',
  DescribeContactFlow = 'describeContactFlow',
  ListIntegrationAssociations = 'listIntegrationAssociations',
}

export enum LcmsMethods {
  GetContact = 'getContact',
}
