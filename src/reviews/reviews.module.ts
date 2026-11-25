import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service.js';
import { ReviewsController } from './reviews.controller.js';
import { Review } from './entities/review.entity.js';
import { Order } from '../orders/entities/order.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { VerificationLog } from '../verification-logs/entities/verification-log.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Order, Product, VerificationLog])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}