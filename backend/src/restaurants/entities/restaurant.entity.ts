import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventPlace } from '../../event-places/entities/event-place.entity';

/**
 * Entidad Restaurant
 * Restaurantes asociados a lugares turísticos
 */
@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id_restaurant: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ type: 'int', nullable: true })
  rating?: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  category?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website?: string;

  @OneToMany(() => EventPlace, (place) => place.restaurant)
  eventPlaces: EventPlace[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}