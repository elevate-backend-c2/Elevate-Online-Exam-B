import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { QuizDifficulty } from '../enums/quiz-difficulty.enum';
import { AllowedQuizDifficultyConfig } from '../interfaces/allowed-difficulty.interface';

export class AllowedQuizDifficultyLevelsDto implements AllowedQuizDifficultyConfig {
  @IsEnum(QuizDifficulty)
  @ApiProperty({ enum: QuizDifficulty, example: QuizDifficulty.EASY })
  difficulty: QuizDifficulty;

  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 10, description: 'Points awarded for this difficulty' })
  points: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 5,
    description: 'Number of questions for this difficulty level',
  })
  numberOfQuestions: number;
}
