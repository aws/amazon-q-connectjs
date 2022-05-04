/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Command } from './command';
import { HttpResponse } from './http';

/*
 * Function definition of client's 'call' function.
 */
 interface InvokeFunction<InputTypes extends object, OutputTypes extends object, ClientConfiguration> {
  <InputType extends InputTypes, OutputType extends OutputTypes>(
    command: Command<InputTypes, InputType, OutputTypes, OutputType, ClientConfiguration>,
    options?: any,
  ): Promise<HttpResponse<OutputType>>;
}

/*
 * A general interface for the service client.
 */
export interface Client<
  Input extends object,
  Output extends object,
  ClientConfiguration
> {
  readonly config: ClientConfiguration;
  call: InvokeFunction<Input, Output, ClientConfiguration>;
}
