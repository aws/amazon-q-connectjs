# amazon-connect-wisdomjs

## Description

The Amazon Connect Wisdom JavaScript library (WisdomJS) gives you the power to build your own Wisdom widget.

All Amazon Connect Wisdom `Agent Assistant` functionality is accessible using WisdomJS. For example, you can manually query knowledge documents, get knowledge content, or start generating automated suggestions.

This library must be used in conjunction with [amazon-connect-streams](https://github.com/amazon-connect/amazon-connect-streams) in order to utilize Amazon Connect's Chat or Task functionality.

## Learn More

For more advanced features, all Amazon Connect Wisdom functionality is accessible using the public API. For example, you can create an assistant and a knowledge base. Check out [Wisdom](https://docs.aws.amazon.com/cli/latest/reference/wisdom/index.html) available via the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html).

To learn more about Amazon Connect and its capabilities, please check out the [Amazon Connect User Guide](https://docs.aws.amazon.com/connect/latest/userguide/).

## Installing

Install using `npm`:
```
npm install amazon-connect-wisdomjs
```

## Getting Started

### Prerequisites

To utilize WisdomJS, start by allow listing your existing web application in the AWS Connect console. To allow list a domain URL follow the [app integration guide](https://docs.aws.amazon.com/connect/latest/adminguide/app-integration.html).
### Import

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

### Usage

To send a request, you:

- Initiate the client with the desired configuration (e.g. `instanceUrl`, `endpoint`).
- Initiate a command with input parameters.
- Use the `call` operation on the client with the command object as the input.

```js
// a client can be shared by different commands.
const wisdomClient = new Client({
  instanceUrl: "https://your-connect-instance.my.connect.aws",
});

const getRecommendationsCommand = new GetRecommendations({
  /** input parameters */
});
```

#### Async/await

We recommend using the [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
operator to wait for the promise returned by the `call` operation as follows:

```js
// async/await.
try {
  const response = await wisdomClient.call(getRecommendationsCommand);
  // process response.
} catch (error) {
  // error handling.
} finally {
  // finally.
}
```

`async`-`await` is clean, concise, intuitive, easy to debug and has better error handling
as compared to using Promise chains.

#### Promises

You can also use [Promise chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#chaining)
to execute the call operation.

```js
wisdomClient
  .call(command)
  .then(
    (response) => {
      // process response.
    },
    (error) => {
      // error handling.
    },
  );
```

Promises can also be called using `.catch()` and `.finally()` as follows:

```js
wisdomClient
  .call(command)
  .then((response) => {
    // process response.
  })
  .catch((error) => {
    // error handling.
  })
  .finally(() => {
    // finally.
  });
```

The client can also send requests using convenience methods.
However, it results in a bigger bundle size.

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

## API

### GetAuthorizedWidgetsForUser

Retrieves authorized widgets settings for Connect instance ID.

### GetContent

Retrieves content, including a pre-signed URL to download the content.

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

### GetRecommendations

Retrieves recommendations for the specified session. To avoid retrieving the same recommendations in subsequent calls, use NotifyRecommendationsReceived. This API supports long-polling behavior with the `waitTimeSeconds` parameter. Short poll is the default behavior and only returns recommendations already available. To perform a manual query against an assistant, use QueryAssistant.

```ts
const getRecommendationsCommand = new GetRecommendations({
  assistantId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
  sessionId: '9f2b6fab-9200-46d8-977a-c89be3b34639';
});

try {
  const response = await wisdomClient.call(getRecommendationsCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

### ListIntegrationAssociations

Retrieves Connect integrations, including assistant and knowledge base integrations.

```ts
const listIntegrationAssociationsCommand = new ListIntegrationAssociations({
  InstanceId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
});

try {
  const response = await wisdomClient.call(listIntegrationAssociations);
    // process response.
} catch (error) {
  // error handling.
}
```

### NotifyRecommendationsReceived

Removes the specified recommendations from the specified assistant's queue of newly available recommendations. You can use this API in conjunction with GetRecommendations and a `waitTimeSeconds` input for long-polling behavior and avoiding duplicate recommendations.

```ts
const notifyRecommendationsReceivedCommand = new NotifyRecommendationsReceived({
  assistantId: 'b5b0e4af-026e-4472-9371-d171a9fdf75a',
  sessionId: '9f2b6fab-9200-46d8-977a-c89be3b34639';
  recommendationIds: [
    'f9b5fa90-b3ce-45c9-9967-582c87074864',
  ];
});

try {
  const response = await wisdomClient.call(notifyRecommendationsReceivedCommand);
    // process response.
} catch (error) {
  // error handling.
}
```

### QueryAssistant

Performs a manual search against the specified assistant. To retrieve recommendations for an assistant, use GetRecommendations.

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

### SearchSessions

Searches for sessions.

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

## Troubleshooting

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

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for more information.

## License

WisdomJS is distributed under the
[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0),
see LICENSE for more information.
