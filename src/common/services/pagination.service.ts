import { PaginationDto } from '../dto/pagination.dto';
import { PaginatedResponseDto, PaginationMetaDto } from '../dto/paginated-response.dto';

export class PaginationService {
  static async paginate<T>(
    findMany: () => Promise<T[]>,
    count: () => Promise<number>,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<T>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      findMany(),
      count(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const meta: PaginationMetaDto = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };

    return {
      items,
      meta,
    };
  }
} 