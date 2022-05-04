/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

export type Debug = (content: string) => void;
export type Info = (content: string) => void;
export type Warn = (content: string) => void;
export type Error = (content: string) => void;

export interface Logger {
  debug: Debug;
  info: Info;
  warn: Warn;
  error: Error;
  log: Debug | Info | Warn | Error;
}
