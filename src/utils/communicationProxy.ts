/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppNames } from '../types/appNames';
import { HttpResponse } from '../types/http';

/*
 * Handshake signals exchanged between the parent page and the iframe.
 *
 * CHANNEL_READY         — iframe → parent: subscribeToChannel has registered
 *                         its listener and is ready to receive requests.
 * CHANNEL_READY_REQUEST — parent → iframe: request an immediate re-send of
 *                         CHANNEL_READY (used when a pre-existing iframe may
 *                         have already bootstrapped before this Client was
 *                         instantiated).
 */
export const CHANNEL_READY_MSG = 'CHANNEL_READY';
export const CHANNEL_READY_REQUEST_MSG = 'CHANNEL_READY_REQUEST';

/*
 * Timeout for a single fetchWithChannel attempt.
 *
 * With the CHANNEL_READY handshake in place, _frameReady is only resolved
 * after subscribeToChannel has registered its listener, so a timeout here
 * should only occur if the channel becomes unresponsive after initialization.
 * A single timeout with no retry avoids the risk of duplicating non-idempotent
 * POST requests (e.g. sendMessage, createSession).
 */
const CHANNEL_TIMEOUT_MS = 30_000;

export const fetchWithChannel = (
  destination: Window,
  origin: string,
  data: { url: string, options: RequestInit },
  timeoutMs: number = CHANNEL_TIMEOUT_MS,
): Promise<HttpResponse<any>> => {
  const LOG_PREFIX = 'Amazon Q Connect [fetchWithChannel]:';
  const requestUrl = data?.url || 'unknown';
  const amzTarget = (data?.options?.headers as any)?.['x-amz-target'] || 'unknown';

  console.debug(`${LOG_PREFIX} sending request. url=${requestUrl}, x-amz-target=${amzTarget}, timeout=${timeoutMs}ms`);

  return new Promise((resolve, reject) => {
    let settled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
      const channel = new MessageChannel();
      const { port1, port2 } = channel;

      timeoutId = timeoutMs > 0
        ? setTimeout(() => {
            if (!settled) {
              settled = true;
              port1.close();
              const msg = `${LOG_PREFIX} request timed out after ${timeoutMs}ms. url=${requestUrl}, x-amz-target=${amzTarget}`;
              console.error(msg);
              reject(new Error(msg));
            }
          }, timeoutMs)
        : undefined;

      port1.onmessage = (e) => {
        if (!settled) {
          settled = true;
          if (timeoutId !== undefined) clearTimeout(timeoutId);
          port1.close();
          console.debug(`${LOG_PREFIX} received response. url=${requestUrl}, x-amz-target=${amzTarget}, status=${e.data?.data?.status}`);
          resolve(e.data.data);
        }
      };

      destination.postMessage({
        source: AppNames.QConnectJS,
        data,
      }, origin, [port2]);
    } catch (e) {
      settled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      const msg = `${LOG_PREFIX} failed to send request. url=${requestUrl}, x-amz-target=${amzTarget}. Error: ${(e as Error)?.message}`;
      console.error(msg);
      const err = new Error(msg);
      (err as any).cause = e;
      reject(err);
    }
  });
};

export const subscribeToChannel = (
  cb: (url: string, options: RequestInit) => Promise<HttpResponse<any>>,
): void => {
  if (window.self == window.top) return;

  window.addEventListener('message', async (e) => {
    if (e.data.source !== AppNames.QConnectJS) return;
    if (e.data.type === CHANNEL_READY_MSG) return;

    // If the parent requests a re-send of CHANNEL_READY (e.g. a new Client
    // instantiated after this iframe had already bootstrapped), respond immediately.
    // Only respond to requests from window.parent or window.top to prevent a
    // malicious sibling iframe from triggering unnecessary broadcasts.
    if (e.data.type === CHANNEL_READY_REQUEST_MSG) {
      if (e.source === window.parent || e.source === window.top) {
        sendChannelReadySignal();
      }
      return;
    }

    if (
      (e.source as Window)?.location !== window.parent?.location &&
      (e.source as Window)?.location !== window.top?.location
    ) return;

    const port = e.ports[0];
    const { url, options } = e.data.data;
    const response = await cb(url, options);

    port.postMessage({
      source: AppNames.WisdomUI,
      data: response,
    });
  });

  sendChannelReadySignal();
};

/*
 * Sends the CHANNEL_READY handshake signal to the parent window.
 *
 * Target origin is '*' because the iframe has no way to know which page
 * embedded it — the customer's page origin is never passed to the iframe
 * during initialization.  The payload contains no sensitive data; it is
 * purely a readiness notification ({ source, type }).
 *
 * window.top is also notified as a fallback for nested-iframe deployments
 * (e.g. the iframe is nested inside the CCP agent app frame).
 */
function sendChannelReadySignal() {
  try {
    const readyPayload = {
      source: AppNames.QConnectJS,
      type: CHANNEL_READY_MSG,
    };

    window.parent.postMessage(readyPayload, '*');

    if (window.top && window.top !== window.parent) {
      window.top.postMessage(readyPayload, '*');
    }

    console.debug(`Amazon Q Connect [subscribeToChannel]: ${CHANNEL_READY_MSG} signal sent to parent.`);
  } catch (e) {
    console.warn(
      `Amazon Q Connect [subscribeToChannel]: failed to send ${CHANNEL_READY_MSG} signal: ${(e as Error)?.message}`,
    );
  }
}
