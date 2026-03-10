import { existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';

export const QUIZ_UPLOAD_DIR = join(process.cwd(), 'uploads', 'quizzes');

export function ensureQuizUploadDir(): void {
  if (!existsSync(QUIZ_UPLOAD_DIR)) {
    mkdirSync(QUIZ_UPLOAD_DIR, { recursive: true });
  }
}

export function generateQuizImageFilename(originalname?: string): string {
  const ext = extname(originalname || '').toLowerCase();
  const safeExt = ext && ext.length <= 10 ? ext : '';
  return `quiz-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
}

