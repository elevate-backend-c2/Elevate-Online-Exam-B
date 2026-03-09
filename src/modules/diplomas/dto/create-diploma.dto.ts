import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDiplomaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Full-Stack Web Development' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'A comprehensive program covering frontend and backend development.',
  })
  description?: string;
}
