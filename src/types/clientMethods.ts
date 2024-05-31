/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Represents the ClientMethods that can be called by the QConnectClient.
 */
export enum ClientMethods {
  GetAuthorizedWidgetsForUser = 'getAuthorizedWidgetsForUser',
  GetContent = 'getContent',
  GetRecommendations = 'getRecommendations',
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
  NotifyRecommendationsReceived = 'notifyRecommendationsReceived',
  QueryAssistant = 'queryAssistant',
  SearchSessions = 'searchSessions',
  PutFeedback = 'putFeedback',
}

export enum AgentAppMethods {
  GetAuthorizedWidgetsForUser = 'getAuthorizedWidgetsForUser',
}

export enum AcsMethods {
  ListIntegrationAssociations = 'listIntegrationAssociations',
}

export enum LcmsMethods {
  GetContact = 'getContact',
}
