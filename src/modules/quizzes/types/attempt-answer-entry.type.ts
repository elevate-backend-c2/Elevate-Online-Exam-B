import type { Types } from 'mongoose';

export interface AttemptAnswerEntry {
  questionId: Types.ObjectId;
  selectedOptions?: string[];
  isCorrect?: boolean;
  pointsAwarded?: number;
}

