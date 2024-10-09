/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Represents the WidgetServices that can be passed via the `x-amz-target` header for API requests
 */
export enum WidgetServices {
  AmazonQConnect = 'WisdomV2',
  Wisdom = 'WisdomV2',
  AgentApp = 'AgentApp',
  Acs = 'Acs',
  Lcms = 'Lcms'
}
