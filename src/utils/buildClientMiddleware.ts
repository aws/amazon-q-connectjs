/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FinalizeRequestHandlerOptions, FinalizeRequestMiddleware,
  DeserializeHandlerOptions, DeserializeMiddleware,
} from '@aws-sdk/types';

import { HttpHeaders } from '../types/http';

export const buildClientRequestMiddleware = <CommandInput extends object, CommandOutput extends object>(
  headers: HttpHeaders,
): [FinalizeRequestMiddleware<CommandInput, CommandOutput>, FinalizeRequestHandlerOptions] => {
  const middleware = (next: any) => {
    return (args: any) => {
      return next({
        ...args,
        request: {
          ...args.request,
          headers: {
            ...args.request.headers,
            'x-access-section': headers?.['x-access-section'],
          },
        },
      });
    };
  };

  const options = {
    step: 'finalizeRequest',
  } as FinalizeRequestHandlerOptions;

  return [middleware, options];
}

export const buildClientResponseMiddleware = <CommandInput extends object, CommandOutput extends object>(
  cb: (response: any) => void,
): [DeserializeMiddleware<CommandInput, CommandOutput>, DeserializeHandlerOptions] => {
  const middleware = (next: any) => {
    return async (args: any) => {
      const result = await next(args);

      cb(result.response);

      return result;
    };
  };

  const options = {
    step: 'deserialize'
  } as DeserializeHandlerOptions;

  return [middleware, options];
};
