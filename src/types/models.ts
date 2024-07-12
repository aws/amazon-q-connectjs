/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

export {
  IntegrationType,
  SourceType,
} from '@aws-sdk/client-connect';

export {
  ContentData,
  ContentDataDetails,
  ContentFeedbackData,
  ContentReference,
  ContentStatus,
  DataDetails,
  DataReference,
  DataSummary,
  Document,
  DocumentText,
  Filter,
  FilterField,
  FilterOperator,
  GenerativeContentFeedbackData,
  GenerativeDataDetails,
  GenerativeReference,
  Highlight,
  NotifyRecommendationsReceivedError,
  QueryCondition,
  QueryConditionComparisonOperator,
  QueryConditionItem,
  QueryConditionFieldName,
  QueryRecommendationTriggerData,
  QueryResultType,
  RankingData,
  RecommendationData,
  RecommendationSourceType,
  RecommendationTrigger,
  RecommendationTriggerData,
  RecommendationTriggerType,
  RecommendationType,
  Relevance,
  RelevanceLevel,
  ResultData,
  SourceContentDataDetails,
  SourceContentType,
  SearchExpression,
  SessionSummary,
  TargetType,
  TextData,
} from '@aws-sdk/client-qconnect';

export interface GetAuthorizedWidgetsForUserRequest {}

export interface GetAuthorizedWidgetsForUserResponse {
  widgets?: {
    [widget: string]: string[],
  }
  widgetsDataPermission?: {
    name: string,
    endpoint: string,
    allowedTopicSubscriptions: string[],
    allowedTopicPublications: string[],
    enableLifeCycleEvents: boolean,
    version: string,
  }[],
}

export interface GetContactRequest {
  /*
   * The identifier of the AWS account. Can be either the ID or the ARN. URLs cannot contain the ARN.
   */
  awsAccountId: string;
  /*
   * The identifier of the Connect instance. Can be either the ID or the ARN. URLs cannot contain the ARN.
   */
  instanceId: string;
  /*
   * The identifier of the Connect contact. Can be either the ID or the ARN. URLs cannot contain the ARN.
   */
  contactId: string;
}

export interface GetContactResponse {
  contactData: {
    contactFeature: {
      wisdomFeatures: {
        wisdomConfig: {
          /*
           * The Amazon Resource Name (ARN) of the Amazon Q Connect session.
           */
          sessionArn: string;
        };
      };
    };
  };
}
