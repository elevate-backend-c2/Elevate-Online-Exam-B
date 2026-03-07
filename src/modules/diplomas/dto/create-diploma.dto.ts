import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDiplomaDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
