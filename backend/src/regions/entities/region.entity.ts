import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Check,
} from 'typeorm';
import { Legend } from '../../legends/entities/legend.entity';
import { MythStory } from '../../myth-stories/entities/myth-story.entity';
import { EventPlace } from '../../event-places/entities/event-place.entity';

/**
 * Entidad Region
 * Regiones geográficas con leyendas asignadas.
 * TODO: Agregar índices para latitude/longitude y legendId si se realizan búsquedas frecuentes.
 */
@Index('idx_regions_name', ['name'])
@Index('idx_regions_lat_lng', ['latitude', 'longitude'])
@Check('chk_regions_latitude_range', '"latitude" >= -90 AND "latitude" <= 90')
@Check('chk_regions_longitude_range', '"longitude" >= -180 AND "longitude" <= 180')
@Entity('regions')
export class Region {
  @PrimaryGeneratedColumn('uuid')
  id_region: string;

  @Column({ type: 'varchar', length: 150 })
  name: string; // Longitud alineada con DTO (150)

  @Column({ type: 'text' })
  description: string;

  /** Latitud en grados decimales (-90 a 90) */
  @Column({ type: 'float' })
  latitude: number;

  /** Longitud en grados decimales (-180 a 180) */
  @Column({ type: 'float' })
  longitude: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Legend, (legend) => legend.regions)
  legend: Legend;

  @OneToMany(() => MythStory, (story) => story.region)
  mythStories: MythStory[];

  @OneToMany(() => EventPlace, (place) => place.region)
  eventPlaces: EventPlace[];
}
