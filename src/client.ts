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

  constructor(config: ClientConfiguration) {
    const _config = getRuntimeConfig(config) as ClientConfig;
    this.config = _config;

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
    if (this.config.frameWindow || this.config.instanceUrl.includes(window?.location?.origin)) return;

    // Check if Amazon Q Connect is already initialized
    const iframe = document.querySelector('iframe[src*="wisdom-v2"]') as HTMLIFrameElement;
    
    if (iframe && iframe.contentWindow) {
      this.config.frameWindow = iframe;
    } else {
      try {
        (window as any)?.connect?.core.onInitialized(() => {
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
          this.config.frameWindow = document.getElementById(ServiceIds.AmazonQConnect) as HTMLIFrameElement;
        });
      } catch (e) {
        console.error('There was an error initializing Amazon Q Connect');
      }
    }
  }

  async call<InputType extends ClientInput, OutputType extends ClientOutput>(
    command: Command<ClientInput, InputType, ClientOutput, OutputType, ClientConfig>,
    options?: HandlerOptions,
  ): Promise<HttpResponse<OutputType>> {
    const handler = command.resolveRequestHandler(this.config, options);
    return handler().then((response: HttpResponse<OutputType>) => response);
  }
}
