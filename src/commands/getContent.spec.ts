/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { GetContent } from './getContent';

describe('GetContent', () => {
  let command: GetContent;

  const contentId = '85be2a14-94d7-41f2-835e-85368acb55df';
  const knowledgeBaseId = 'b5b0e4af-026e-4472-9371-d171a9fdf75a';

  it('should properly construct the command from the inputs provided', () => {
    command = new GetContent({
      contentId,
      knowledgeBaseId,
    });

    expect(command.clientMethod).toEqual('getContent');
    expect(command.clientInput).toEqual({
      contentId,
      knowledgeBaseId,
    });
  });

  it('should validate inputs when calling serialize', () => {
    command = new GetContent({} as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid contentId.');

    command = new GetContent({
      contentId: '',
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid contentId.');

    command = new GetContent({
      contentId,
    } as any);

    expect(() => command.serialize({} as any)).toThrow('Invalid knowledgeBaseId.');

    command = new GetContent({
      contentId,
      knowledgeBaseId: '',
    });

    expect(() => command.serialize({} as any)).toThrow('Invalid knowledgeBaseId.');
  });
});
