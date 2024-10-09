/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Represents the CallSources that can be passed via the `x-amazon-call-source` header for API requests
 */
export enum CallSources {
  AgentApp = 'agent-app',
  PublicApiProxy = 'public-api-proxy',
}
