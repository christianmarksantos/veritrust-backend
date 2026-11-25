import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Review } from '../../reviews/entities/review.entity.js';

export enum FlagStatus {
  CLEAN = 'Clean',
  FLAGGED = 'Flagged',
  UNDER_REVIEW = 'Under Review',
}

@Entity('verification_logs')
export class VerificationLog {
  @PrimaryGeneratedColumn()
  logId: number;

  @Column({ unique: true })
  reviewId: number;

  @OneToOne(() => Review, (review) => review.verificationLog, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reviewId' })
  review: Relation<Review>;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  spamScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  imageMatchScore: number;

  @Column({ type: 'enum', enum: FlagStatus, default: FlagStatus.CLEAN })
  flagStatus: FlagStatus;

  @CreateDateColumn()
  evaluationDate: Date;
}