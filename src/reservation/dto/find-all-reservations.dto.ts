import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsOptional,
    IsString,
    Matches
} from 'class-validator';
import { ReservationStatus } from '../entities/reservation.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class FindAllReservationsDto extends PaginationDto {
    @ApiProperty({
        description: 'CPF of the client to filter by',
        example: '12345678900',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Matches(/^\d{11}$/, { message: 'CPF must be 11 digits' })
    cpf?: string;

    @ApiProperty({
        description: 'Status of the reservation',
        enum: ReservationStatus,
        required: false,
    })
    @IsOptional()
    @IsEnum(ReservationStatus)
    status?: ReservationStatus;
}