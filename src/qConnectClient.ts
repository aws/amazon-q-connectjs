/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client, ClientConfiguration, ClientResolvedConfig } from './client';
import {
  DescribeContact, DescribeContactInput, DescribeContactOutput,
  DescribeContactFlow, DescribeContactFlowInput, DescribeContactFlowOutput,
  GetAuthorizedWidgetsForUser, GetAuthorizedWidgetsForUserInput, GetAuthorizedWidgetsForUserOutput,
  GetContent, GetContentInput, GetContentOutput,
  GetRecommendations, GetRecommendationsInput, GetRecommendationsOutput,
  ListContentAssociations, ListContentAssociationsInput, ListContentAssociationsOutput,
  ListIntegrationAssociations, ListIntegrationAssociationsInput, ListIntegrationAssociationsOutput,
  NotifyRecommendationsReceived, NotifyRecommendationsReceivedInput, NotifyRecommendationsReceivedOutput,
  QueryAssistant, QueryAssistantInput, QueryAssistantOutput,
  SearchSessions, SearchSessionsInput, SearchSessionsOutput,
  GetContact, GetContactInput, GetContactOutput,
  PutFeedback, PutFeedbackInput, PutFeedbackOutput,
} from './commands';
import { RequestHandler } from './types/requestHandler';
import { HttpResponse, HttpHandlerOptions } from './types/http';

export type ServiceInputTypes =
  | DescribeContactInput
  | DescribeContactFlowInput
  | GetAuthorizedWidgetsForUserInput
  | GetContentInput
  | GetRecommendationsInput
  | ListContentAssociationsInput
  | ListIntegrationAssociationsInput
  | NotifyRecommendationsReceivedInput
  | QueryAssistantInput
  | SearchSessionsInput
  | GetContactInput
  | PutFeedbackInput;

export type ServiceOutputTypes =
  | DescribeContactOutput
  | DescribeContactFlowOutput
  | GetAuthorizedWidgetsForUserOutput
  | GetContentOutput
  | GetRecommendationsOutput
  | ListContentAssociationsOutput
  | ListIntegrationAssociationsOutput
  | NotifyRecommendationsReceivedOutput
  | QueryAssistantOutput
  | SearchSessionsOutput
  | GetContactOutput
  | PutFeedbackOutput;

/*
 * The configuration interface of the QConnectClient class constructor that sets the instance url and other options.
 */
export interface QConnectClientConfig extends ClientConfiguration {
  /*
   * The HTTP handler to use. Fetch in browser and Https in Nodejs.
   */
  requestHandler?: RequestHandler<any, any, HttpHandlerOptions>;
}

/*
 * The resolved configuration interface of the QConnectClient class.
 */
export type QConnectClientResolvedConfig = ClientResolvedConfig;

/*
 * All Amazon Q Connect agent application functionality is accessible using the API.
 * For example, you can search sessions, and get automatic recommendations.
 *
 * Some more advanced features are only accessible using the AWS SDK Amazon Q Connect API.
 * For example, you can manually manage content by uploading custom files and control their lifecycle.
 */
export class QConnectClient extends Client<
  HttpHandlerOptions,
  ServiceInputTypes,
  ServiceOutputTypes,
  QConnectClientResolvedConfig
