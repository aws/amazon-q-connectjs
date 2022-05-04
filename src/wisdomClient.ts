/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client, ClientConfiguration } from './client';
import { getRuntimeConfig } from './utils/runtimeConfig.browser';
import {
  GetAuthorizedWidgetsForUser, GetAuthorizedWidgetsForUserInput, GetAuthorizedWidgetsForUserOutput,
  GetContent, GetContentInput, GetContentOutput,
  GetRecommendations, GetRecommendationsInput, GetRecommendationsOutput,
  ListIntegrationAssociations, ListIntegrationAssociationsInput, ListIntegrationAssociationsOutput,
  NotifyRecommendationsReceived, NotifyRecommendationsReceivedInput, NotifyRecommendationsReceivedOutput,
  QueryAssistant, QueryAssistantInput, QueryAssistantOutput,
  SearchSessions, SearchSessionsInput, SearchSessionsOutput,
} from './commands';
import { RequestHandler } from './types/requestHandler';
import { HttpResponse, HttpHandlerOptions } from './types/http';

export type ServiceInputTypes =
  | GetAuthorizedWidgetsForUserInput
  | GetContentInput
  | GetRecommendationsInput
  | ListIntegrationAssociationsInput
  | NotifyRecommendationsReceivedInput
  | QueryAssistantInput
  | SearchSessionsInput;

export type ServiceOutputTypes =
  | GetAuthorizedWidgetsForUserOutput
  | GetContentOutput
  | GetRecommendationsOutput
  | ListIntegrationAssociationsOutput
  | NotifyRecommendationsReceivedOutput
  | QueryAssistantOutput
  | SearchSessionsOutput;

/*
 * The configuration interface of WisdomClient class constructor that sets the instance url and other options.
 */
export interface WisdomClientConfig extends Partial<ClientConfiguration<HttpHandlerOptions>> {
  /*
   * The HTTP handler to use. Fetch in browser and Https in Nodejs.
   */
  requestHandler?: RequestHandler<any, any, HttpHandlerOptions>;
}

/*
 * The resolved configuration interface of WisdomClient class.
 */
export type WisdomClientResolvedConfig = Required<Omit<ClientConfiguration<HttpHandlerOptions>, 'frameWindow'>> & WisdomClientConfig;

/*
 * All Amazon Connect Wisdom agent application functionality is accessible using the API.
 * For example, you can search sessions, and get automatic recommendations.
 *
 * Some more advanced features are only accessible using the AWS SDK Wisdom API.
 * For example, you can manually manage content by uploading custom files and control their lifecycle.
 */
export class WisdomClient extends Client<
  HttpHandlerOptions,
  ServiceInputTypes,
  ServiceOutputTypes,
  WisdomClientResolvedConfig
> {
  readonly config: WisdomClientResolvedConfig;

  constructor(config: WisdomClientConfig = {}) {
    const _config = getRuntimeConfig(config);
    super(_config);
    this.config = _config;
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
