import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Order } from '../../orders/entities/order.entity.js';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column()
  sellerId: number;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sellerId' })
  seller: Relation<User>;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255 })
  imageUrl: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100.0 })
  trustScore: number;

  @OneToMany(() => Order, (order) => order.product)
  orders: Relation<Order[]>;
}