import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateSpaceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;
}
