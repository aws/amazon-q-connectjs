/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ContentStatus {
  ACTIVE = "ACTIVE",
  CREATE_FAILED = "CREATE_FAILED",
  CREATE_IN_PROGRESS = "CREATE_IN_PROGRESS",
  DELETED = "DELETED",
  DELETE_FAILED = "DELETE_FAILED",
  DELETE_IN_PROGRESS = "DELETE_IN_PROGRESS",
  UPDATE_FAILED = "UPDATE_FAILED",
}

export enum FilterField {
  NAME = "NAME",
}

export enum FilterOperator {
  EQUALS = "EQUALS",
}

export enum RelevanceLevel {
  HIGH = "HIGH",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
}

export enum IntegrationTypes {
  EVENT = "EVENT",
  VOICE_ID = "VOICE_ID",
  PINPOINT_APP = "PINPOINT_APP",
  WISDOM_ASSISTANT = "WISDOM_ASSISTANT",
  WISDOM_KNOWLEDGE_BASE = "WISDOM_KNOWLEDGE_BASE",
}

export enum RecommendationTriggerType {
  QUERY = "QUERY",
  GENERATIVE = "GENERATIVE",
}

export enum RecommendationSourceType {
  ISSUE_DETECTION = "ISSUE_DETECTION",
  RULE_EVALUATION = "RULE_EVALUATION",
  OTHER = "OTHER",
}

export enum RecommendationType {
  KNOWLEDGE_CONTENT = "KNOWLEDGE_CONTENT",
  GENERATIVE_RESPONSE = "GENERATIVE_RESPONSE",
  GENERATIVE_ANSWER = "GENERATIVE_ANSWER",
}

export enum QueryConditionFieldName {
  RESULT_TYPE = "RESULT_TYPE",
}

export enum QueryConditionComparisonOperator {
  EQUALS = "EQUALS",
}

export enum SourceContentType {
  KNOWLEDGE_CONTENT = "KNOWLEDGE_CONTENT",
}

export enum QueryResultType {
  KNOWLEDGE_CONTENT = "KNOWLEDGE_CONTENT",
  GENERATIVE_RESPONSE = "GENERATIVE_RESPONSE",
  GENERATIVE_ANSWER = "GENERATIVE_ANSWER",
}

export enum TargetType {
  RECOMMENDATION = "RECOMMENDATION",
  RESULT = "RESULT",
}

export enum Relevance {
  HELPFUL = "HELPFUL",
  NOT_HELPFUL = "NOT_HELPFUL",
}

/*
 * Information about the content.
 */
export interface ContentData {
  /*
   * The Amazon Resource Name (ARN) of the content.
   */
  contentArn: string;
  /*
   * The identifier of the content.
   */
  contentId: string;
  /*
   * The Amazon Resource Name (ARN) of the knowledge base.
   */
  knowledgeBaseArn: string;
  /*
   * The the identifier of the knowledge base.
   */
  knowledgeBaseId: string;
  /*
   * The name of the content.
   */
  name: string;
  /*
   * The identifier of the content revision.
   */
  revisionId: string;
  /*
   * The title of the content.
   */
  title: string;
  /*
   * The media type of the content.
   */
  contentType: string;
  /*
   * The status of the content.
   */
  status: ContentStatus;
  /*
   * A key/value map to store attributes without affecting tagging or recommendations.
   * For example, when synchronizing data between an external system and Amazon Q Connect, you can store an external version identifier as metadata to utilize for determining drift.
   */
  metadata: { [key: string]: string };
  /*
   * The tags used to organize, track, or control access for this resource.
   */
  tags?: { [key: string]: string };
  /*
   * The URI of the content.
   */
  linkOutUri?: string;
  /*
   * The URL of the content.
   */
  url: string;
  /*
   * The expiration time of the URL as an epoch timestamp.
   */
  urlExpiry: Date;
}

/*
 * Reference information about the content.
 */
