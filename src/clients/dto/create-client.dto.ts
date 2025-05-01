import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.replace(/\D/g, '').trim())
  @Matches(/^\d{11}$/, {
    message: 'CPF must be either 11 digits',
  })
  cpf: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @IsNotEmpty()
  @Transform(({ value }) => value.replace(/\D/g, '').trim())
  @Matches(/^\d{10,15}$/, { message: 'Telephone must be 10 to 15 digits' })
  telephone: string;
}
