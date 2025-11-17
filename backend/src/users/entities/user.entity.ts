import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Credential } from '../../credentials/entities/credential.entity';
import { Review } from '../../reviews/entities/review.entity';
import { MythStory } from '../../myth-stories/entities/myth-story.entity';

/**
 * User Entity
 * Represents application users (tourists)
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id_usuario: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cuit?: string | null;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string | null;

  @Column({ type: 'date' })
  birthdate: Date;

  // One-to-one relationship with Credential
  @OneToOne(() => Credential, (credential) => credential.user, {
    cascade: true,
  })
  credential: Credential;

  // One-to-many relationship with Review
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => MythStory, (story) => story.user)
  mythStories: MythStory[];
}



