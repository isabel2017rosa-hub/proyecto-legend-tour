import { Injectable } from '@nestjs/common';
import { Credential } from './entities/credential.entity';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { CredentialsRepository } from './credentials.repository';

@Injectable()
export class CredentialsService {
  constructor(private readonly repo: CredentialsRepository) {}

  /** Delegar creación */
  async create(dto: CreateCredentialDto): Promise<Credential> {
    return this.repo.createAndSave(dto);
  }

  /** Delegar findAll */
  async findAll(): Promise<Credential[]> {
    return this.repo.findAll();
  }

  /** Delegar findOne (usando findByIdOrThrow) */
  async findOne(id: string): Promise<Credential> {
    return this.repo.findByIdOrThrow(id);
  }

  /** Delegar update parcial */
  async update(id: string, dto: UpdateCredentialDto): Promise<Credential> {
    return this.repo.updatePartial(id, dto);
  }

  /** Delegar remove */
  async remove(id: string): Promise<void> {
    await this.repo.removeById(id);
  }

  /** Delegar búsqueda por username */
  async findByUsername(username: string): Promise<Credential | null> {
    return this.repo.findByUsername(username);
  }

  /** Delegar cambio de contraseña */
  async changePassword(credentialId: string, newPassword: string): Promise<{ message: string }> {
    return this.repo.changePassword(credentialId, newPassword);
  }

  /** Métodos adicionales delegados para tokens */
  async setResetToken(id: string, hash: string, expires: Date): Promise<void> {
    await this.repo.setResetToken(id, hash, expires);
  }

  async clearResetToken(id: string): Promise<void> {
    await this.repo.clearResetToken(id);
  }

  async updateRefreshToken(id: string, hash: string | null): Promise<void> {
    await this.repo.updateRefreshToken(id, hash);
  }

  /** Buscar credencial por userId (puede retornar null) */
  async findByUserId(userId: string): Promise<Credential | null> {
    return this.repo.findByUserId(userId);
  }

  /** Buscar credencial por userId o lanzar excepción */
  async findByUserIdOrThrow(userId: string): Promise<Credential> {
    return this.repo.findByUserIdOrThrow(userId);
  }
}