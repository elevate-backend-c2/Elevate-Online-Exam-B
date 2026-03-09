import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

export class FilterDiplomasDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Return diplomas issued on or after this date',
  })
  issuedAt?: Date;
}

export class GetDiplomasDto extends IntersectionType(
  PaginationQueryDto,
  FilterDiplomasDto,
) {}
