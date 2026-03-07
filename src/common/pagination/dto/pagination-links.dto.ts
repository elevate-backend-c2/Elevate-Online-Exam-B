import { ApiProperty } from "@nestjs/swagger";

// HATEOAS links
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