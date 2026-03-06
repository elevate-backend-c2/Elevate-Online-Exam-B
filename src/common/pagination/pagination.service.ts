import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Model } from 'mongoose';
import {
  PaginatedDto,
  PaginationMeta,
} from 'src/common/pagination/dto/paginated-response.dto';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';

@Injectable()
export class PaginationService {
  async paginateQuery<T>(
    model: Model<T>,
    paginationQuery: PaginationQueryDto,
    queryFilters: object = {},
    request: Request,
  ): Promise<PaginatedDto<T>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const [totalItems, data] = await Promise.all([
      model.countDocuments(queryFilters).exec(),
      model.find(queryFilters).skip(skip).limit(limit).exec(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    const host = request.get('host');
    const protocol = request.protocol;
    const fullPath = `${protocol}://${host}${request.path}`;

    const response = new PaginatedDto<T>();
    response.data = data;
    response.meta = {
      currentPage: page,
      itemCount: data.length,
      itemsPerPage: limit,
      totalItems,
      totalPages,
    };
    response.links = {
      current: this.buildLink(fullPath, page, limit),
      first: this.buildLink(fullPath, 1, limit),
      last: this.buildLink(fullPath, totalPages, limit),
      next:
        page < totalPages ? this.buildLink(fullPath, page + 1, limit) : null,
      previous: page > 1 ? this.buildLink(fullPath, page - 1, limit) : null,
    };

    return response;
  }

  private buildLink(fullPath: string, page: number, limit: number): string {
    const url = new URL(fullPath);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('limit', limit.toString());
    return url.toString();
  }
}
