import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { QuizDifficulty } from '../enums/quiz-difficulty.enum';

export class StartQuizDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ example: '665f6a3c2b7c4e1a9c789012', description: 'User starting the quiz' })
  userId: string;

  @IsEnum(QuizDifficulty)
  @ApiProperty({ enum: QuizDifficulty, example: QuizDifficulty.MEDIUM })
  difficulty: QuizDifficulty;
}
