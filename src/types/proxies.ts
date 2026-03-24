/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Represents the proxy services that can be used to handle requests based on the call source provided.
 */
export enum Proxies {
  AgentApp = '/agent-app/api',
  PublicApiProxy = '/api-proxy',
}
