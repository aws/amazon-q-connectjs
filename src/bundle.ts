import {
  Client, QConnectClient,
  FetchHttpHandler,
  SDKHandler,
  DescribeContact,
  DescribeContactFlow,
  GetAuthorizedWidgetsForUser,
  GetContact,
  GetContent,
  GetRecommendations,
  ListContentAssociations,
  ListIntegrationAssociations,
  NotifyRecommendationsReceived,
  PutFeedback,
  QueryAssistant,
  SearchSessions,
} from './index';

(() => {
  const connect = (global as any).connect || {};
  const qconnectjs = connect.qconnectjs || {};
  connect.qconnectjs = qconnectjs;
  (global as any).connect = connect;

  qconnectjs.Client = Client;
  qconnectjs.QConnectClient = QConnectClient;
  qconnectjs.FetchHttpHandler = FetchHttpHandler;
  qconnectjs.SDKHandler = SDKHandler;
  qconnectjs.commands = {
    DescribeContact,
    DescribeContactFlow,
    GetAuthorizedWidgetsForUser,
    GetContact,
    GetContent,
    GetRecommendations,
    ListContentAssociations,
    ListIntegrationAssociations,
    NotifyRecommendationsReceived,
    PutFeedback,
    QueryAssistant,
    SearchSessions,
  }
})();
