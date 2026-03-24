import {
  Client, QConnectClient,
  FetchHttpHandler,
  SDKHandler,
  DescribeContact,
  DescribeContactFlow,
  GetContact,
  GetContent,
  GetRecommendations,
  ListContentAssociations,
  ListIntegrationAssociations,
  NotifyRecommendationsReceived,
  PutFeedback,
  QueryAssistant,
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
    GetContact,
    GetContent,
    GetRecommendations,
    ListContentAssociations,
    ListIntegrationAssociations,
    NotifyRecommendationsReceived,
    PutFeedback,
    QueryAssistant,
  }
})();
