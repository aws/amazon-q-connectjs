/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Client } from './client';

describe('Client', () => {
  const client = new Client({} as any);

  const mockHandler = jest.fn((args: any) => Promise.resolve('success response'));
  const mockResolveRequestHandler = jest.fn((args: any) => mockHandler);
  const mockCommand = () => ({ resolveRequestHandler: mockResolveRequestHandler });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a response promise when only a command is supplied', async () => {
    await expect(
      client.call(mockCommand() as any),
    ).resolves.toEqual('success response');
  });

  it('should return a response promise when command and options are supplied', async () => {
    const options = { abortSignal: 'signal' };
    await expect(
      client.call(mockCommand() as any, options),
    ).resolves.toEqual('success response');
    expect(mockResolveRequestHandler.mock.calls.length).toEqual(1);
    expect(mockResolveRequestHandler.mock.calls[0][1 as any]).toEqual(options);
  });
})
