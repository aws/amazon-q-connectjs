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
  GetContent = 'getContent',
  GetRecommendations = 'getRecommendations',
  ListContentAssociations = 'listContentAssociations',
  ListIntegrationAssociations = 'listIntegrationAssociations',
  NotifyRecommendationsReceived = 'notifyRecommendationsReceived',
  QueryAssistant = 'queryAssistant',
  GetContact = 'getContact',
  PutFeedback = 'putFeedback',
}

export enum QConnectMethods {
  GetContent = 'getContent',
  GetRecommendations = 'getRecommendations',
  ListContentAssociations = 'listContentAssociations',
  NotifyRecommendationsReceived = 'notifyRecommendationsReceived',
  QueryAssistant = 'queryAssistant',
  PutFeedback = 'putFeedback',
}

export enum AcsMethods {
  DescribeContact = 'describeContact',
  DescribeContactFlow = 'describeContactFlow',
  ListIntegrationAssociations = 'listIntegrationAssociations',
}

export enum LcmsMethods {
  GetContact = 'getContact',
}
