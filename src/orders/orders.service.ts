import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { UserRole } from '../users/entities/user.entity.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  findAllForUser(user: any) {
    if (user.role === UserRole.ADMIN) {
      return this.ordersRepository.find({ relations: { product: true } });
    }
    if (user.role === UserRole.SELLER) {
      return this.ordersRepository.find({
        where: { product: { sellerId: user.userId } },
        relations: { product: true },
      });
    }
    return this.ordersRepository.find({
      where: { buyerId: user.userId },
      relations: { product: true },
    });
  }

  async findOne(id: number, user: any) {
    const order = await this.ordersRepository.findOne({
      where: { orderId: id },
      relations: { product: true },
    });
    if (!order) throw new NotFoundException(`No order exists with ID ${id}.`);

    const isBuyer = order.buyerId === user.userId;
    const isSeller = order.product?.sellerId === user.userId;
    if (!isBuyer && !isSeller && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You are not authorized to view this order.');
    }
    return order;
  }

  async create(buyerId: number, createOrderDto: CreateOrderDto) {
    const product = await this.productsRepository.findOne({
      where: { productId: createOrderDto.productId },
    });
    if (!product) {
      throw new NotFoundException(`Cannot place order. No product exists with ID ${createOrderDto.productId}.`);
    }

    const order = this.ordersRepository.create({
      buyerId,
      productId: createOrderDto.productId,
    });
    return this.ordersRepository.save(order);
  }

  async updateStatus(id: number, user: any, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id, user);
    if (order.product?.sellerId !== user.userId && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only the product seller can update order status.');
    }
    order.status = updateOrderDto.status;
    return this.ordersRepository.save(order);
  }
}