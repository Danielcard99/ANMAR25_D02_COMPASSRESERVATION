import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
    @ApiProperty({
        description: 'Current page number',
        example: 1,
    })
    page: number;

    @ApiProperty({
        description: 'Number of items per page',
        example: 10,
    })
    limit: number;

    @ApiProperty({
        description: 'Total number of items',
        example: 100,
    })
    total: number;

    @ApiProperty({
        description: 'Total number of pages',
        example: 10,
    })
    totalPages: number;

    @ApiProperty({
        description: 'Whether there is a next page',
        example: true,
    })
    hasNextPage: boolean;

    @ApiProperty({
        description: 'Whether there is a previous page',
        example: false,
    })
    hasPreviousPage: boolean;
}

export class PaginatedResponseDto<T> {
    @ApiProperty({
        description: 'Array of items in the current page',
        isArray: true,
    })
    items: T[];

    @ApiProperty({
        description: 'Metadata for pagination',
        type: PaginationMetaDto,
    })
    meta: PaginationMetaDto;
}