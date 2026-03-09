import { SetMetadata } from '@nestjs/common';

export type DiplomaAccessSource = 'param' | 'body' | 'quizParam';

export interface DiplomaAccessMetadata {
  source: DiplomaAccessSource;
  key: string;
}

export const DIPLOMA_ACCESS_KEY = 'DIPLOMA_ACCESS';

export const DiplomaAccess = (metadata: DiplomaAccessMetadata) =>
  SetMetadata(DIPLOMA_ACCESS_KEY, metadata);

