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

  constructor(config: ClientConfiguration) {
    const _config = getRuntimeConfig(config) as ClientConfig;
    this.config = _config;

    this._frameReady = new Promise<void>((resolve) => {
      this._resolveFrameReady = resolve;
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

  initFrameConduit() {
    // No iframe needed for same-origin or if frameWindow is already set.
    if (this.config.frameWindow || this.config.instanceUrl.includes(window?.location?.origin)) {
      this._resolveFrameReady();
      return;
    }

    // Check if Amazon Q Connect is already initialized
    const iframe = document.querySelector('iframe[src*="wisdom-v2"]') as HTMLIFrameElement;
    
    if (iframe && iframe.contentWindow) {
      this.config.frameWindow = iframe;
      this._resolveFrameReady();
    } else {
      // If connect.core is not available, resolve immediately so calls fall through
      // to direct fetch (which may fail with CORS in cross-origin environments).
      if (!(window as any)?.connect?.core) {
        console.warn('Amazon Q Connect: connect.core is not available. Iframe proxy will not be established. ' +
          'Ensure QConnectClient is instantiated after connect.agentApp.initApp.');
        this._resolveFrameReady();
        return;
      }

      // Safety timeout: unblock API calls if initialization never completes.
      // Placed after the connect.core guard so it is only started when we
      // actually attempt iframe initialization.
      const timeoutId = setTimeout(() => {
        console.warn('Amazon Q Connect: iframe initialization timed out.');
        this._resolveFrameReady();
      }, 30_000);

      try {
        (window as any).connect.core.onInitialized(() => {
          let container = document.querySelector('q-connect-container');

          if (!container) {
            container = document.createElement('div');
            container.id = 'q-connect-container';
            document.body.appendChild(container);
          }

          (window as any)?.connect?.agentApp.initApp(
            ServiceIds.AmazonQConnect,
            'q-connect-container',
            `${this.config.instanceUrl}/wisdom-v2/?theme=hidden_page`,
            {
              style: 'display: none',
            }
          );

          const createdIframe = document.getElementById(ServiceIds.AmazonQConnect) as HTMLIFrameElement;

          if (createdIframe) {
            // Wait for the iframe content to fully load before resolving.
            // This ensures the wisdom-v2 page has registered its message listener
            // so that proxied requests via postMessage are not silently dropped.
            createdIframe.addEventListener('load', () => {
              clearTimeout(timeoutId);
              this.config.frameWindow = createdIframe;
              this._resolveFrameReady();
            });
            createdIframe.addEventListener('error', () => {
              clearTimeout(timeoutId);
              console.warn('Amazon Q Connect: iframe failed to load.');
              this._resolveFrameReady();
            });
          } else {
            // Iframe element not found — resolve to unblock calls (will fall through to direct fetch).
            clearTimeout(timeoutId);
            console.warn('Amazon Q Connect: iframe element was not created.');
            this._resolveFrameReady();
          }
        });
      } catch (e) {
        clearTimeout(timeoutId);
        console.error('There was an error initializing Amazon Q Connect');
        this._resolveFrameReady();
      }
    }
  }

  async call<InputType extends ClientInput, OutputType extends ClientOutput>(
    command: Command<ClientInput, InputType, ClientOutput, OutputType, ClientConfig>,
    options?: HandlerOptions,
  ): Promise<HttpResponse<OutputType>> {
    // Wait for the iframe conduit to be fully established before dispatching.
    // This prevents CORS errors and silent failures caused by sending requests
    // before the iframe proxy is ready to handle postMessage communication.
    await this._frameReady;

    const handler = command.resolveRequestHandler(this.config, options);
    return handler().then((response: HttpResponse<OutputType>) => response);
  }
}
