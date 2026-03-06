import { QuizDifficulty } from "../enums/quiz-difficulty.enum";

export interface AllowedQuizDifficultyConfig {
    difficulty: QuizDifficulty;
    points: number;
    numberOfQuestions: number;
  }