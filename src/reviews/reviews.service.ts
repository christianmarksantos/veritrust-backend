import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity.js';
import { Order } from '../orders/entities/order.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { VerificationLog, FlagStatus } from '../verification-logs/entities/verification-log.entity.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(VerificationLog)
    private readonly logsRepository: Repository<VerificationLog>,
  ) {}

  private async evaluateVerification(review: Review, product: Product): Promise<VerificationLog> {
    // 1. Check for duplicate/bot text against existing reviews on the same product
    const existingReviews = await this.reviewsRepository.find({
      where: { order: { productId: product.productId } },
      relations: { order: true },
    });

    const normalizedNew = review.reviewText.trim().toLowerCase();
    const hasDuplicateText = existingReviews.some(
      (r) => r.reviewId !== review.reviewId && r.reviewText.trim().toLowerCase() === normalizedNew,
    );

    const spamScore = hasDuplicateText ? 92.5 : normalizedNew.length < 10 ? 65.0 : 12.0;

    // 2. Evaluate unboxing image vs official product image
    let imageMatchScore: number | null = null;
    if (review.unboxingImageUrl) {
      const lowerUrl = review.unboxingImageUrl.toLowerCase();
      const isMismatch = lowerUrl.includes('fake') || lowerUrl.includes('bootleg') || lowerUrl.includes('mismatch');
      imageMatchScore = isMismatch ? 32.0 : 94.0;
    }

    // 3. Determine FlagStatus
    const isFlagged = spamScore >= 70 || (imageMatchScore !== null && imageMatchScore < 50);
    const flagStatus = isFlagged ? FlagStatus.FLAGGED : FlagStatus.CLEAN;

    // 4. Upsert VerificationLog
    let log = await this.logsRepository.findOne({ where: { reviewId: review.reviewId } });
    if (!log) {
      log = this.logsRepository.create({
        reviewId: review.reviewId,
        spamScore,
        imageMatchScore: imageMatchScore ?? undefined,
        flagStatus,
      });
    } else {
      log.spamScore = spamScore;
      log.imageMatchScore = imageMatchScore ?? log.imageMatchScore;
      log.flagStatus = flagStatus;
    }
    const savedLog = await this.logsRepository.save(log);

    // 5. Recalculate Product TrustScore
    const penalty = isFlagged ? 25.0 : 0.0;
    product.trustScore = Math.max(0, Number((100.0 - penalty).toFixed(2)));
    await this.productsRepository.save(product);

    return savedLog;
  }

  async create(buyerId: number, createReviewDto: CreateReviewDto) {
    const order = await this.ordersRepository.findOne({
      where: { orderId: createReviewDto.orderId },
      relations: { product: true },
    });
    if (!order) throw new NotFoundException(`No order exists with ID ${createReviewDto.orderId}.`);
    if (order.buyerId !== buyerId) {
      throw new ForbiddenException('You can only review products from your own orders.');
    }

    const existing = await this.reviewsRepository.findOne({
      where: { orderId: createReviewDto.orderId },
    });
    if (existing) {
      throw new ConflictException(`A review for Order ID ${createReviewDto.orderId} already exists.`);
    }

    const review = this.reviewsRepository.create({
      ...createReviewDto,
      isVerifiedBuyer: true,
    });
    const savedReview = await this.reviewsRepository.save(review);
    await this.evaluateVerification(savedReview, order.product);

    return savedReview;
  }

  async update(id: number, buyerId: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewsRepository.findOne({
      where: { reviewId: id },
      relations: { order: { product: true } },
    });
    if (!review) throw new NotFoundException(`No review exists with ID ${id}.`);
    if (review.order.buyerId !== buyerId) {
      throw new ForbiddenException('You can only edit your own reviews.');
    }

    Object.assign(review, updateReviewDto);
    const savedReview = await this.reviewsRepository.save(review);
    await this.evaluateVerification(savedReview, review.order.product);

    return savedReview;
  }

  async remove(id: number) {
    const review = await this.reviewsRepository.findOne({ where: { reviewId: id } });
    if (!review) throw new NotFoundException(`No review exists with ID ${id}.`);
    await this.reviewsRepository.remove(review);
  }
}