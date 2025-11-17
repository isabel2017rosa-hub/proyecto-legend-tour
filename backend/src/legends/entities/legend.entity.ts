import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Region } from '../../regions/entities/region.entity';
import { EventPlace } from '../../event-places/entities/event-place.entity';

/**
 * Entidad Legend
 * Representa una leyenda cultural
 */
@Entity('legends')
export class Legend {
  @PrimaryGeneratedColumn('uuid')
  id_legend: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  imageUrl: string;

  @OneToMany(() => Region, (region) => region.legend)
  regions: Region[];

  @OneToMany(() => EventPlace, (place) => place.legend)
  eventPlaces: EventPlace[];
}
