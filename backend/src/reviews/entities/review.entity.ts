import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ReviewEntityType {
  EVENT_PLACE = 'eventplace',
  HOTEL = 'hotel',
  RESTAURANT = 'restaurant',
}

/**
 * Entidad Review
 * Calificaciones y comentarios sobre lugares turísticos
 */
@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id_review: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: ReviewEntityType,
  })
  entityType: ReviewEntityType;

  @Column({ type: 'uuid' })
  entityId: string;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;
}
