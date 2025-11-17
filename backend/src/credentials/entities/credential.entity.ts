import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

/**
 * Entidad Credential
 * Credenciales del usuario — Solo contiene datos sensibles:
 * password, roles, refresh token, reset tokens.
 */
@Entity('credentials')
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  id_credential: string;

  @Column({ type: 'varchar', length: 100 })
  name_user: string;

  @Column({ type: 'varchar', length: 255 })
  password_user: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  // Token de refresco (hash) opcional
  @Column({ type: 'varchar', length: 500, nullable: true })
  refresh_token_hash?: string;

  // Token de reseteo (hash) y expiración
  @Column({ type: 'varchar', length: 500, nullable: true })
  reset_token_hash?: string;

  @Column({ type: 'timestamp', nullable: true })
  reset_token_expires?: Date;

   /**
   * Relación 1:1 con User
   * - Cada usuario tiene exactamente un registro de credenciales.
   * - CASCADE elimina las credenciales cuando se borra el usuario.
   */
  @OneToOne(() => User, (user) => user.credential, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_user' })
  user: User;
}
