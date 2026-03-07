import { Module } from '@nestjs/common';
import { PaginationService } from 'src/common/pagination/pagination.service';

@Module({
  providers: [PaginationService],
  exports: [PaginationService],
})
export class PaginationModule {}
