import { IsInt, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  reviewText?: string;

  @IsOptional()
  @IsUrl()
  unboxingImageUrl?: string;
}