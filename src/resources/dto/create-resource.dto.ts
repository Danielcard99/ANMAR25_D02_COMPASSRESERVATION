import { IsNotEmpty, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
