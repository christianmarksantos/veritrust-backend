import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Product } from '../../products/entities/product.entity.js';
import { Review } from '../../reviews/entities/review.entity.js';

export enum OrderStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

@Entity('order_transactions')
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @Column()
  buyerId: number;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'buyerId' })
  buyer: Relation<User>;

  @Column()
  productId: number;

  @ManyToOne(() => Product, (product) => product.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Relation<Product>;

  @CreateDateColumn()
  orderDate: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @OneToOne(() => Review, (review) => review.order)
  review: Relation<Review>;
}