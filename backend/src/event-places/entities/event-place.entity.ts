import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Region } from '../../regions/entities/region.entity';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Legend } from '../../legends/entities/legend.entity';

export enum EventPlaceType {
  FESTIVAL = 'festival',
  RUTA = 'ruta',
  EVENTO = 'evento',
  ATRACTIVO = 'atractivo',
}

/**
 * Entidad EventPlace
 * Lugares turísticos o culturales.
 * Nota seguridad: usar un DTO de salida para controlar qué datos se exponen y evitar retornar
 * objetos completos de relaciones (hotel, restaurant, region, legend). Mapear solo IDs o datos mínimos.
 */
@Entity('event_places')
export class EventPlace {
  /** Identificador único del lugar/evento */
  @PrimaryGeneratedColumn('uuid')
  id_eventPlace: string;

  /** Nombre del lugar/evento (máx 150 caracteres) */
  @Column({ type: 'varchar', length: 150 })
  name: string;

  /** Descripción detallada */
  @Column({ type: 'text' })
  description: string;

  /** Latitud en grados decimales */
  @Column({ type: 'float' })
  latitude: number;

  /** Longitud en grados decimales */
  @Column({ type: 'float' })
  longitude: number;

  /** Tipo de lugar/evento (enum) */
  @Column({
    type: 'enum',
    enum: EventPlaceType,
  })
  type: EventPlaceType;

  /** Fecha de creación automática */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  /** Fecha de última actualización automática */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  /** Región asociada (requerida) */
  @ManyToOne(() => Region, (region) => region.eventPlaces)
  region: Region;

  /** Hotel asociado (opcional). Si se elimina el hotel se establece NULL */
  @ManyToOne(() => Hotel, (hotel) => hotel.eventPlaces, { nullable: true, onDelete: 'SET NULL' })
  hotel: Hotel;

  /** Restaurante asociado (opcional). Si se elimina el restaurante se establece NULL */
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.eventPlaces, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  restaurant: Restaurant;

  /** Leyenda asociada (requerida) */
  @ManyToOne(() => Legend, (legend) => legend.eventPlaces)
  legend: Legend;
}
