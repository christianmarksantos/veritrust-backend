import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @IsPositive()
  orderId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  reviewText: string;

  @IsOptional()
  @IsUrl()
  unboxingImageUrl?: string;
}