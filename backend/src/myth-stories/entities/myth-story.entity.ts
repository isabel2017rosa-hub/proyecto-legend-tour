import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Region } from '../../regions/entities/region.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Entidad MythStory
 * Historias míticas asociadas a regiones
 */
@Entity('myth_stories')
export class MythStory {
  @PrimaryGeneratedColumn('uuid')
  id_mythStory: string;

  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 255 })
  imageUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Region, (region) => region.mythStories)
  region: Region;

  @ManyToOne(() => User, (user) => user.mythStories)
  user: User;
}
