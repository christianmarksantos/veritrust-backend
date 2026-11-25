import { Controller, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../users/entities/user.entity.js';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles(UserRole.BUYER)
  create(@Req() req: any, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req.user.userId, createReviewDto);
  }

  @Patch(':id')
  @Roles(UserRole.BUYER)
  update(@Param('id', ParseIntPipe) id: number, @Req() req: any, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, req.user.userId, updateReviewDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.remove(id);
  }
}