export interface ContentReference {
  /*
   * The Amazon Resource Name (ARN) of the knowledge base.
   */
  knowledgeBaseArn?: string;
  /*
   * The identifier of the knowledge base.
   */
  knowledgeBaseId?: string;
  /*
   * The Amazon Resource Name (ARN) of the content.
   */
  contentArn?: string;
  /*
   * The identifier of the content.
   */
  contentId?: string;
}

/*
 * The document.
 */
export interface Document {
  /*
   * A reference to the content resource.
   */
  contentReference: ContentReference;
  /*
   * The title of the document.
   */
  title?: DocumentText;
  /*
   * The excerpt from the document.
   */
  excerpt?: DocumentText;
}

/*
 * The text of the document.
 */
export interface DocumentText {
  /*
   * Text in the document.
   */
  text?: string;
  /*
   * Highlights in the document text.
   */
  highlights?: Highlight[];
}

/*
 * The data summary.
 */
export interface DataSummary {
  /*
   * Data reference.
   */
  reference: DataReference;
  /*
   * Data details.
   */
  details: DataDetails;
}

/*
 * Reference information about the generative content.
 */
export interface GenerativeReference {
  /*
   * The identifier of the LLM model.
   */
  modelId?: string;
  /*
   * The identifier of the generative content.
   */
  generationId?: string;
}

/*
 * Part of the union of DataReference.
 */
export interface GenerativeReferenceUnion {
  /*
   * The generative content reference.
   */
  generativeReference?: GenerativeReference;
}

/*
 * Part of the union of DataReference.
 */
export interface ContentReferenceUnion {
  /*
   * The content reference.
   */
  contentReference?: ContentReference;
}

/*
 * The data reference - An union of the content reference and the generative content reference.
 */
export type DataReference = ContentReferenceUnion | GenerativeReferenceUnion;

/*
 * Details about the source content ranking data.
 */
export interface RankingData {
  /*
   * The relevance score of the content.
   */
  relevanceScore?: number;
  /*
   * The relevance level of the recommendation.
   */
  relevanceLevel?: RelevanceLevel;
}

/*
 * Details about the source content text data.
 */
export interface TextData {
  /*
   * The title of the document.
   */
  title?: DocumentText;
  /*
   * The text of the document.
   */
  excerpt?: DocumentText;
}

/*
 * Details about generative data.
 */
export interface GenerativeDataDetails {
  /*
   * The LLM response.
   */
  completion: string;
  /*
   * The references used to generative the LLM response.
   */
  references: DataSummary[];
  /*
   * Details about the generative content ranking data.
   */
  rankingData: RankingData;
}

/*
 * Part of the union of DataDetails.
 */
export interface GenerativeDataDetailsUnion {
  /*
   * Details about generative data.
   */
  generativeData?: GenerativeDataDetails;
}

/*
 * Details about the source content data.
 */
export interface SourceContentDataDetails {
  /*
   * The identifier of the source content.
   */
  id: string;
  /*
   * The type of the source content.
   */
  type: SourceContentType;
  /*
   *  Details about the source content text data.
   */
  textData: TextData;
  /*
   * Details about the source content ranking data.
   */
  rankingData: RankingData;
}

/*
 * Part of the union of DataDetails.
 */
export interface SourceContentDataDetailsUnion {
  /*
   * Details about the source content data.
   */
  sourceContentData?: SourceContentDataDetails;
}

/*
 * Details about the content data.
 */
export interface ContentDataDetails {
  /*
   * Details about the content text data.
   */
  textData: TextData;
  /*
   * Details about the content ranking data.
   */
  rankingData: RankingData;
}

/*
 * Part of the union of DataDetails.
 */
export interface ContentDataDetailsUnion {
  /*
   * Details about the content data.
   */
  contentData?: ContentDataDetails;
}

/*
 * Details about the data.
 */
export type DataDetails = ContentDataDetailsUnion | GenerativeDataDetailsUnion | SourceContentDataDetailsUnion;