> {
  constructor(config: QConnectClientConfig) {
    super(config);
  }

  /*
   * Describes the specified contact.
   */
  public describeContact(
    args: DescribeContactInput,
    options?: HttpHandlerOptions,
  ): Promise<HttpResponse<DescribeContactOutput>> {
    const command = new DescribeContact(args);
    return this.call(command, options);
  }

  /*
   * Describes the specified contact flow.
   */
  public describeContactFlow(
    args: DescribeContactFlowInput,
    options?: HttpHandlerOptions,
  ): Promise<HttpResponse<DescribeContactFlowOutput>> {
    const command = new DescribeContactFlow(args);
    return this.call(command, options);
  }

  /*
   * Retrieves authorized widgets settings for Connect instance ID.
   */
  public getAuthorizedWidgetsForUser(
    args: GetAuthorizedWidgetsForUserInput,
    options?: HttpHandlerOptions,
  ): Promise<HttpResponse<GetAuthorizedWidgetsForUserOutput>> {
    const command = new GetAuthorizedWidgetsForUser(args);
    return this.call(command, options);
  }

  /*
   * Gets details about the specified contact.
   */
  public getContact(
    args: GetContactInput,
    options?: HttpHandlerOptions,
  ): Promise<HttpResponse<GetContactOutput>> {
    const command = new GetContact(args);
    return this.call(command, options);
  }

  /*
   * Retrieves content, including a pre-signed URL to download the content.
   */
  public getContent(
    args: GetContentInput,
    options?: HttpHandlerOptions,
  ): Promise<HttpResponse<GetContentOutput>> {
    const command = new GetContent(args);
    return this.call(command, options);
  }

  /*
   * Retrieves recommendations for the specified session.
   * To avoid retrieving the same recommendations in subsequent calls, use NotifyRecommendationsReceived.
   * This API supports long-polling behavior with the `waitTimeSeconds` parameter.
   * Short poll is the default behavior and only returns recommendations already available.
   * To perform a manual query against an assistant, use QueryAssistant.
   */
  public getRecommendations(
    args: GetRecommendationsInput,
    options?: HttpHandlerOptions,
  ): Promise<HttpResponse<GetRecommendationsOutput>> {
    const command = new GetRecommendations(args);
    return this.call(command, options);
  }

  /*
   * Lists the content associations.
   * For more information about content associations--what they are and when they are used--see
   * Integrate Amazon Q in Connect with step-by-step guides in the Amazon Connect Administrator Guide.
   * https://docs.aws.amazon.com/connect/latest/adminguide/integrate-q-with-guides.html
   */
  public listContentAssociations(
    args: ListContentAssociationsInput,
    options?: HttpHandlerOptions,
  ): Promise<HttpResponse<ListContentAssociationsOutput>> {
    const command = new ListContentAssociations(args);
    return this.call(command, options);
  }

  /*
   * Retrieves Connect integrations, including assistant and knowledge base integrations.
   */
  public listIntegrationAssociations(
    args: ListIntegrationAssociationsInput,
    options?: HttpHandlerOptions,
  ): Promise<HttpResponse<ListIntegrationAssociationsOutput>> {
    const command = new ListIntegrationAssociations(args);
    return this.call(command, options);
  }

  /*
   * Removes the specified recommendations from the specified assistant's queue of newly available recommendations.
   * You can use this API in conjunction with GetRecommendations and a `waitTimeSeconds` input for long-polling
   * behavior and avoiding duplicate recommendations.
   */
  public notifyRecommendationsReceived(
    args: NotifyRecommendationsReceivedInput,
    options?: HttpHandlerOptions,
  ): Promise<HttpResponse<NotifyRecommendationsReceivedOutput>> {
    const command = new NotifyRecommendationsReceived(args);
    return this.call(command, options);
  }

  /*
   * Add feedback for an anomalous metric.
   */
  public putFeedback(
    args: PutFeedbackInput,
    options?: HttpHandlerOptions,
  ): Promise<HttpResponse<PutFeedbackOutput>> {
    const command = new PutFeedback(args);
    return this.call(command, options);
  }

  /*
   * Performs a manual search against the specified assistant.
   * To retrieve recommendations for an assistant, use GetRecommendations.
   */
  public queryAssistant(
    args: QueryAssistantInput,
    options?: HttpHandlerOptions,
  ): Promise<HttpResponse<QueryAssistantOutput>> {
    const command = new QueryAssistant(args);
    return this.call(command, options);
  }

  /*
   * Searches for sessions.
   */
  public searchSessions(
    args: SearchSessionsInput,
    options?: HttpHandlerOptions,
  ): Promise<HttpResponse<SearchSessionsOutput>> {
    const command = new SearchSessions(args);
    return this.call(command, options);
  }
}
