import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: 'password must have at least one number or letter',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{10,15}$/, {
    message: 'The phone must be entering between 10 or 11 numbers',
  })
  telephone: string;
}