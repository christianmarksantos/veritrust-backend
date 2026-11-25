import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { Product } from '../../products/entities/product.entity.js';
import { Order } from '../../orders/entities/order.entity.js';

export enum UserRole {
  BUYER = 'Buyer',
  SELLER = 'Seller',
  ADMIN = 'Admin',
}

@Entity('user_accounts')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ length: 100 })
  fullName: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Product, (product) => product.seller)
  products: Relation<Product[]>;

  @OneToMany(() => Order, (order) => order.buyer)
  orders: Relation<Order[]>;
}