import {
  Client, QConnectClient,
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
  const qconnectjs = connect.qconnectjs || {};
  connect.qconnectjs = qconnectjs;
  (global as any).connect = connect;

  qconnectjs.Client = Client;
  qconnectjs.QConnectClient = QConnectClient;
  qconnectjs.commands = {
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
