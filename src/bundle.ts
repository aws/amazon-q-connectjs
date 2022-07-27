import {
  Client, WisdomClient,
  GetAuthorizedWidgetsForUser,
  ListIntegrationAssociations,
  SearchSessions,
  QueryAssistant,
  GetContent,
  GetRecommendations,
  NotifyRecommendationsReceived,
  GetContact,
} from './index';

(() => {
  const connect = (global as any).connect || {};
  const wisdomjs = connect.WisdomJS || {};
  connect.wisdomjs = wisdomjs;
  (global as any).connect = connect;

  wisdomjs.Client = Client;
  wisdomjs.WisdomClient = WisdomClient;
  wisdomjs.commands = {
    GetAuthorizedWidgetsForUser,
    ListIntegrationAssociations,
    SearchSessions,
    QueryAssistant,
    GetContent,
    GetRecommendations,
    NotifyRecommendationsReceived,
    GetContact,
  }
})();
