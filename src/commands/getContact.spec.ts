/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { GetContact } from './getContact';

describe('GetContact', () => {
  let command: GetContact;

  const awsAccountId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const instanceId = 'b5b0e4af-026e-4472-9371-d171a9fdf75a';
  const contactId = '249bbb30-aede-42a8-be85-d8483c317686';

  it('should properly construct the command from the inputs provided', () => {
    command = new GetContact({
      awsAccountId,
      instanceId,
      contactId,
    });

    expect(command.clientMethod).toEqual('getContact');
    expect(command.clientInput).toEqual({
      awsAccountId,
      instanceId,
      contactId,
    });
  });

  it('should validate inputs when calling serialize', () => {
    command = new GetContact({} as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid awsAccountId.');

    command = new GetContact({
      awsAccountId: '',
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid awsAccountId.');

    command = new GetContact({
      awsAccountId,
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid instanceId.');

    command = new GetContact({
      awsAccountId,
      instanceId: '',
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid instanceId.');

    command = new GetContact({
      awsAccountId,
      instanceId,
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid contactId.');

    command = new GetContact({
      awsAccountId,
      instanceId,
      contactId: '',
    });

    expect(() => command.serialize({} as any)).toThrow('Invalid contactId.');
  });
});
