/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

export {
  IntegrationType,
  SourceType,
} from '@aws-sdk/client-connect';

export {
  ContentStatus,
  FilterField,
  FilterOperator,
  QueryConditionComparisonOperator,
  QueryConditionFieldName,
  QueryResultType,
  RecommendationSourceType,
  RecommendationType,
  RecommendationTriggerType,
  Relevance,
  RelevanceLevel,
  SourceContentType,
  TargetType,
} from '@aws-sdk/client-qconnect';

export type {
  ContentData,
  ContentDataDetails,
  ContentFeedbackData,
  ContentReference,
  DataDetails,
  DataReference,
  DataSummary,
  Document,
  DocumentText,
  Filter,
  GenerativeContentFeedbackData,
  GenerativeDataDetails,
  GenerativeReference,
  Highlight,
  NotifyRecommendationsReceivedError,
  QueryCondition,
  QueryConditionItem,
  QueryRecommendationTriggerData,
  RankingData,
  RecommendationData,
  RecommendationTrigger,
  RecommendationTriggerData,
  ResultData,
  SourceContentDataDetails,
  SearchExpression,
  SessionSummary,
  TextData,
  MessageOutput,
} from '@aws-sdk/client-qconnect';

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
