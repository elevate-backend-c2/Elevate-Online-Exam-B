import { ApiProperty } from '@nestjs/swagger';
import { PaginationLinks } from 'src/common/pagination/dto/pagination-links.dto';
import { PaginationMeta } from 'src/common/pagination/dto/pagination-meta.dto';

export class PaginatedDto<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty()
  meta: PaginationMeta;

  @ApiProperty()
  links: PaginationLinks;
}
