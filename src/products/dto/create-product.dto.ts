import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;
}