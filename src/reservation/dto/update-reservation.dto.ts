import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsEnum,
    IsOptional
} from 'class-validator';
import { ReservationStatus } from '../entities/reservation.entity';

export class UpdateReservationDto {
    @ApiProperty({
        description: 'Start date and time of the reservation',
        example: '2025-05-01T14:00:00.000Z',
        required: false,
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate?: Date;

    @ApiProperty({
        description: 'End date and time of the reservation',
        example: '2025-05-01T16:00:00.000Z',
        required: false,
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;

    @ApiProperty({
        description: 'Status of the reservation',
        enum: ReservationStatus,
        required: false,
    })
    @IsOptional()
    @IsEnum(ReservationStatus)
    status?: ReservationStatus;
}