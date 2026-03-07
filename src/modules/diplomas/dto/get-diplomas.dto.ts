import { IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

export class FilterDiplomasDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  issuedAt?: Date;
}

export class GetDiplomasDto extends IntersectionType(
  PaginationQueryDto,
  FilterDiplomasDto,
) {}
