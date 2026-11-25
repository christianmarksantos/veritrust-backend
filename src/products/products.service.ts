import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { Review } from '../reviews/entities/review.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { UserRole } from '../users/entities/user.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
  ) {}

  findAll(page = 1, limit = 10) {
    return this.productsRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({ where: { productId: id } });
    if (!product) throw new NotFoundException(`No product exists with ID ${id}.`);
    return product;
  }

  create(sellerId: number, createProductDto: CreateProductDto) {
    const product = this.productsRepository.create({
      ...createProductDto,
      sellerId,
    });
    return this.productsRepository.save(product);
  }

  async update(id: number, user: any, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (product.sellerId !== user.userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own product listings.');
    }
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: number, user: any) {
    const product = await this.findOne(id);
    if (product.sellerId !== user.userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own product listings.');
    }
    await this.productsRepository.remove(product);
  }

  async findProductReviews(productId: number) {
    await this.findOne(productId);
    return this.reviewsRepository.find({
      where: { order: { productId } },
      relations: { order: true },
    });
  }
}