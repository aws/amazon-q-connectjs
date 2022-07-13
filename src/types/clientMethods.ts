/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Represents the ClientMethods that can be called by the WisdomClient.
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
}
