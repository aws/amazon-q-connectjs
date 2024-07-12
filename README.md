# amazon-q-connectjs

[Amazon Q in Connect](https://aws.amazon.com/connect/q/) is a generative AI customer service assistant. It is an LLM-enhanced evolution of Amazon Connect Wisdom that delivers real-time recommendations to help contact center agents resolve customer issues quickly and accurately. The Amazon Q in Connect JavaScript library (QConnectJS) gives you the power to build your own Amazon Q in Connect widget.

Amazon Q in Connect automatically detects customer intent during calls and chats using conversational analytics and natural language understanding (NLU). It then provides agents with immediate, real-time generative responses and suggested actions. It also provides links to relevant documents and articles.

The library uses an Amazon Connect authentication token to make API calls to Amazon Q in Connect and supports all Amazon Q in Connect `Agent Assistant` functionality. For example, in addition to receiving automatic recommendations, you can also query Amazon Q directly using natural language or keywords to answer customer requests.

QConnectJS supports the following APIs:
* [DescribeContactFlow](#describecontactflow)
* [GetContact](#getcontact)
* [GetContent](#getcontent)
* [GetRecommendations](#getrecommendations)
* [ListContentAssociations](#listcontentassociations)
* [ListIntegrationAssociations](#listintegrationassociations)
* [NotifyRecommendationsReceived](#notifyrecommendationsreceived)
* [PutFeedback](#putfeedback)
* [QueryAssistant](#queryassistant)
* [SearchSessions](#searchsessions)

Note that this library must be used in conjunction with [amazon-connect-streams](https://github.com/amazon-connect/amazon-connect-streams).

## Learn More

For more advanced features, all Amazon Q in Connect functionality is accessible using the public API. For example, creating an assistant and a knowledge base. Check out [Amazon Q in Connect](https://docs.aws.amazon.com/cli/latest/reference/qconnect/) available via the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html).

To learn more about Amazon Q in Connect and its capabilities, please check out the [Amazon Q in Connect Admin Guide](https://docs.aws.amazon.com/connect/latest/adminguide/amazon-q-connect.html).

To learn more about Amazon Connect and its capabilities, please check out the [Amazon Connect Admin Guide](https://docs.aws.amazon.com/connect/latest/adminguide/what-is-amazon-connect.html).

# Getting Started

## Prerequisites

### Create an Amazon Connect Instance

The first step in setting up your Amazon Connect contact center is to create a virtual contact center instance. Each instance contains all the resources and settings related to your contact center. Follow the [Get started with Amazon Connect](https://docs.aws.amazon.com/connect/latest/adminguide/amazon-connect-get-started.html) admin guide to get started.

### Enable Amazon Q in Connect For Your Instance

To utilize QConnectJS you should start by enabling Amazon Q in Connect for your Amazon Connect instance. Follow the [Enable Amazon Q in Connect](https://docs.aws.amazon.com/connect/latest/adminguide/enable-q.html) admin guide to get started.

### Set Up Integrated Applications

All domains looking to integrate with Amazon Connect and Amazon Q in Connect must be explicitly allowed for cross-domain access to the instance. For example, to integrate with your custom agent application, you must place your agent application domain in an allow list. To allow list a domain URL follow the [app integration](https://docs.aws.amazon.com/connect/latest/adminguide/app-integration.html) admin guide.

### A few things to note:
* Allowlisted domains must be HTTPS.
* All of the pages that attempt to initialize the QConnectJS library must be hosted on domains that are allowlisted.

# Usage

## Install from NPM

```bash
npm install amazon-q-connectjs
```

## Build with NPM

```bash
$ git clone https://github.com/aws/amazon-q-connectjs
cd amazon-q-connectjs
npm install
npm run bundle
```

Find build artifacts in the `release` directory. This will generate a file called `amazon-q-connectjs.js` and a minified version `amazon-q-connectjs-min.js`. This is the full QConnectJS client which you will want to include in your page.

## Download from Github

`amazon-q-connectjs` is available on [NPM](https://www.npmjs.com/package/amazon-q-connectjs) but if you'd like to download it here, you can find build artificacts in the [release](/release) directory.

# Initialization

Initializing the QConnectJS client is the fist step to verify that you have everything setup correctly.

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <script type="text/javascript" src="connect-streams-min.js"></script>
    <script type="text/javascript" src="amazon-q-connectjs-min.js"></script>
  </head>
  <!-- Add the call to init() as an onload so it will only run once the page is loaded -->
  <body onload="init()">
    <div id='ccp-container' style="width: 400px; height: 800px;"></div>
    <script type="text/javascript">
      const instanceUrl = 'https://my-instance-domain.my.connect.aws';

      function init() {
        // Initialize StreamsJS API
        connect.agentApp.initApp(
          'ccp',
          'ccp-container',
          `${instanceUrl}/ccp-v2/`,
          {
            ccpParams: {
              style: 'width:400px; height:600px;',
            }
          }
        );

        // Initialize QConnectJS client with either "QConnectClient" or "Client"
        const qConnectClient = new connect.qconnectjs.QConnectClient({
          instanceUrl,
        });

        const qConnectClient = new connect.qconnectjs.Client({
          instanceUrl: instanceUrl,                                         // REQUIRED
          endpoint: "https://my-instance-domain.my.connect.aws/api-proxy",  // optional, defaults to '<instanceUrl>'
          callSource: "agent-app",                                          // optional, defaults to 'agent-app'
          serviceId: 'AmazonQConnect',                                      // optional, defaults to 'AmazonQConnect'
          maxAttempts: 3,                                                   // optional, defaults to 3
          logger: {},                                                       // optional, if provided overrides default logger
          headers: {},                                                      // optional, if provided overrides request headers
          requestHandler: {},                                               // optional, if provided overrides the default request handler
        });
      }
    </script>
  </body>
</html>
```

The QConnectJS client integrates with Connect by loading the pre-built Amazon Q in Connect widget located at `<instanceUrl>/wisdom-v2` into an iframe and placing it into a container div. API requests are funneled through this widget and made available to your JS client code.

* `instanceUrl`: The Connect instance url.
* `endpoint`: Optional, set to override the Connect endpoint to use.
* `callSource`: Optional, set to override the call source identifier on requests.
* `headers`: This object is optional and allows overriding the headers provided to the HTTP handler.
* `logger`: This object is optional and allows overriding the default Logger for logging debug/info/warn/error messages.
* `maxAttempts`: Optional, set to specify how many times a request will be made at most in case of retry.
* `requestHandler`: This object is optional and allows overriding the default request handler.
* `serviceId`: Optional, set to override the unique service identifier on requests.


# ES Modules

## Imports

QConnectJS is modularized by client and commands.
To send a request, you only need to import the `QConnectClient` and
the commands you need, for example `GetRecommendations`:

```js
// ES5 example
const { Client, GetRecommendations } = require("amazon-q-connectjs");
```

```ts
// ES6+ example
import { Client, GetRecommendations } from "amazon-q-connectjs";
```

## Convenience Methods

The QConnectJS client can also send requests using convenience methods. However, it results in a bigger bundle size if you don't intend on using every available API.

```ts
import { QConnectClient } from "amazon-q-connectjs";

const qConnectClient = new QConnectClient({
  instanceUrl: "https://my-instance-domain.my.connect.aws",
});

// async/await.
try {
  const response = await qConnectClient.getRecommendations(params);
  // process response.
} catch (error) {
  // error handling.
}

// Promises.
qConnectClient
  .getRecommendations(params)
  .then((response) => {
    // process response.
  })
  .catch((error) => {
    // error handling.
  });
```

# Sending Requests

To send a request, you:

- Initiate the client with the desired configuration (e.g. `instanceUrl`, `endpoint`).
- call the desired API

```js
const qConnectClient = new QConnectClient({
  instanceUrl: "https://my-instance-domain.my.connect.aws",
});

qConnectClient.getRecommendations({
  // input parameters
});
```

# Reading Responses

All API calls through QConnectJS return a promise. The promise resolves/rejects to provide the response from the API call.

## Async/await

We recommend using the [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
operator.

```js
// async/await.
try {
  const response = await qConnectClient.getRecommendations({
    // input parameters
  });
  // process response.
} catch (error) {
  // error handling.
} finally {
  // finally.
}
```

`async`-`await` is clean, concise, intuitive, easy to debug and has better error handling
as compared to using Promise chains.

## Promises

You can also use [Promise chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#chaining).

```js
qConnectClient.getRecommendations({
  // input parameters
}).then((response) => {
  // process response.
}).catch((error) => {
  // error handling.
}).finally(() => {
  // finally.
});
```

# APIs

## DescribeContactFlow

Describes the specified flow, including the associated step-by-step guide.

### URI Request Parameters

* `ContactFlowId`: The identifier of the flow. You can find the ContactFlowId of the associated Step-by-step Guide when calling ListContentAssociations.
* `InstanceId`: The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.

#### A few things to note:

* One of the request parameters of the `DescribeContactFlow` API is the Amazon Connect `contactFlowId`. The `contactFlowId` of the associated step-by-step guide when calling [ListContentAssociations](#listcontentassociations). For more details see [Integrate Amazon Q in Connect with step-by-step guides](https://docs.aws.amazon.com/connect/latest/adminguide/integrate-q-with-guides.html).

### Response Syntax

If the action is successful, the service sends back an HTTP 200 response.

```json
{
  "ContactFlow": {
    "Arn": "string",
    "Content": "string",
    "Description": "string",
    "Id": "string",
    "Name": "string",
    "State": "string",
    "Status": "string",
    "Tags": {
      "string" : "string"
    },
    "Type": "string"
  }
}
```

### Sample Query

```ts
const describeContactFlowCommand = new DescribeContactFlow({
  ContactFlowId: <contactFlowId>,
  InstanceId: <instanceId>,
});

try {
  const response = await qConnectClient.call(describeContactFlowCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

## GetContact

Retrieves contact details, including the Amazon Q in Connect `sessionArn`, for a specified contact.

### URI Request Parameters

* `awsAccountId`: The identifier of the AWS account. You can find the awsAccountId in the ARN of the instance.
* `InstanceId`: The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
* `contactId`: The identifier of the Connect contact. Can be either the ID or the ARN. URLs cannot contain the ARN.

#### A few things to note:

* One of the request parameters of the `GetContact` API is the Amazon Connect `contactId`. The StreamsJS Contact API provides event subscription methods and action methods which can be called on behalf of a Contact and used to retrieve the Amazon Connect `contactId`. See [StreamsJS Integration](#streamsjs-integration) below for more information.

### Response Syntax

If the action is successful, the service sends back an HTTP 200 response.

```json
{
  "contactId": "string",
  "contactState": "string",
  "contactSchemaVersion": "number",
  "channel": "string",
  "targetQueueResourceId": "string",
  "agentResourceId": "string",
  "targetAgentResourceId": "string",
  "attributes": { ... },
  "participants": [ ... ],
  "contactFeature": {
    "loggingEnabled": "boolean",
    "textToSpeechFeatures": { ... },
    "voiceIdFeatures": { ... },
    "wisdomFeatures": {
      "wisdomConfig": {
        "sessionArn": "string"
      }
    }
  },
  "routingAttributes": { ... },
  "languageCode": "string",
  "channelContext": { ... },
}
```

### Sample Query

```ts
const getContactCommand = new GetContact({
  awsAccountId: <accountId>,
  instanceId: <instanceId>,
  contactId: <contactId>,
});

try {
  const response = await qConnectClient.call(getContactCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

## GetContent

Retrieves content, including a pre-signed URL to download the content. The `contentId` and `knowledgeBaseId` request parameters are part of search results response syntax when calling `QueryAssistant`. For more information check out the [GetContent](https://docs.aws.amazon.com/amazon-q-connect/latest/APIReference/API_GetContent.html) API reference.

### URI Request Parameters

* `contentId`: The identifier of the content. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `knowledgeBaseId`: The identifier of the knowledge base. Can be either the ID or the ARN. URLs cannot contain the ARN.

#### A few things to note:

* The `contentId` and `knowledgeBaseId` can be found by using the `QueryAssistant` API and referencing the `data` field of the results. Each results `data` will include a `contentReference`. See [QueryAssistant](#queryassistant) for more information.

### Response Syntax

If the action is successful, the service sends back an HTTP 200 response.

```json
{
   "content": {
      "contentArn": "string",
      "contentId": "string",
      "contentType": "string",
      "knowledgeBaseArn": "string",
      "knowledgeBaseId": "string",
      "linkOutUri": "string",
      "metadata": {
         "string" : "string"
      },
      "name": "string",
      "revisionId": "string",
      "status": "string",
      "tags": {
         "string" : "string"
      },
      "title": "string",
      "url": "string",
      "urlExpiry": number
   }
}
```

### Sample Query

```ts
const getContentCommand = new GetContent({
  contentId: <contentId>,
  knowledgeBaseId: <knowledgeBaseId>,
});

try {
  const response = await qConnectClient.call(getContentCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

## GetRecommendations

Retrieves recommendations (e.g. detected intents) for the specified session. To avoid retrieving the same recommendations in subsequent calls, use [NotifyRecommendationsReceived](#notifyrecommendationsreceived). This API supports long-polling behavior with the `waitTimeSeconds` parameter. Short poll is the default behavior and only returns recommendations already available. For more information check out the [GetRecommendations](https://docs.aws.amazon.com/amazon-q-connect/latest/APIReference/API_GetRecommendations.html) API reference. To perform a manual query against an assistant, use [QueryAssistant](#queryassistant).

### URI Request Parameters

* `assistantId`: The identifier of the Amazon Q in Connect assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `maxResults`: The maximum number of results to return per page.
* `sessionId`: The identifier of the session. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `waitTimeSeconds`: The duration (in seconds) for which the call waits for a recommendation to be made available before returning. If a recommendation is available, the call returns sooner than WaitTimeSeconds. If no messages are available and the wait time expires, the call returns successfully with an empty list.

#### A few things to note:

* The `assistantId` can be retrieved by using the `ListIntegrationAssociations` API provided by QConnectJS to look up the `assistant` and `knowledge base` that has been configured for Amazon Q in Connect. See [ListIntegrationAssociations](#listintegrationassociations) for more information.
* The `session ARN` can be retrieved by used the `GetContact` API provided by QConnectJS to look up the `session` associated with a given active `contact`. See [GetContact](#getcontact) for more information.
* To avoid retrieving the same recommendations on subsequent calls, the `NotifyRecommendationsReceived` API should be called after each response. See [NotifyRecommendationsReceived](#notifyrecommendationsreceived) for more information.
* GetRecommendations will return recommendations, e.g. detected customer intents, and you can use [QueryAssistant](#queryassistant) to generate an answer for the intent. See [Using QueryAssistant to Generate an Answer for an Intent Recommendation Returned by GetRecommendations](#using-queryassistant-to-generate-an-answer-for-an-intent-recommendation-returned-by-getrecommendations) for instructions.

### Response Syntax

```json
{
  "recommendations": [
    {
      "data": {
        "details": { ... },
        "reference": { ... }
      },
      "document": {
        "contentReference": {
          "contentArn": "string",
          "contentId": "string",
          "knowledgeBaseArn": "string",
          "knowledgeBaseId": "string",
          "referenceType": "string",
          "sourceURL": "string"
        },
        "excerpt": {
          "highlights": [
            {
              "beginOffsetInclusive": number,
              "endOffsetExclusive": number
            }
          ],
          "text": "string"
        },
        "title": {
          "highlights": [
            {
              "beginOffsetInclusive": number,
              "endOffsetExclusive": number
            }
          ],
          "text": "string"
        }
      },
      "recommendationId": "string",
      "relevanceLevel": "string",
      "relevanceScore": number,
      "type": "string"
    }
  ],
  "triggers": [
    {
      "data": { ... },
      "id": "string",
      "recommendationIds": [ "string" ],
      "source": "string",
      "type": "string"
    }
  ]
}
```

### Sample Query

```ts
const getRecommendationsCommand = new GetRecommendations({
  assistantId: <assistantId>,
  sessionId: <sessionId>,
  maxResults: <maxResults>,
  waitTimeSeconds: <waitTimeSeconds>,
});

try {
  const response = await qConnectClient.call(getRecommendationsCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

## ListContentAssociations

Lists the content associations. For more information about content associations--what they are and when they are used--see [Integrate Amazon Q in Connect with step-by-step guides](https://docs.aws.amazon.com/connect/latest/adminguide/integrate-q-with-guides.html) in the Amazon Connect admin guide.

### URI Request Parameters

* `contentId`: The identifier of the Amazon Q in Connect content. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `knowledgeBaseId`: The identifier of the Amazon Q in Connect knowledge base. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `MaxResults`: The maximum number of results to return per page.
* `nextToken`: The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.

#### A few things to note:

* The `contentId` and `knowledgeBaseId` can be found by using the `QueryAssistant` API and referencing the `data` field of the results. Each results `data` will include a `contentReference`. See [QueryAssistant](#queryassistant) for more information.
* The `contactFlowId` representative of the step-by-step guide can be retrieved by parsing the response for a content association of type `AMAZON_CONNECT_GUIDE` and parsing the `associationData` of the content association for the `flowId`.

### Response Syntax

```json
{
  "contentAssociationSummaries": [
    {
      "associationData": { ... },
      "associationType": "string",
      "contentArn": "string",
      "contentAssociationArn": "string",
      "contentAssociationId": "string",
      "contentId": "string",
      "knowledgeBaseArn": "string",
      "knowledgeBaseId": "string",
      "tags": {
        "string" : "string"
      }
    }
  ],
  "nextToken": "string"
}
```

### Sample Query

```ts
const listContentAssociationsCommand = new ListContentAssociations({
  contentId: <contentId>,
  knowledgeBaseId: <knowledgeBaseId>,
});

try {
  const response = await qConnectClient.call(listContentAssociationsCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

## ListIntegrationAssociations

Provides summary information about the AWS resource associations for the specified Amazon Connect instance. The Amazon Q in Connect configured `assistant` and `knowledgeBase` for the Connect instance can be retrieved via the `integrationType` `WISDOM_ASSISTANT` and `WISDOM_KNOWLEDGE_BASE` respectively. For more information check out the [ListIntegrationAssociations](https://docs.aws.amazon.com/connect/latest/APIReference/API_ListIntegrationAssociations.html) API reference.

### URI Request Parameters

* `InstanceId`: The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
* `IntegrationType`: The integration type. The Amazon Q in Connect configured `assistant` and `knowledgeBase` for the Connect instance can be retrieved via the `integrationType` `WISDOM_ASSISTANT` and `WISDOM_KNOWLEDGE_BASE` respectively.
* `MaxResults`: The maximum number of results to return per page.
* `nextToken`: The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.

#### A few things to note:
* One of the request parameters of the `ListIntegrationAssociations` API is the Amazon Connect `instanceId`. The StreamsJS Agent API provides event subscription methods and action methods which can be called on behalf of the agent and used to retrieve the Amazon Connect `instanceId`. See [StreamsJS Integration](#streamsjs-integration) below for more information.

### Response Syntax

If the action is successful, the service sends back an HTTP 200 response.


```json
{
  "IntegrationAssociationSummaryList": [
    {
      "InstanceId": "string",
      "IntegrationArn": "string",
      "IntegrationAssociationArn": "string",
      "IntegrationAssociationId": "string",
      "IntegrationType": "string",
      "SourceApplicationName": "string",
      "SourceApplicationUrl": "string",
      "SourceType": "string"
    }
  ],
  "NextToken": "string"
}
```

### Sample Query

```ts
const listIntegrationAssociationsCommand = new ListIntegrationAssociations({
  InstanceId: <instanceId>,
  IntegrationType: <integrationType>,
});

try {
  const response = await qConnectClient.call(listIntegrationAssociationsCommand);
    // process response.
} catch (error) {
  // error handling.
}
```


## NotifyRecommendationsReceived

Removes the specified recommendations from the specified assistant's queue of newly available recommendations. You can use this API in conjunction with GetRecommendations and a `waitTimeSeconds` input for long-polling behavior and avoiding duplicate recommendations. For more information check out the [NotifyRecommendationsReceived](https://docs.aws.amazon.com/amazon-q-connect/latest/APIReference/API_NotifyRecommendationsReceived.html) API reference.

### URI Request Parameters

* `assistantId`: The identifier of the Amazon Q in Connect assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `sessionId`: The identifier of the session. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `recommendationIds`: The identifier of the recommendations.

#### A few things to note:

* The `assistantId` can be retrieved by using the `ListIntegrationAssociations` API provided by QConnectJS to look up the `assistant` and `knowledge base` that has been configured for Amazon Q in Connect. See [ListIntegrationAssociations](#listintegrationassociations) for more information.
* The `session ARN` can be retrieved by used the `GetContact` API provided by QConnectJS to look up the `session` associated with a given active `contact`. See [GetContact](#getcontact) for more information.

### Response Syntax

```json
{
  "errors": [
    {
      "message": "string",
      "recommendationId": "string"
    }
  ],
  "recommendationIds": [ "string" ]
}
```

### Sample Query

```ts
const notifyRecommendationsReceivedCommand = new NotifyRecommendationsReceived({
  assistantId: <assistantId>,
  sessionId: <sessionId>,
  recommendationIds: [
    <recommendationId>,
  ],
});

try {
  const response = await qConnectClient.call(notifyRecommendationsReceivedCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

## PutFeedback

Provides feedback against the specified assistant for the specified target. This API only supports generative targets. For more information check out the [PutFeedback](https://docs.aws.amazon.com/connect/latest/APIReference/API_amazon-q-connect_PutFeedback.html) API reference.

### URI Request Parameters

* `assistantId`: The identifier of the Amazon Q in Connect assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `contentFeedback`: The information about the feedback provided.
* `targetId`: The identifier of the feedback target. It could be a resultId from a QueryAssistant call.
* `targetType`: The type of the feedback target.

#### A few things to note:
* The `assistantId` can be retrieved by using the `ListIntegrationAssociations` API provided by QConnectJS to look up the `assistant` and `knowledge base` that has been configured for Amazon Q in Connect. See [ListIntegrationAssociations](#listintegrationassociations) for more information.
* The `targetId` can be retrieved from the response of the `QueryAssistant` API provided by QConnectJS. In `QueryAssistant`, the `targetId` is the `resultId`. See [QueryAssistant](#queryassistant) for more information.

### Response Syntax

If the action is successful, the service sends back an HTTP 200 response.


```json
{
   "assistantArn": "string",
   "assistantId": "string",
   "contentFeedback": { ... },
   "targetId": "string",
   "targetType": "string"
}
```

### Sample Query

```ts
const putfeedbackCommand = new PutFeedback({
  assistantId: <assistantId>,
  targetId: <targetId>,
  targetType: <targetType>,
  contentFeedback: {
    generativeContentFeedbackData: {
      relevance: <relevance>,
    },
  },
});

try {
  const response = await qConnectClient.call(putfeedbackCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

## QueryAssistant

Performs a manual search against the specified assistant. To retrieve recommendations for an assistant, use [GetRecommendations](#getrecommendations). For more information check out the [QueryAssistant](https://docs.aws.amazon.com/amazon-q-connect/latest/APIReference/API_QueryAssistant.html) API reference.

### URI Request Parameters

* `assistantId`: The identifier of the Amazon Q in Connect assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `queryText`: The text to search for.
* `queryInputData`: Information about the query.
* `sessionId`: The identifier of the Amazon Q in Connect session. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `queryCondition`: The information about how to query content.
* `overrideKnowledgeBaseSearchType`: The search type to be used against the Knowledge Base for this request. The values can be SEMANTIC which uses vector embeddings or HYBRID which use vector embeddings and raw text.
* `maxResults`: The maximum number of results to return per page.
* `nextToken`: The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.

#### A few things to note:

* The `assistantId` can be retrieved by using the `ListIntegrationAssociations` API provided by QConnectJS to look up the `assistant` and `knowledge base` that has been configured for Amazon Q in Connect. See [ListIntegrationAssociations](#listintegrationassociations) for more information.
* The `queryInputData` can be used to specify input data for either a manual search query or an intent.
* The [QueryAssistant](#queryassistant) API can be used to generate an answer addressing an intent obtained from a `GetRecommendations` call against the specified session (see [Using QueryAssistant to Generate an Answer for an Intent Recommendation Returned by GetRecommendations](#using-queryassistant-to-generate-an-answer-for-an-intent-recommendation-returned-by-getrecommendations) for details).

### Response Syntax

If the action is successful, the service sends back an HTTP 200 response.

```json
{
  "nextToken": "string",
  "results": [
    {
      "data": {
        "details": { ... },
        "reference": { ... }
      },
      "document": {
        "contentReference": {
          "contentArn": "string",
          "contentId": "string",
          "knowledgeBaseArn": "string",
          "knowledgeBaseId": "string",
          "referenceType": "string",
          "sourceURL": "string"
        },
        "excerpt": {
          "highlights": [
            {
              "beginOffsetInclusive": number,
              "endOffsetExclusive": number
            }
          ],
          "text": "string"
        },
        "title": {
          "highlights": [
            {
              "beginOffsetInclusive": number,
              "endOffsetExclusive": number
            }
          ],
          "text": "string"
        }
      },
      "relevanceScore": number,
      "resultId": "string",
      "type": "string"
    }
  ]
}
```

### Sample Query

```ts
const queryAssistantCommand = new QueryAssistant({
  assistantId: <assistantId>,
  maxResults: <maxResults>,
  queryText: <queryText>,
  sessionId: <sessionId>,
  queryCondition: [
    {
      single: {
        field: QueryConditionFieldName.RESULT_TYPE,
        comparator: QueryConditionComparisonOperator.EQUALS,
        value: <resultType>, // KNOWLEDGE_CONTENT | GENERATIVE_ANSWER | INTENT_ANSWER
      }
    }
  ]
});

try {
  const response = await qConnectClient.call(queryAssistantCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

### Using QueryAssistant to Generate an Answer for an Intent Recommendation Returned by GetRecommendations

The [GetRecommendations](#getrecommendations) API will return the customer's intent detected during the session. You can choose whether to have QiC generate an answer that addresses the intent.

For example, you may receive the following response from the GetRecommendations API during the session.

```json
{
  "recommendations": [
    {
      "recommendationId": "1f644406-ccbf-4368-a8be-635ae8e8c93a",
      "data": {
        "reference": {
          "generativeReference": {
            "modelId": "",
            "generationId": ""
          }
        },
        "details": {
          "intentDetectedData": {
            "intent": "To learn how to set up a new primary key.",
            "intentId": "1f644406-ccbf-4368-a8be-635ae8e8c93a"
          }
        }
      },
      "relevanceScore": -1,
      "type": "DETECTED_INTENT"
    }
  ],
  "triggers": [
    {
      "id": "1f644406-ccbf-4368-a8be-635ae8e8c93a",
      "type": "GENERATIVE",
      "source": "ISSUE_DETECTION",
      "data": {
        "query": {
          "text": "How can I set up a new primary key?"
        }
      },
      "recommendationIds": [
        "1f644406-ccbf-4368-a8be-635ae8e8c93a"
      ]
    }
  ]
}
```

Above, QiC has detected an intent `"To learn how to set up a new primary key."`. To note, make sure to call [NotifyRecommendationsReceived](#notifyrecommendationsreceived), passing in the `recommendationId`, to avoid this intent from appearing in subsequent GetRecommendations calls.

To have QiC generate an answer that addresses this intent, perform the following.

1. Identify the `INTENT_ID`, in this case `"1f644406-ccbf-4368-a8be-635ae8e8c93a"`.
2. Make a QueryAssistant request, passing the `intentId` as part of the `queryInputData`, making sure to include the `sessionId` of the session in the request:

```ts
const queryAssistantCommand = new QueryAssistant({
  assistantId: <assistantId>,
  sessionId: <sessionId>,
  maxResults: <maxResults>,
  queryInputData: {
    intentInputData: {
      intentId: "1f644406-ccbf-4368-a8be-635ae8e8c93a",
    },
  },
  queryCondition: [
    {
      single: {
        field: QueryConditionFieldName.RESULT_TYPE,
        comparator: QueryConditionComparisonOperator.EQUALS,
        value: "INTENT_ANSWER",
      }
    }
  ]
});

try {
  const response = await qConnectClient.call(queryAssistantCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

3. The QueryAssistant response will contain an answer that addresses the intent:

```json
{
  "results": [
    {
      "resultId": "4d41745b-48a9-42fd-8d04-3b6c2cb16adb",
      "data": {
        ... # Answer addressing the intent
      },
      "type": "INTENT_ANSWER",
      "relevanceScore": -1
    }
  ]
}
```

We recommend making the [QueryAssistant](#queryassistant) call only when the agent is sure that they would like an answer addressing the intent. E.g. when you receive an intent via the [GetRecommendations](#getrecommendations) API, you may want to display to the agent a clickable button containing the intent text, and make the QueryAssistant call only when the agent clicks on the button.

## SearchSessions

> [!WARNING]
> This API has been discontinued. The `session ARN` can be retrieved by used the `GetContact` API provided by QConnectJS to look up the `session` associated with a given active `contact`. See [GetContact](#getcontact) for more information.


Searches for sessions. For more information check out the [SearchSessions](https://docs.aws.amazon.com/amazon-q-connect/latest/APIReference/API_SearchSessions.html) API reference.

### URI Request Parameters

* `assistantId`: The identifier of the Amazon Q in Connect assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `searchExpression`: The search expression to filter results.
* `maxResults`: The maximum number of results to return per page.
* `nextToken`: The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.

#### A few things to note:

* The `assistantId` can be retrieved by using the `ListIntegrationAssociations` API provided by QConnectJS to look up the `assistant` and `knowledge base` that has been configured for Amazon Q in Connect. See [ListIntegrationAssociations](#listintegrationassociations) for more information.

### Response Syntax

```json
{
  "nextToken": "string",
  "sessionSummaries": [
    {
      "assistantArn": "string",
      "assistantId": "string",
      "sessionArn": "string",
      "sessionId": "string"
    }
  ]
}
```

### Sample Query

```ts
const searchSessionsCommand = new SearchSessions({
  assistantId: <assistantId>,
  searchExpression: {
    filters: [
      {
        field: FilterField.NAME,
        operator: FilterOperator.EQUALS,
        value: <name>,
      }
    ]
  }
});

try {
  const response = await qConnectClient.call(searchSessionsCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

# StreamsJS Integration

In order to use QConnectJS, the library must be used in conjunction with [amazon-connect-streams](https://github.com/amazon-connect/amazon-connect-streams). Integrating with Amazon
Connect Streams provides enables you to handle agent and contact state events directly through an object oriented event driven interface.

## Agent

The StreamsJS Agent API provides event subscription methods and action methods which can be called on behalf of the agent. For more information check out the StreamsJS [Agent API](https://github.com/amazon-connect/amazon-connect-streams/blob/master/Documentation.md#agent-api) reference.
### InstanceId

The StreamsJS Agent API can be used to retrieve the Amazon Connect `instanceId` using the Agent `routingProfileId`. The routing profile contains the following fields:

* `channelConcurrencyMap`: See `agent.getChannelConcurrency()` for more info.
* `defaultOutboundQueue`: The default queue which should be associated with outbound contacts. See `queues` for details on properties.
* `name`: The name of th routing profile.
* `queues`: The queues contained in the routing profile. Each queue object has the following properties:
  * `name`: The name of the queue.
  * `queueARN`: The ARN of the queue.
  * `queueId`: Alias for the `queueARN`.
* `routingProfileARN`: The routing profile ARN.
* `routingProfileId`: Alias for the `routingProfileARN`.

```js
const routingProfile = agent.getRoutingProfile();

const instanceId = routingProfile.routingProfileId.match(
  /instance\/([0-9a-fA-F|-]+)\//
)[1];
```

## Contact

The StreamsJS Contact API provides event subscription methods and action methods which can be called on behalf of a contact. For more information check out the StreamsJS [Contact API](https://github.com/amazon-connect/amazon-connect-streams/blob/master/Documentation.md#contact-api) reference.
### ContactId

The StreamsJS Contact API can be used to retrieve the Amazon Connect `contactId` using the Contact `getContactId` method.

```js
const contactId = contact.getContactId();
```

# Troubleshooting

When the service returns an exception, the error will include the exception information.

```js
try {
  const data = await client.call(command);
  // process data.
} catch (error) {
  console.log(error);
  // error handling.
}
```

# Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for more information.

# License

QConnectJS is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),
see LICENSE for more information.
