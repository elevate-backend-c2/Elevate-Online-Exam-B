import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTopicDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'JavaScript Fundamentals' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Learn the basics of JavaScript programming language.',
  })
  description?: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    example: '665f6a3c2b7c4e1a9c123456',
    description: 'Diploma ID',
  })
  diplomaId: string;

  @IsOptional()
  @IsMongoId()
  @ApiPropertyOptional({
    example: '665f6a3c2b7c4e1a9c123457',
    description: 'Parent Topic ID for hierarchy',
  })
  parentTopicId?: string;


}
