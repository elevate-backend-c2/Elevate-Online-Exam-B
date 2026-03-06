import { IsInt, IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  readonly page?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(100)
  readonly limit?: number;
}
