/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppNames } from '../types/appNames';
import { HttpResponse } from '../types/http';

export const fetchWithChannel = (
  destination: Window,
  origin: string,
  data: { url: string, options: RequestInit },
): Promise<HttpResponse<any>> => {
  return new Promise((resolve, reject) => {
    try {
      const channel = new MessageChannel();
      const { port1, port2 } = channel;

      port1.onmessage = (e) => {
        port1.close();
        resolve(e.data.data);
      };

      destination.postMessage({
        source: AppNames.QConnectJS,
        data,
      }, origin, [port2]);
    } catch (e) {
      reject(e);
    }
  });
};

export const subscribeToChannel = (
  cb: (url: string, options: RequestInit) => Promise<HttpResponse<any>>,
): void => {
  // If the current window location is the same as the window parent Amazon Q Connect is not embedded.
  if (window.self == window.top) return;

  window.addEventListener('message', async (e) => {
    if (e.data.source !== AppNames.QConnectJS) return;

    // Do we trust the sender of this message?
    // (might be different from what we originally opened, for example).
    if ((e.source as Window)?.location !== ((window.top || window.parent).location)) return;

    const port = e.ports[0];
    const { url, options } = e.data.data;
    const response = await cb(url, options);

    port.postMessage({
      source: AppNames.WisdomUI,
      data: response,
    });
  });
};
