import { IsOptional, IsString, IsInt, MaxLength } from 'class-validator';

export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
