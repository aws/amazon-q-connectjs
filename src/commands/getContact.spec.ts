/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { GetContact } from './getContact';
import { getRuntimeConfig } from '../utils/runtimeConfig.browser';
import { ClientMethods } from '../types/clientMethods';
import { VendorCodes } from '../types/vendorCodes';

describe('GetContact', () => {
  let command: GetContact;

  const config = getRuntimeConfig({
    instanceUrl: 'https://example.com',
  });
  const awsAccountId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const instanceId = 'b5b0e4af-026e-4472-9371-d171a9fdf75a';
  const contactId = '249bbb30-aede-42a8-be85-d8483c317686';

  it('should properly construct the command from the inputs provided', () => {
    command = new GetContact({
      awsAccountId,
      instanceId,
      contactId,
    });

    expect(command.vendorCode).toEqual(VendorCodes.Connect);
    expect(command.clientMethod).toEqual(ClientMethods.GetContact);
    expect(command.clientInput).toEqual({
      awsAccountId,
      instanceId,
      contactId,
    });
  });

  it('should construct an HTTP request when calling serializeRequest', () => {
    command = new GetContact({
      awsAccountId,
      instanceId,
      contactId,
    });

    expect(command.serializeRequest(config)).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-access-section': 'WISDOM',
          'x-amazon-call-source': 'agent-app',
          'x-amz-access-section': 'Wisdom',
          'x-amz-target': 'AgentAppService.Lcms.getContact',
          'x-amz-vendor': 'connect',
        }),
        body: JSON.stringify({
          awsAccountId,
          instanceId,
          contactId,
        }),
      }),
    );
  });

  it('should validate inputs when calling serializeRequest', () => {
    command = new GetContact({} as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid awsAccountId.');

    command = new GetContact({
      awsAccountId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid awsAccountId.');

    command = new GetContact({
      awsAccountId,
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid instanceId.');

    command = new GetContact({
      awsAccountId,
      instanceId: '',
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid instanceId.');

    command = new GetContact({
      awsAccountId,
      instanceId,
    } as any);

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid contactId.');

    command = new GetContact({
      awsAccountId,
      instanceId,
      contactId: '',
    });

    expect(() => command.serializeRequest({} as any)).toThrow('Invalid contactId.');
  });
});
