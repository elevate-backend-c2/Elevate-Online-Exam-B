import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsMongoId, IsNotEmpty, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'JavaScript Basics Quiz' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'Test your knowledge of basic JavaScript concepts.',
  })
  description?: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ example: '665f6a3c2b7c4e1a9c123456', description: 'Topic ID' })
  topicId: string;

  @IsInt()
  @Min(50)
  @Max(95)
  @ApiProperty({
    example: 70,
    description: 'Required percentage to pass the quiz (1-100)',
  })
  passPercentage: number;

  @IsInt()
  @IsPositive()
  @Min(3)
  @Max(120)
  @ApiProperty({
    example: 30,
    description: 'Duration of the quiz in minutes',
  })
  durationMinutes: number;
}