import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsString,
    IsUUID,
    ValidateNested
} from 'class-validator';

export class ReservationResourceDto {
    @ApiProperty({
        description: 'Resource ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty()
    @IsUUID()
    resourceId: string;

    @ApiProperty({
        description: 'Quantity of the resource to reserve',
        example: 5,
    })
    @IsNotEmpty()
    quantity: number;
}

export class CreateReservationDto {
    @ApiProperty({
        description: 'Space ID',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty()
    @IsUUID()
    spaceId: string;

    @ApiProperty({
        description: 'Start date and time of the reservation',
        example: '2025-05-01T14:00:00.000Z',
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startDate: Date;

    @ApiProperty({
        description: 'End date and time of the reservation',
        example: '2025-05-01T16:00:00.000Z',
    })
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    endDate: Date;

    @ApiProperty({
        description: 'Resources to be reserved',
        type: [ReservationResourceDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReservationResourceDto)
    resources: ReservationResourceDto[];
}