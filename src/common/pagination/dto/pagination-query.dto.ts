import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
} from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly page?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(100)
  readonly limit?: number;

  @ApiPropertyOptional({ description: 'Search term for diplomas' })
  @IsOptional()
  @IsString()
  readonly search?: string;

  @ApiPropertyOptional({ example: 'createdAt' })
  @IsOptional()
  @IsString()
  readonly sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  readonly order?: 'asc' | 'desc' = 'desc';
}
