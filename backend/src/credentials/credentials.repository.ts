// ============ src/credentials/credentials.repository.ts ============
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credential } from './entities/credential.entity';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import * as bcrypt from 'bcrypt';

/**
 * Repositorio especializado para operaciones con Credenciales.
 * Encapsula reglas de negocio comunes (hash de contraseña, unicidad de username, gestión de tokens).
 */
@Injectable()
export class CredentialsRepository {
  constructor(
    @InjectRepository(Credential)
    private readonly repo: Repository<Credential>,
  ) {}

  /** Crea una credencial nueva con contraseña hasheada y validación de unicidad */
  async createAndSave(dto: CreateCredentialDto): Promise<Credential> {
    const exists = await this.repo.findOne({ where: { name_user: dto.name_user } });
    if (exists) throw new ConflictException('El nombre de usuario ya existe');

    const hashed = await bcrypt.hash(dto.password_user, 10);
    const entity = this.repo.create({
      name_user: dto.name_user,
      password_user: hashed,
      isAdmin: dto.isAdmin ?? false,
      user: { id_usuario: dto.userId } as any,
    });
    return this.repo.save(entity);
  }

  /** Retorna todas las credenciales con la relación de usuario */
  async findAll(): Promise<Credential[]> {
    return this.repo.find({ relations: ['user'] });
  }

  /** Busca una credencial por ID (o lanza NotFound) */
  async findByIdOrThrow(id: string): Promise<Credential> {
    const cred = await this.repo.findOne({ where: { id_credential: id }, relations: ['user'] });
    if (!cred) throw new NotFoundException('Credencial no encontrada');
    return cred;
  }

  /** Busca por nombre de usuario (retorna null si no existe) */
  async findByUsername(username: string): Promise<Credential | null> {
    return this.repo.findOne({ where: { name_user: username }, relations: ['user'] });
  }

  /** Busca por userId (ID de usuario relacionado) */
  async findByUserId(userId: string): Promise<Credential | null> {
    return this.repo.findOne({ where: { user: { id_usuario: userId } }, relations: ['user'] });
  }

  /** Busca por userId o lanza NotFound */
  async findByUserIdOrThrow(userId: string): Promise<Credential> {
    const cred = await this.findByUserId(userId);
    if (!cred) throw new NotFoundException('Credencial asociada al usuario no encontrada');
    return cred;
  }

  /** Actualiza parcialmente una credencial (hash si cambia password, valida unicidad) */
  async updatePartial(id: string, dto: UpdateCredentialDto): Promise<Credential> {
    const cred = await this.findByIdOrThrow(id);

    if (dto.name_user && dto.name_user !== cred.name_user) {
      const duplicate = await this.repo.findOne({ where: { name_user: dto.name_user } });
      if (duplicate) throw new ConflictException('El nombre de usuario ya existe');
    }

    if (dto.password_user) {
      cred.password_user = await bcrypt.hash(dto.password_user, 10);
    }
    if (dto.name_user !== undefined) cred.name_user = dto.name_user;
    if (dto.isAdmin !== undefined) cred.isAdmin = dto.isAdmin;

    return this.repo.save(cred);
  }

  /** Elimina una credencial por ID */
  async removeById(id: string): Promise<void> {
    const cred = await this.findByIdOrThrow(id);
    await this.repo.remove(cred);
  }

  /** Cambia la contraseña directamente (hash aplicado) */
  async changePassword(id: string, newPassword: string): Promise<{ message: string }> {
    const cred = await this.findByIdOrThrow(id);
    cred.password_user = await bcrypt.hash(newPassword, 10);
    await this.repo.save(cred);
    return { message: 'Contraseña actualizada' };
  }

  /** Persiste hash y expiración del token de reseteo de contraseña */
  async setResetToken(id: string, resetHash: string, expires: Date): Promise<void> {
    const cred = await this.findByIdOrThrow(id);
    cred.reset_token_hash = resetHash;
    cred.reset_token_expires = expires;
    await this.repo.save(cred);
  }

  /** Limpia datos de reset token tras usarlo */
  async clearResetToken(id: string): Promise<void> {
    const cred = await this.findByIdOrThrow(id);
    cred.reset_token_hash = undefined;
    cred.reset_token_expires = undefined;
    await this.repo.save(cred);
  }

  /** Actualiza hash de refresh token (usar credentialId) */
  async updateRefreshToken(id: string, refreshHash: string | null): Promise<void> {
    const cred = await this.findByIdOrThrow(id);
    cred.refresh_token_hash = refreshHash ?? undefined;
    await this.repo.save(cred);
  }
}
