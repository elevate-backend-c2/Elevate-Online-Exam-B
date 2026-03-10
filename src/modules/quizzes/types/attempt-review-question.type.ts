export interface AttemptReviewQuestion {
  question: {
    text: string;
    options: string[];
    correctAnswers: string[];
    explanation?: string;
  };
  selectedOptions: string[];
  isCorrect: boolean;
  pointsAwarded: number;
}

