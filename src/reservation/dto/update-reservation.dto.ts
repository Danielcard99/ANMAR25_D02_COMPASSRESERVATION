import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsEnum,
    IsOptional
} from 'class-validator';
import { OrderStatus } from '../../../generated/prisma';

export class UpdateReservationDto {
    @ApiProperty({
        description: 'Reservation start date and time',
        example: '2024-03-20T10:00:00Z',
        required: false,
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate?: Date;

    @ApiProperty({
        description: 'Reservation end date and time',
        example: '2024-03-20T12:00:00Z',
        required: false,
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;

    @ApiProperty({
        description: 'Reservation status',
        enum: OrderStatus,
        example: OrderStatus.APPROVED,
        required: false,
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;
}