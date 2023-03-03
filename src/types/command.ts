/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClientMethods } from './clientMethods';
import { HttpResponse } from '../types/http';
import {
  GetAuthorizedWidgetsForUser,
  GetContent,
  GetRecommendations,
  ListIntegrationAssociations,
  NotifyRecommendationsReceived,
  QueryAssistant,
  SearchSessions,
  GetContact,
} from '../commands';

/*
 * Function definition of command's 'resolveRequestHandler' function.
 */
export interface InvokeFunction<OutputTypes extends object> {
  (): Promise<OutputTypes>;
}

export interface Command<
  ClientInput extends object,
  InputType extends ClientInput,
  ClientOutput extends object,
  OutputType extends ClientOutput,
  ClientConfiguration,
> {
  readonly clientInput: InputType;
  readonly clientMethod: ClientMethods;
  resolveRequestHandler(
    configuration: ClientConfiguration,
    options: any
  ): InvokeFunction<HttpResponse<OutputType>>;
}

export const Commands = {
  getAuthorizedWidgetsForUser: GetAuthorizedWidgetsForUser,
  getContent: GetContent,
  getRecommendations: GetRecommendations,
  listIntegrationAssociations: ListIntegrationAssociations,
  notifyRecommendationsReceived: NotifyRecommendationsReceived,
  queryAssistant: QueryAssistant,
  searchSessions: SearchSessions,
  getContact: GetContact,
};
