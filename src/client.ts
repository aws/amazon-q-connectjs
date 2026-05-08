/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { getRuntimeConfig } from './utils/runtimeConfig.browser';
import { Client as $Client } from './types/client';
import { Command } from './types/command';
import { RequestHandler } from './types/requestHandler';
import { HttpHeaders, HttpResponse, HttpHandlerOptions } from './types/http';
import { Logger } from './types/logger';
import { ServiceIds } from './types/serviceIds';
import { CallSources } from './types/callSources';
import { AccessSections } from './types/accessSections';
import { AppNames } from './types/appNames';
import { CHANNEL_READY_MSG, CHANNEL_READY_REQUEST_MSG } from './utils/communicationProxy';

interface ConnectWindow extends Window {
  connect?: {
    core?: {
      onInitialized: (callback: () => void) => void;
    };
    agentApp?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initApp: (appName: string, containerId: string, url: string, options: any) => void;
    };
  };
}

/*
 * The resolved configuration interface of the Client class.
 */
export interface ClientResolvedConfig {
  /*
   * Unique source identifier.
   */
  callSource: CallSources;
  /*
   * The Connect endpoint to use.
   */
  endpoint: string;
  /*
   * Custom headers provided to the HTTP handler.
   */
  headers: HttpHeaders;
  /*
   * The Connect instance url.
   */
  instanceUrl: string;
  /*
   * Logger for logging debug/info/warn/error.
   */
  logger: Logger;
  /*
   * Value for how many times a request will be made at most in case of retry.
   */
  maxAttempts: number;
  /*
   * The HTTP handler to use. Fetch in browser and Https in Nodejs.
   */
  requestHandler: RequestHandler<any, any, HttpHandlerOptions>;
  /*
   * Unique service identifier.
   */
  serviceId: ServiceIds;
  /*
   * Unique access section identifier.
   */
  accessSection?: AccessSections;

  frameWindow?: HTMLIFrameElement;
}

/*
 * The configuration interface of the Client class constructor.
 */
export type ClientConfiguration = Partial<ClientResolvedConfig>;

export class Client<
  HandlerOptions,
  ClientInput extends object,
  ClientOutput extends object,
  ClientConfig extends ClientResolvedConfig,