/*
 * A search filter.
 */
export interface Filter {
  /*
   * The field on which to filter.
   */
  field: FilterField;
  /*
   * The operator to use for comparing the field’s value with the provided value.
   */
  operator: FilterOperator;
  /*
   * The desired field value on which to filter.
   */
  value: string;
}

/*
 * Offset specification to describe highlighting of document excerpts for rendering search
 * results and recommendations.
 */
export interface Highlight {
  /*
   * The offset for the start of the highlight.
   */
  beginOffsetInclusive?: number;
  /*
   * The offset for the end of the highlight.
   */
  endOffsetExclusive?: number;
}

/*
 * An error occurred when creating a recommendation.
 */
export interface NotifyRecommendationsReceivedError {
  /*
   * The identifier of the recommendation that is in error.
   */
  recommendationId?: string;
  /*
   * A recommendation is causing an error.
   */
  message?: string;
}

/*
 * Information about the recommendation.
 */
export interface RecommendationData {
  /*
   * The identifier of the recommendation.
   */
  recommendationId: string;
  /*
   * The recommended document.
   */
  document?: Document;
  /*
   * The data summary of the recommendation.
   */
  data?: DataSummary;
  /*
   * The relevance score of the recommendation.
   */
  relevanceScore?: number;
  /*
   * The relevance level of the recommendation.
   */
  relevanceLevel?: RelevanceLevel;
  /*
   * The recommendation type.
   */
  type?: RecommendationType;
}

/*
 * Information about the query that triggered the recommendation.
 */
export interface QueryRecommendationTriggerData {
  /*
   * The text to search for.
   */
  text?: string;
}

/*
 * Information about what triggered the recommendation.
 */
export interface RecommendationTriggerData {
  /*
   * Information about the query that triggered the recommendation.
 */
  query?: QueryRecommendationTriggerData;
}

/*
 * Information about the recommendation trigger.
 */
export interface RecommendationTrigger {
  /*
   * The identifier of the trigger.
   */
  id: string;
  /*
   * The source type of the trigger.
   */
  type: RecommendationTriggerType;
  /*
   * The source type of the recommendation.
   */
  source: RecommendationSourceType;
  /*
   * Information about what triggered the recommendation.
   */
  data: RecommendationTriggerData;
  /*
   * A list of recommendation Ids associated with a given trigger.
   */
  recommendationIds: string[];
}

/*
 * Information about the result.
 */
export interface ResultData {
  /*
   * The identifier of the result data.
   */
  resultId: string;
  /*
   * The document.
   */
  document?: Document;
  /*
   * The data summary of the recommendation.
   */
  data?: DataSummary;
  /*
   * The type of query result.
   */
  type?: QueryResultType;
  /*
   * The relevance score of the results.
   */
  relevanceScore?: number;
}

/*
 * The search expression.
 */
export interface SearchExpression {
  /*
   * The search expression filters.
   */
  filters: Filter[];
}

/*
 * Summary information about the session.
 */
 export interface SessionSummary {
  /*
   * The identifier of the session.
   */
  sessionId: string;
  /*
   * The Amazon Resource Name (ARN) of the session.
   */
  sessionArn: string;
  /*
   * The identifier of the Amazon Q Connect assistant.
   */
  assistantId: string;
  /*
   * The Amazon Resource Name (ARN) of the Amazon Q Connect assistant
   */
  assistantArn: string;
}

/*
 * Retrieves content, including a pre-signed URL to download the content.
 */
export interface GetContentRequest {
  /*
   * The identifier of the content. Can be either the ID or the ARN. URLs cannot contain the ARN.
   */
  contentId: string;
  /*
   * The the identifier of the knowledge base. Can be either the ID or the ARN. URLs cannot contain the ARN.
   */
  knowledgeBaseId: string;
}

export interface GetContentResponse {
  /*
   * The content.
   */
  content?: ContentData;
}

