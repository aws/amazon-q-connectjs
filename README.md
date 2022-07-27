# amazon-connect-wisdomjs

The Amazon Connect Wisdom JavaScript library (WisdomJS) gives you the power to build your own Wisdom widget.

The library uses an Amazon Connect authentication token to make API calls to Amazon Connect Wisdom and supports all Wisdom `Agent Assistant` functionality. For example, you can manually query knowledge documents, get knowledge content, or start generating automated suggestions.

WisdomJS supports the following APIs:
* [QueryAssistant](#QueryAssistant)
* [GetContact](#GetContact)
* [GetRecommendations](#GetRecommendations)
* [NotifyRecommendationsReceived](#NotifyRecommendationsReceived)
* [GetContent](#GetContent)
* [SearchSessions](#SearchSessions)
* [ListIntegrationAssociations](#ListIntegrationAssociations)


Note that this library must be used in conjunction with [amazon-connect-streams](https://github.com/amazon-connect/amazon-connect-streams).

## Learn More

For more advanced features, all Amazon Connect Wisdom functionality is accessible using the public API. For example, you can create an assistant and a knowledge base. Check out [Wisdom](https://docs.aws.amazon.com/cli/latest/reference/wisdom/index.html) available via the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html).

To learn more about Amazon Connect Wisdom and its capabilities, please check out the [Amazon Connect Wisdom User Guide](https://docs.aws.amazon.com/connect/latest/adminguide/amazon-connect-wisdom.html).

To learn more about Amazon Connect and its capabilities, please check out the [Amazon Connect User Guide](https://docs.aws.amazon.com/connect/latest/adminguide/what-is-amazon-connect.html).

# Getting Started

## Prerequisites

### Create an Amazon Connect Instance

The first step in setting up your Amazon Connect contact center is to create a virtual contact center instance. Each instance contains all the resources and settings related to your contact center. Follow the [Get started with Amazon Connect](https://docs.aws.amazon.com/connect/latest/adminguide/amazon-connect-get-started.html) user guide to get started.

### Enable Amazon Connect Wisdom For Your Instance

To utilize WisdomJS you should start by enabling Amazon Connect Wisdom for your Amazon Connect instance. Follow the [Enable Wisdom](https://docs.aws.amazon.com/connect/latest/adminguide/enable-wisdom.html) user guide to get started.

### Set Up Integrated Applications

All domains looking to integrate with Amazon Connect and Amazon Connect Wisdom must be explicitly allowed for cross-domain access to the instance. For example, to integrate with your custom agent application, you must place your agent application domain in an allow list. To allow list a domain URL follow the [app integration guide](https://docs.aws.amazon.com/connect/latest/adminguide/app-integration.html).

### A few things to note:
* Allowlisted domains must be HTTPS.
* All of the pages that attempt to initialize the WisdomJS library must be hosted on domains that are allowlisted.

# Usage

## Install from NPM

```bash
npm install amazon-connect-wisdomjs
```

## Build with NPM

```bash
$ git clone https://github.com/aws/amazon-connect-wisdomjs
cd amazon-connect-wisdomjs
npm install
npm run bundle
```

Find build artifacts in the `release` directory. This will generate a file called `amazon-connect-wisdomjs.js` and a minified version `amazon-connect-wisdomjs-min.js`. This is the full WisdomJS client which you will want to include in your page.

## Download from Github

`amazon-connect-wisdomjs` is available on [NPM](https://www.npmjs.com/package/amazon-connect-wisdomjs) but if you'd like to download it here, you can find build artificacts in the [release](/release) directory.

## Load from CDN

`amazon-connect-wisdomjs` is also available on open source CDNs. If you'd like to load build artifacts from a CDN, you can use either of the script tags below.

```html
<script src="https://cdn.jsdelivr.net/npm/amazon-connect-wisdomjs@1/release/amazon-connect-wisdomjs.js"><script>
```

```html
<script src="https://cdn.jsdelivr.net/npm/amazon-connect-wisdomjs@1/release/amazon-connect-wisdomjs-min.js"></script>
```

# Initialization

Initializing the WisdomJS client is the fist step to verify that you have everything setup correctly.

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <script type="text/javascript" src="connect-streams-min.js"></script>
    <script type="text/javascript" src="amazon-connect-wisdomjs-min.js"></script>
  </head>
  <!-- Add the call to init() as an onload so it will only run once the page is loaded -->
  <body onload="init()">
    <div id='ccp-container' style="width: 400px; height: 800px;"></div>
    <script type="text/javascript">
      const instanceUrl = 'https://my-instance-domain.awsapps.com/connect';

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
  
        // Initialize WisdomJS client
        const wisdomClient = new connect.wisdomjs.WisdomClient({
          instanceUrl,
        });

        const wisdomClient = new connect.wisdomjs.Client({
          instanceUrl: instanceUrl,                                        // REQUIRED
          endpoint: "https://my-instance-domain.awsapps.com/connect/api",  // optional, defaults to '<instanceUrl>'
          callSource: "agent-app",                                         // optional, defaults to 'agent-app'
          serviceId: 'Wisdom',                                             // optional, defaults to 'Wisdom'
          maxAttempts: 3,                                                  // optional, defaults to 3
          logger: {},                                                      // optional, if provided overrides default logger
          headers: {},                                                     // optional, if provided overrides request headers
          requestHandler: {},                                              // optional, if provided overrides the default request handler
        });
      }
    </script>
  </body>
</html>
```

The WisdomJS client integrates with Connect by loading the pre-built Wisdom widget located at `<instanceUrl>/wisdom-v2` into an iframe and placing it into a container div. API requests are funneled through this widget and made available to your JS client code.

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

WisdomJS is modularized by client and commands.
To send a request, you only need to import the `WisdomClient` and
the commands you need, for example `GetRecommendations`:

```js
// ES5 example
const { Client, GetRecommendations } = require("amazon-connect-wisdomjs");
```

```ts
// ES6+ example
import { Client, GetRecommendations } from "amazon-connect-wisdomjs";
```

## Convenience Methods

The WisdomJS client can also send requests using convenience methods. However, it results in a bigger bundle size.

```ts
import { WisdomClient } from "amazon-connect-wisdomjs";

const wisdomClient = new WisdomClient({
  instanceUrl: "https://your-connect-instance.my.connect.aws",
});

// async/await.
try {
  const response = await wisdomClient.getRecommendations(params);
  // process response.
} catch (error) {
  // error handling.
}

// Promises.
wisdomClient
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
const wisdomClient = new WisdomClient({
  instanceUrl: "https://your-connect-instance.my.connect.aws",
});

wisdomClient.getRecommendations({
  // input parameters
});
```

# Reading Responses

All API calls through WisdomJS return a promise. The promise resolves/rejects to provide the response from the API call.

## Async/await

We recommend using the [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
operator.

```js
// async/await.
try {
  const response = await wisdomClient.getRecommendations({
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
wisdomClient.getRecommendations({
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

## QueryAssistant

Performs a manual search against the specified assistant. To retrieve recommendations for an assistant, use GetRecommendations. For more information check out the [QueryAssistant](https://docs.aws.amazon.com/wisdom/latest/APIReference/API_QueryAssistant.html) API reference.

### URI Request Parameters

* `assistantId`: The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `queryText`: The text to search for.
* `maxResults`: The maximum number of results to return per page.
* `nextToken`: The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.

#### A few things to note:

* The `assistantId` can be retrieved by using the `ListIntegrationAssociations` API provided by WisdomJS to look up the `assistant` and `knowledge base` that has been configured for Wisdom. See [ListIntegrationAssociations](#ListIntegrationAssociations) for more information.

### Response Syntax

If the action is successful, the service sends back an HTTP 200 response.

```json
{
  "nextToken": "string",
  "results": [
    {
      "document": {
        "contentReference": {
          "contentArn": "string",
          "contentId": "string",
          "knowledgeBaseArn": "string",
          "knowledgeBaseId": "string"
        },
        "excerpt": {
          "highlights": [
            {
              "beginOffsetInclusive": "number",
              "endOffsetExclusive": "number"
            }
          ],
          "text": "string"
        },
        "title": {
          "highlights": [
            {
              "beginOffsetInclusive": "number",
              "endOffsetExclusive": "number"
            }
          ],
          "text": "string"
        }
      },
      "relevanceScore": "number",
      "resultId": "string"
    }
  ]
}
```

### Sample Query

```ts
const queryAssistantCommand = new QueryAssistant({
  assistantId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
  maxResults: 10,
  queryText: 'cancel order',
});

try {
  const response = await wisdomClient.call(queryAssistantCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

## GetContact

Retrieves contact details, including the Wisdom `session ARN`, for a specified contact.

### URI Request Parameters

* `awsAccountId`: The identifier of the AWS account. You can find the awsAccountId in the ARN of the instance.
* `InstanceId`: The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
* `contactId`: The identifier of the Connect contact. Can be either the ID or the ARN. URLs cannot contain the ARN.

#### A few things to note:

* One of the request parameters of the `GetContact` API is the Amazon Connect `contactId`. The StreamsJS Contact API provides event subscription methods and action methods which can be called on behalf of a Contact and used to retrieve the Amazon Connect `contactId`. See [StreamsJS Integration](#StreamsJS-Integration) below for more information.

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
  "attributes": {},
  "participants": [],
  "contactFeature": {
    "loggingEnabled": "boolean",
    "textToSpeechFeatures": {},
    "voiceIdFeatures": {},
    "wisdomFeatures": {
      "wisdomConfig": {
        "sessionArn": "string"
      }
    }
  },
  "routingAttributes": {},
  "languageCode": "string",
  "channelContext": {},
}
```

### Sample Query

```ts
const getContactCommand = new GetContact({
  awsAccountId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
  instanceId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
  contactId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
});

try {
  const response = await wisdomClient.call(getContactCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

## GetRecommendations

Retrieves recommendations for the specified session. To avoid retrieving the same recommendations in subsequent calls, use NotifyRecommendationsReceived. This API supports long-polling behavior with the `waitTimeSeconds` parameter. Short poll is the default behavior and only returns recommendations already available. To perform a manual query against an assistant, use the QueryAssistant API. For more information check out the [GetRecommendations](https://docs.aws.amazon.com/wisdom/latest/APIReference/API_GetRecommendations.html) API reference.

### URI Request Parameters

* `assistantId`: The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `maxResult`: The maximum number of results to return per page.
* `sessionId`: The identifier of the session. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `waitTimeSeconds`: The duration (in seconds) for which the call waits for a recommendation to be made available before returning. If a recommendation is available, the call returns sooner than WaitTimeSeconds. If no messages are available and the wait time expires, the call returns successfully with an empty list.

#### A few things to note:

* The `assistantId` can be retrieved by using the `ListIntegrationAssociations` API provided by WisdomJS to look up the `assistant` and `knowledge base` that has been configured for Wisdom. See [ListIntegrationAssociations](#ListIntegrationAssociations) for more information.
* The `session ARN` can be retrieved by used the `GetContact` API provided by WisdomJS to look up the `session` associated with a given active `contact`. See [GetContact](#GetContact) for more information.
* To avoid retrieving the same recommendations on subsequent calls, the `NotifyRecommendationsReceived` API should be called after each response. See [NotifyRecommendationsReceived]() for more information.

### Response Syntax

```json
{
  "recommendations": [
    {
      "document": {
        "contentReference": {
          "contentArn": "string",
          "contentId": "string",
          "knowledgeBaseArn": "string",
          "knowledgeBaseId": "string"
        },
        "excerpt": {
          "highlights": [
            {
              "beginOffsetInclusive": "number",
              "endOffsetExclusive": "number"
            }
          ],
          "text": "string"
        },
        "title": {
          "highlights": [
            {
              "beginOffsetInclusive": "number",
              "endOffsetExclusive": "number"
            }
          ],
          "text": "string"
        }
      },
      "recommendationId": "string",
      "relevanceLevel": "string",
      "relevanceScore": "number"
    }
  ]
}
```

### Sample Query

```ts
const getRecommendationsCommand = new GetRecommendations({
  assistantId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
  sessionId: '9f2b6fab-9200-46d8-977a-c89be3b34639',
  maxResults: 10,
  waitTimeSeconds: 5,
});

try {
  const response = await wisdomClient.call(getRecommendationsCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

## NotifyRecommendationsReceived

Removes the specified recommendations from the specified assistant's queue of newly available recommendations. You can use this API in conjunction with GetRecommendations and a `waitTimeSeconds` input for long-polling behavior and avoiding duplicate recommendations. For more information check out the [NotifyRecommendationsReceived](https://docs.aws.amazon.com/wisdom/latest/APIReference/API_NotifyRecommendationsReceived.html) API reference.

### URI Request Parameters

* `assistantId`: The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `sessionId`: The identifier of the session. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `recommendationIds`: The identifier of the recommendations.

#### A few things to note:

* The `assistantId` can be retrieved by using the `ListIntegrationAssociations` API provided by WisdomJS to look up the `assistant` and `knowledge base` that has been configured for Wisdom. See [ListIntegrationAssociations](#ListIntegrationAssociations) for more information.
* The `session ARN` can be retrieved by used the `GetContact` API provided by WisdomJS to look up the `session` associated with a given active `contact`. See [GetContact](#GetContact) for more information.

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
  assistantId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
  sessionId: '9f2b6fab-9200-46d8-977a-c89be3b34639',
  recommendationIds: [
    'f9b5fa90-b3ce-45c9-9967-582c87074864',
  ],
});

try {
  const response = await wisdomClient.call(notifyRecommendationsReceivedCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

## GetContent

Retrieves content, including a pre-signed URL to download the content. The `contentId` and `knowledgeBaseId` request parameters are part of search results response syntax when calling `QueryAssistant` or recommendations response syntax when calling `GetRecommendations`. For more information check out the [GetContent](https://docs.aws.amazon.com/wisdom/latest/APIReference/API_GetContent.html) API reference.

### URI Request Parameters

* `contentId`: The identifier of the content. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `knowledgeBaseId`: The identifier of the knowledge base. Can be either the ID or the ARN. URLs cannot contain the ARN.

#### A few things to note:

* The `contentId` and `knowledgeBaseId` can be found by using either the `QueryAssistant` or `GetRecommendations` APIs to retrieve knowledge documents. Each of the documents from either response will include a `contentReference`. See [QueryAssistant](#QueryAssistant) and [GetRecommendations]() for more information.

### Sample Query

```ts
const getContentCommand = new GetContent({
  contentId: '9f2b6fab-9200-46d8-977a-c89be3b34639',
  knowledgeBaseId: 'f9b5fa90-b3ce-45c9-9967-582c87074864',
});

try {
  const response = await wisdomClient.call(getContentCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

## SearchSessions

Searches for sessions. For more information check out the [SearchSessions](https://docs.aws.amazon.com/wisdom/latest/APIReference/API_SearchSessions.html) API reference.

### URI Request Parameters

* `assistantId`: The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
* `searchExpression`: The search expression to filter results.
* `maxResults`: The maximum number of results to return per page.
* `nextToken`: The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.

#### A few things to note:

* The `assistantId` can be retrieved by using the `ListIntegrationAssociations` API provided by WisdomJS to look up the `assistant` and `knowledge base` that has been configured for Wisdom. See [ListIntegrationAssociations](#ListIntegrationAssociations) for more information.

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
  assistantId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
  searchExpression: {
    filters: [
      {
        operator: 'equals',
        field: 'name',
        value: '249bbb30-aede-42a8-be85-d8483c317686',
      }
    ]
  }
});

try {
  const response = await wisdomClient.call(searchSessionsCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

## ListIntegrationAssociations

Retrieves Connect integrations, including assistant and knowledge base integrations. For more information check out the [ListIntegrationAssociations](https://docs.aws.amazon.com/connect/latest/APIReference/API_ListIntegrationAssociations.html) API reference.

### URI Request Parameters

* `InstanceId`: The identifier of the Amazon Connect instance. You can find the instanceId in the ARN of the instance.
* `IntegrationType`: The integration type.
* `MaxResults`: The maximum number of results to return per page.
* `nextToken`: The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.

#### A few things to note:
* One of the request parameters of the `ListIntegrationAssociations` API is the Amazon Connect `instanceId`. The StreamsJS Agent API provides event subscription methods and action methods which can be called on behalf of the agent and used to retrieve the Amazon Connect `instanceId`. See [StreamsJS Integration](#StreamsJS-Integration) below for more information.

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
  InstanceId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
  IntegrationType: 'WISDOM_ASSISTANT',
  MaxResults: 10,
});

try {
  const response = await wisdomClient.call(listIntegrationAssociations);
    // process response.
} catch (error) {
  // error handling.
}
```

# StreamsJS Integration

In order to use WisdomJS, the library must be used in conjunction with [amazon-connect-streams](https://github.com/amazon-connect/amazon-connect-streams). Integrating with Amazon
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

WisdomJS is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),
see LICENSE for more information.
