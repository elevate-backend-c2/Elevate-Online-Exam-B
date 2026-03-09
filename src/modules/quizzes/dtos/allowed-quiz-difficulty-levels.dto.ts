import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsPositive, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuizDifficulty } from '../enums/quiz-difficulty.enum';
import { AllowedQuizDifficultyConfig } from '../interfaces/allowed-difficulty.interface';

export class AllowedQuizDifficultyLevelDto implements AllowedQuizDifficultyConfig {
  @IsEnum(QuizDifficulty)
  @ApiProperty({ enum: QuizDifficulty, example: QuizDifficulty.EASY })
  difficulty: QuizDifficulty;

  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 10, description: 'Total points for this difficulty level' })
  points: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 5,
    description: 'Number of questions for this difficulty level',
  })
  numberOfQuestions: number;
}

export class AllowedQuizDifficultyLevelsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AllowedQuizDifficultyLevelDto)
  @ApiProperty({
    type: [AllowedQuizDifficultyLevelDto],
    example: [
      { difficulty: QuizDifficulty.EASY, points: 10, numberOfQuestions: 5 },
      { difficulty: QuizDifficulty.MEDIUM, points: 20, numberOfQuestions: 8 },
    ],
  })
  levels: AllowedQuizDifficultyLevelDto[];
}