> implements $Client<ClientInput, ClientOutput, ClientConfig> {
  readonly config: ClientConfig;

  /*
   * Promise that resolves when the iframe conduit is fully ready to handle
   * proxied requests. All API calls await this before dispatching.
   */
  private _frameReady: Promise<void>;
  private _resolveFrameReady!: () => void;
  private _frameResolved = false;

  constructor(config: ClientConfiguration) {
    const _config = getRuntimeConfig(config) as ClientConfig;
    this.config = _config;

    this._frameReady = new Promise<void>((resolve) => {
      this._resolveFrameReady = () => {
        this._frameResolved = true;
        resolve();
      };
    });

    if (document.readyState === 'complete') {
      this.initFrameConduit();
    } else {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'complete') {
          this.initFrameConduit();
        }
      });
    }

    this.config.requestHandler.setRuntimeConfig(this.config)
  }

  /*
   * Listens for the CHANNEL_READY handshake from the iframe's
   * subscribeToChannel.  Returns a cleanup function to remove the listener.
   */
  private listenForChannelReady(onReady: () => void): () => void {
    const expectedOrigin = new URL(this.config.instanceUrl).origin;
    const handler = (e: MessageEvent) => {
      if (e.origin !== expectedOrigin) return;
      if (
        e.data?.source === AppNames.QConnectJS &&
        e.data?.type === CHANNEL_READY_MSG
      ) {
        window.removeEventListener('message', handler);

        const wisdomIframe = document.querySelector('iframe[src*="wisdom-v2"]') as HTMLIFrameElement
          || document.getElementById(ServiceIds.AmazonQConnect) as HTMLIFrameElement;

        if (wisdomIframe) {
          this.config.frameWindow = wisdomIframe;
        }

        console.debug(
          `Amazon Q in Connect [initFrameConduit]: received ${CHANNEL_READY_MSG} handshake. ` +
          `frameWindow=${wisdomIframe ? 'set' : 'not found'}. Resolving _frameReady.`,
        );
        onReady();
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }

  initFrameConduit() {
    const LOG = 'Amazon Q in Connect [initFrameConduit]:';

    if (this.config.frameWindow) {
      console.debug(`${LOG} frameWindow already set, resolving immediately.`);
      this._resolveFrameReady();
      return;
    }

    if (this.config.instanceUrl.includes(window?.location?.origin)) {
      console.debug(`${LOG} same-origin detected, no iframe proxy needed.`);
      this._resolveFrameReady();
      return;
    }

    console.debug(`${LOG} cross-origin detected. instanceUrl=${this.config.instanceUrl}`);

    // 30s safety timeout — also serves as backward-compat fallback for
    // older iframes that don't send CHANNEL_READY.
    const timeoutId = setTimeout(() => {
      removeHandshakeListener();
      console.warn(`${LOG} initialization timed out after 30s. Resolving without handshake.`);
      this._resolveFrameReady();
    }, 30_000);

    const removeHandshakeListener = this.listenForChannelReady(() => {
      clearTimeout(timeoutId);
      this._resolveFrameReady();
    });

    const resolveWithCleanup = () => {
      clearTimeout(timeoutId);
      removeHandshakeListener();
      this._resolveFrameReady();
    };

    const existingIframe = document.querySelector('iframe[src*="wisdom-v2"]') as HTMLIFrameElement;

    if (existingIframe && existingIframe.contentWindow) {
      // Set frameWindow and wait for CHANNEL_READY before resolving.
      // If the iframe bootstrapped before this Client was instantiated,
      // its initial CHANNEL_READY was missed — send a CHANNEL_READY_REQUEST
      // so the iframe re-sends it immediately.
      console.debug(`${LOG} found pre-existing wisdom-v2 iframe. Sending CHANNEL_READY_REQUEST probe.`);
      this.config.frameWindow = existingIframe;
      try {
        const targetOrigin = new URL(this.config.instanceUrl).origin;
        existingIframe.contentWindow.postMessage({
          source: AppNames.QConnectJS,
          type: CHANNEL_READY_REQUEST_MSG,
        }, targetOrigin);
      } catch (e) {
        console.warn(`${LOG} failed to send CHANNEL_READY_REQUEST: ${(e as Error)?.message}`);
      }
      return;
    }

    if (existingIframe) {
      console.debug(`${LOG} found wisdom-v2 iframe element but contentWindow is null.`);
    } else {
      console.debug(`${LOG} no pre-existing wisdom-v2 iframe found.`);
    }

    if (!(window as ConnectWindow)?.connect?.core) {
      console.warn(`${LOG} connect.core is not available. Iframe proxy will not be established.`);
      resolveWithCleanup();
      return;
    }

    console.debug(`${LOG} connect.core available. Registering onInitialized callback.`);

    let iframeCreationStarted = false;
    const createWisdomIframe = () => {
      if (iframeCreationStarted || this._frameResolved) return;
      iframeCreationStarted = true;

      try {
        let container = document.querySelector('#q-connect-container');
        if (!container) {
          container = document.createElement('div');
          container.id = 'q-connect-container';
          document.body.appendChild(container);
        }

        (window as ConnectWindow)?.connect?.agentApp?.initApp(
          ServiceIds.AmazonQConnect,
          'q-connect-container',
          `${this.config.instanceUrl}/wisdom-v2/?theme=hidden_page`,
          { style: 'display: none' },
        );

        const createdIframe = document.getElementById(ServiceIds.AmazonQConnect) as HTMLIFrameElement;

        if (createdIframe) {
          console.debug(`${LOG} wisdom-v2 iframe created. Waiting for CHANNEL_READY handshake.`);

          // load sets frameWindow but does NOT resolve _frameReady —
          // only the CHANNEL_READY handshake does that.
          createdIframe.addEventListener('load', () => {
            console.debug(`${LOG} wisdom-v2 iframe load event fired. frameWindow set.`);
            this.config.frameWindow = createdIframe;
          });
          createdIframe.addEventListener('error', () => {
            console.warn(`${LOG} wisdom-v2 iframe error event. Resolving without proxy.`);
            resolveWithCleanup();
          });
        } else {
          console.warn(`${LOG} agentApp.initApp did not create iframe element. Resolving without proxy.`);
          resolveWithCleanup();
        }
      } catch (e) {
        console.error(`${LOG} error creating wisdom iframe: ${(e as Error)?.message}`);
        resolveWithCleanup();
      }
    };

    try {
      (window as ConnectWindow).connect!.core!.onInitialized(() => {
        console.debug(`${LOG} connect.core.onInitialized fired.`);
        createWisdomIframe();
      });

      // onInitialized only fires for *future* events.  If CCP is already
      // initialized, detect via the CCP iframe and proceed immediately.
      if (document.querySelector('iframe[src*="ccp-v2"]')) {
        console.debug(`${LOG} CCP iframe already present. Creating wisdom iframe immediately.`);
        createWisdomIframe();
      } else {
        console.debug(`${LOG} CCP iframe not yet present. Waiting for onInitialized.`);
      }
    } catch (e) {
      console.error(`${LOG} error during initialization: ${(e as Error)?.message}`);
      resolveWithCleanup();
    }
  }

  async call<InputType extends ClientInput, OutputType extends ClientOutput>(
    command: Command<ClientInput, InputType, ClientOutput, OutputType, ClientConfig>,
    options?: HandlerOptions,
  ): Promise<HttpResponse<OutputType>> {
    if (!this._frameResolved) {
      await this._frameReady;
    }

    const handler = command.resolveRequestHandler(this.config, options);
    return handler().then((response: HttpResponse<OutputType>) => response);
  }
}