/*
 * Retrieves recommendations for the specified session.
 * To avoid retrieving the same recommendations in subsequent calls, use NotifyRecommendationsReceived.
 * This API supports long-polling behavior with the `waitTimeSeconds` parameter.
 * Short poll is the default behavior and only returns recommendations already available.
 * To perform a manual query against an assistant, use QueryAssistant.
 */
export interface GetRecommendationsRequest {
  /*
   * The identifier of the Amazon Q Connect assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
   */
  assistantId: string;
  /*
   * The identifier of the session. Can be either the ID or the ARN. URLs cannot contain the ARN.
   */
  sessionId: string;
  /*
   * The maximum number of results to return per page.
   */
  maxResults?: number;
  /*
   * The duration (in seconds) for which the call waits for a recommendation to be made
   * available before returning. If a recommendation is available, the call returns sooner than
   * "WaitTimeSeconds". If no messages are available and the wait time expires, the
   * call returns successfully with an empty list.
   */
  waitTimeSeconds?: number;
}

export interface GetRecommendationsResponse {
  /*
   * The recommendations.
   */
  recommendations: RecommendationData[];
  /*
   * Recommendation triggers
   */
  triggers?: RecommendationTrigger[];
}

/*
 * Removes the specified recommendations from the specified assistant's queue of newly available recommendations.
 * You can use this API in conjunction with GetRecommendations and a `waitTimeSeconds` input for long-polling
 * behavior and avoiding duplicate recommendations.
 */
export interface NotifyRecommendationsReceivedRequest {
  /*
   * The identifier of the Amazon Q Connect assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
   */
  assistantId: string;
  /*
   * The identifier of the session. Can be either the ID or the ARN. URLs cannot contain the ARN.
   */
  sessionId: string;
  /*
   * The identifiers of the recommendations.
   */
  recommendationIds: string[];
}

export interface NotifyRecommendationsReceivedResponse {
  /*
   * The identifiers of the recommendations.</p>
   */
  recommendationIds?: string[];
  /*
   * The identifiers of recommendations that are causing errors.
   */
  errors?: NotifyRecommendationsReceivedError[];
}

/*
 * Performs a manual search against the specified assistant.
 * To retrieve recommendations for an assistant, use GetRecommendations.
 */
export interface QueryAssistantRequest {
  /*
   * The identifier of the Amazon Q Connect assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
   */
  assistantId: string;
  /*
   * The text to search for.
   */
  queryText: string;
  /*
   * The identifier of the session. Can be either the ID or the ARN. URLs cannot contain the ARN.
   */
  sessionId?: string;
  /*
   * List of query condition.
   */
  queryCondition?: QueryCondition[];
  /*
   * The token for the next set of results. Use the value returned in the previous
   * response in the next request to retrieve the next set of results.
   */
  nextToken?: string;
  /*
   * The maximum number of results to return per page.
   */
  maxResults?: number;
}

/*
 * The condition for the query.
 */
export interface QueryConditionItem {
  /*
   * The name of the field for query condition to query on.
   */
  field: QueryConditionFieldName;
  /*
   * The comparison operator for query condition to query on.
   */
  comparator: QueryConditionComparisonOperator;
  /*
   * The value for the query condition to query on.
   */
  value: string;
}

/*
 * Part of the union of QueryCondition.
 */
export interface QueryConditionItemUnion {
  /*
   * The condition for the query.
   */
  single?: QueryConditionItem;
}

/*
 * Information about how to query content.
 */
export type QueryCondition = QueryConditionItemUnion

export interface QueryAssistantResponse {
  /*
   * The results of the query.
   */
  results: ResultData[];
  /*
   * If there are additional results, this is the token for the next set of results.
   */
  nextToken?: string;
}

/*
 * Searches for sessions.
 */
