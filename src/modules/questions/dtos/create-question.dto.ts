import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateBy,
} from 'class-validator';
import { QuestionType } from '../enums/question-type.enum';

function correctAnswersSubsetOfOptions(value: string[], object: CreateQuestionDto): boolean {
  if (!value?.length || !object.options?.length) return false;
  const optionSet = new Set(object.options.map((o) => o.trim().toLowerCase()));
  return value.every((a) => optionSet.has(a.trim().toLowerCase()));
}

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'What is the result of 2 + 2?' })
  text: string;

  @IsEnum(QuestionType)
  @ApiProperty({ enum: QuestionType, example: QuestionType.SINGLE_CHOICE })
  type: QuestionType;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2, { message: 'options must have at least 2 items' })
  @ApiProperty({
    example: ['3', '4', '5', '6'],
    description: 'Answer options; min 2 for single/multiple choice, typically 2 for true/false',
  })
  options: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ValidateBy({
    name: 'correctAnswersValid',
    validator: {
      validate(value: string[], args: any) {
        const dto = args?.object as CreateQuestionDto;
        if (!dto?.type) return true;
        if (dto.type === QuestionType.SINGLE_CHOICE && value?.length !== 1)
          return false;
        if (dto.type === QuestionType.MULTIPLE_CHOICE && (!value?.length || value.length < 1))
          return false;
        if (dto.type === QuestionType.TRUE_FALSE && value?.length !== 1)
          return false;
        return correctAnswersSubsetOfOptions(value ?? [], dto);
      },
      defaultMessage() {
        return 'correctAnswers must be a non-empty subset of options; single_choice and true_false must have exactly one correct answer; multiple_choice at least one.';
      },
    },
  })
  @ApiProperty({
    example: ['4'],
    description: 'Correct answer(s); must be subset of options. One for single_choice/true_false.',
  })
  correctAnswers: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'Basic arithmetic: 2 + 2 = 4.',
  })
  explanation?: string;

  @IsInt()
  @Min(1)
  @Max(3)
  @ApiProperty({
    example: 1,
    description: 'Difficulty: 1 = easy, 2 = medium, 3 = hard',
  })
  difficulty: number;
  // TODO: remove this after auth guard is implemented
  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    required: false,
    example: '665f6a3c2b7c4e1a9c789012',
    description: 'ID of the user who created the question (can be set from auth later)',
  })
  createdBy?: string;
}
