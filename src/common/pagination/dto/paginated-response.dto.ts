import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty()
  meta: PaginationMeta;

  @ApiProperty()
  links: PaginationLinks;
}

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

export class PaginationLinks {
  @ApiProperty()
  readonly first: string;

  @ApiProperty()
  readonly current: string;

  @ApiProperty({ nullable: true })
  readonly next: string | null;

  @ApiProperty({ nullable: true })
  readonly previous: string | null;

  @ApiProperty()
  readonly last: string;
}