export interface SearchSessionsRequest {
  /*
   * The token for the next set of results. Use the value returned in the previous
   * response in the next request to retrieve the next set of results.
   */
  nextToken?: string;
  /*
   * The maximum number of results to return per page.
   */
  maxResults?: number;
  /*
   * The identifier of the Amazon Q Connect assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
   */
  assistantId: string;
  /*
   * The search expression to filter results.
   */
  searchExpression: SearchExpression;
}

export interface SearchSessionsResponse {
  /*
   * Summary information about the sessions.
   */
  sessionSummaries: SessionSummary[];
  /*
   * If there are additional results, this is the token for the next set of results.
   */
  nextToken?: string;
}

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

export interface ListIntegrationAssociationsRequest {
  /*
   * The identifier of the Connect instance. Can be either the ID or the ARN. URLs cannot contain the ARN.
   */
  InstanceId: string;
  /*
   * The identigier of the integration type.
   */
  IntegrationType?: IntegrationTypes;
  /*
   * If there are additional results, this is the token for the next set of results.
   */
  StartingToken?: string;
  /*
   * The size of each page to get in the AWS service call.
  */
  PageSize?: number;
  /*
   * The total number of items to return in the command's output.
   * If the total number of items available is more than the value specified,
   * a NextToken is provided in the command's output.
   */
  MaxItems?: number;
}

export interface ListIntegrationAssociationsResponse {
  IntegrationAssociationSummaryList: {
    /*
    * The identifier of the Connect integration association.
    */
    IntegrationAssociationId: string,
    /*
    * The Amazon Resource Name (ARN) of the Connect integration association.
    */
    IntegrationAssociationArn: string,
    /*
    * The identifier of the Connect instance. Can be either the ID or the ARN. URLs cannot contain the ARN.
    */
    InstanceId: string,
    /*
    * The identifier of the Connect integration type. For Amazon Q Connect integration association integrationType should be one of WISDOM_ASSISTANT or WISDOM_KNOWLEDGE_BASE.
    */
    IntegrationType: string,
    /*
    * The Amazon Resource Name (ARN) of the Connect integration source. For Amazon Q Connect integration association integrationArn should be the ARN of either a Amazon Q Connect assistant or Amazon Q Connect knowledge base.
    */
    IntegrationArn: string,
    /*
    * The URL of the Connect integration association source application.
    */
    SourceApplicationUrl: string,
    /*
    * The application name of the Connect integration source. For Amazon Q Connect integration association sourceApplicationName should be 'Amazon Q Connect'.
    */
    SourceApplicationName: string,
    /*
    * The identifier of the Connect integration source. For Amazon Q Connect integration association sourceType should be 'Amazon Q Connect'.
    */
    SourceType: string,
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
  contactFeature: {
    wisdomFeatures: {
      wisdomConfig: {
        /*
         * The Amazon Resource Name (ARN) of the Amazon Q Connect session.
         */
        sessionArn: string;
      };
    };
  }
}

export interface PutFeedbackRequest {
  assistantId: string;
  targetId: string;
  targetType: TargetType;
  contentFeedback: ContentFeedbackData;
}

export interface PutFeedbackResponse {
  /*
   * The identifier of the Amazon Q Connect assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
   */
  assistantId: string;
  /*
   * The Amazon Resource Name (ARN) of the Amazon Q Connect assistant.
   */
  assistantArn: string;
  /*
   * The identifier of the feedback target.
   */
  targetId: string;
  /*
   * The type of the feedback target.
   */
  targetType: TargetType;
  /*
   * Information about the feedback provided.
   */
  contentFeedback: ContentFeedbackData;
}

export interface GenerativeContentFeedbackData {
  /*
   * The relevance of the feedback.
   */
  relevance: Relevance;
}

/*
 * Part of the union of ContentFeedbackData.
 */
export interface GenerativeContentFeedbackDataUnion {
  /*
   * The feedback information for a generative target type.
   */
  generativeContentFeedbackData: GenerativeContentFeedbackData;
}

type ContentFeedbackData = GenerativeContentFeedbackDataUnion;
