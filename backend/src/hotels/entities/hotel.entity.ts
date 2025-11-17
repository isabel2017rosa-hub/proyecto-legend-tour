import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventPlace } from '../../event-places/entities/event-place.entity';

// Transformador para mapear DECIMAL <-> number en TypeORM
const numericTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

/**
 * Entidad Hotel
 * Información de hoteles asociados a lugares turísticos
 */
@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id_hotel: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  /** Latitud en grados decimales */
  @Column({ type: 'decimal', precision: 9, scale: 6, transformer: numericTransformer })
  latitude: number;

  /** Longitud en grados decimales */
  @Column({ type: 'decimal', precision: 9, scale: 6, transformer: numericTransformer })
  longitude: number;

  @Column({ type: 'int' })
  rating: number;

  // Opcional según DTO
  @Column({ type: 'varchar', length: 255, nullable: true })
  website?: string;

  // Opcional según DTO
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @OneToMany(() => EventPlace, (place) => place.hotel)
  eventPlaces: EventPlace[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
