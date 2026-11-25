import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Order } from '../../orders/entities/order.entity.js';
import { VerificationLog } from '../../verification-logs/entities/verification-log.entity.js';

@Entity('product_reviews')
export class Review {
  @PrimaryGeneratedColumn()
  reviewId: number;

  @Column({ unique: true })
  orderId: number;

  @OneToOne(() => Order, (order) => order.review, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Relation<Order>;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  reviewText: string;

  @Column({ length: 255, nullable: true })
  unboxingImageUrl: string;

  @Column({ default: true })
  isVerifiedBuyer: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => VerificationLog, (log) => log.review)
  verificationLog: Relation<VerificationLog>;
}