/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Determine if the current window is in an iframe.
 * Courtesy: http://stackoverflow.com/questions/326069/
 */
export const isFramed = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};
