import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsString,
    IsUUID,
    ValidateNested,
    IsInt,
    IsOptional
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
        description: 'Client ID',
        example: 1,
    })
    @IsInt()
    @IsNotEmpty()
    clientId: number;

    @ApiProperty({
        description: 'Space ID',
        example: 1,
    })
    @IsInt()
    @IsNotEmpty()
    spaceId: number;

    @ApiProperty({
        description: 'Resource IDs',
        example: [1, 2, 3],
        type: [Number],
    })
    @IsArray()
    @IsInt({ each: true })
    @IsNotEmpty()
    resourceIds: number[];

    @ApiProperty({
        description: 'Reservation start date and time',
        example: '2024-03-20T10:00:00Z',
    })
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    startDate: Date;

    @ApiProperty({
        description: 'Reservation end date and time',
        example: '2024-03-20T12:00:00Z',
    })
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    endDate: Date;
}