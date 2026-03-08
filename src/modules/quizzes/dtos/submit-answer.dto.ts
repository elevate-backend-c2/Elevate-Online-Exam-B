import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class SubmitAnswerDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ example: '665f6a3c2b7c4e1a9c123456', description: 'Question ID' })
  questionId: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['4'],
    description: 'Selected option(s) - one for single choice, multiple for multiple choice',
  })
  selectedOptions: string[];
}
