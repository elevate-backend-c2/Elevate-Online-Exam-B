import { ApiProperty } from "@nestjs/swagger";

export class PaginationMeta {
  @ApiProperty({ example: 100 })
  readonly totalItems: number;

  @ApiProperty({ example: 10 })
  readonly itemCount: number;

  @ApiProperty({ example: 10 })
  readonly itemsPerPage: number;

  @ApiProperty({ example: 2 })
  readonly currentPage: number;

  @ApiProperty({ example: 10 })
  readonly totalPages: number;
}