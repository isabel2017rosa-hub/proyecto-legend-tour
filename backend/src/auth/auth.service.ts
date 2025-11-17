import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CredentialsService } from '../credentials/credentials.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Credential } from '../credentials/entities/credential.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly credsService: CredentialsService,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  // Registro transaccional: crea usuario y credenciales en un solo paso
  async registerWithCredentials(dto: RegisterDto) {
    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const credRepo = manager.getRepository(Credential);

      // Validar unicidad de email y username
      const existingEmail = await userRepo.findOne({ where: { email: dto.email } });
      if (existingEmail) throw new ConflictException(`Email ${dto.email} ya está en uso`);
      const existingUsername = await credRepo.findOne({ where: { name_user: dto.username } });
      if (existingUsername) throw new ConflictException('El nombre de usuario ya existe');

      // Crear usuario
      const user = userRepo.create({
        name: dto.name,
        lastName: dto.lastName,
        email: dto.email,
        address: dto.address,
        birthdate: new Date(dto.birthdate),
        cuit: dto.cuit ?? null,
        // Guardar como string si viene, de lo contrario null
        phone: (dto as any).phone ?? null,
      } as any);
      const insertResult = await userRepo.insert(user);
      const userId = insertResult.identifiers[0]?.id_usuario as string;
      const savedUser = await userRepo.findOne({ where: { id_usuario: userId } });
      if (!savedUser) throw new ConflictException('No se pudo crear el usuario');

      // Crear credencial con hash
      const hashed = await bcrypt.hash(dto.password, 10);
      const credential = credRepo.create({
        name_user: dto.username,
        password_user: hashed,
        isAdmin: false,
        user: { id_usuario: savedUser.id_usuario } as any,
      });
      const savedCred = await credRepo.save(credential);

      return { message: 'Usuario registrado', user: savedUser, credentialId: savedCred.id_credential };
    });
  }

  // Valida credenciales para estrategia local
  async validateUser(username: string, password: string) {
    const cred = await this.credsService.findByUsername(username);
    if (!cred) return null;
    const match = await bcrypt.compare(password, cred.password_user);
    if (!match) return null;
    return { id: cred.user.id_usuario, email: cred.user.email, isAdmin: cred.isAdmin };
  }

  // Login - genera access token y refresh token (hash almacenado)
  async login(user: { id: string; email: string; isAdmin: boolean }) {
    if (!user) throw new UnauthorizedException('Usuario inválido');
    const payload = { sub: user.id, email: user.email, isAdmin: user.isAdmin };
    const access = await this.jwtService.signAsync(payload);
    const refresh = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
    // Guardar hash del refresh token usando userId -> credential
    const cred = await this.credsService.findByUserId(user.id);
    if (cred) {
      await this.credsService.updateRefreshToken(cred.id_credential, await bcrypt.hash(refresh, 10));
    }
    return { access_token: access, refresh_token: refresh };
  }

  // Refrescar tokens
  async refreshTokens(userId: string, refreshToken: string) {
    const cred = await this.credsService.findByUserIdOrThrow(userId);
    if (!cred.refresh_token_hash) throw new UnauthorizedException('Refresh inválido');
    const valid = await bcrypt.compare(refreshToken, cred.refresh_token_hash);
    if (!valid) throw new UnauthorizedException('Refresh inválido');
    return this.login({ id: cred.user.id_usuario, email: cred.user.email, isAdmin: cred.isAdmin });
  }

  // Cambiar contraseña
  async changePassword(userId: string, current: string, next: string) {
    const cred = await this.credsService.findByUserIdOrThrow(userId);
    const match = await bcrypt.compare(current, cred.password_user);
    if (!match) throw new UnauthorizedException('Contraseña actual incorrecta');
    await this.credsService.changePassword(cred.id_credential, next);
    return { message: 'Contraseña actualizada' };
  }

  // Preparar reset password (generar token)
  async generateResetToken(userId: string) {
    const cred = await this.credsService.findByUserIdOrThrow(userId);
    if (!cred) throw new UnauthorizedException('Credenciales no encontradas');
    const rawToken = crypto.randomUUID();
    await this.credsService.setResetToken(cred.id_credential, await bcrypt.hash(rawToken, 10), new Date(Date.now() + 1000 * 60 * 30));
    return { resetToken: rawToken, expiresInMinutes: 30 };
  }

  // Usar reset token para nueva contraseña
  async resetPassword(resetToken: string, newPassword: string, confirm: string) {
    if (newPassword !== confirm) throw new UnauthorizedException('Las contraseñas no coinciden');
    // Buscar credenciales y comparar hash
    // Método optimizado podría existir en el repositorio; aquí se itera por simplicidad
    const allCreds = await this.credsService.findAll();
    for (const cred of allCreds) {
      if (cred.reset_token_hash && cred.reset_token_expires && cred.reset_token_expires > new Date()) {
        const match = await bcrypt.compare(resetToken, cred.reset_token_hash);
        if (match) {
          await this.credsService.changePassword(cred.id_credential, newPassword);
          await this.credsService.clearResetToken(cred.id_credential);
          return { message: 'Contraseña restablecida' };
        }
      }
    }
    throw new UnauthorizedException('Token de reseteo inválido o expirado');
  }

  /**
   * Reset de contraseña optimizado: intenta coincidir token sin iterar todas las credenciales.
   * (Requiere tener el userId o credentialId para buscar directamente. Si solo se tiene el token, se mantiene el enfoque iterativo.)
   */
  async resetPasswordOptimized(userId: string, resetToken: string, newPassword: string, confirm: string) {
    if (newPassword !== confirm) throw new UnauthorizedException('Las contraseñas no coinciden');
    const cred = await this.credsService.findByUserIdOrThrow(userId);
    if (!cred.reset_token_hash || !cred.reset_token_expires || cred.reset_token_expires < new Date()) {
      throw new UnauthorizedException('Token de reseteo inválido o expirado');
    }
    const match = await bcrypt.compare(resetToken, cred.reset_token_hash);
    if (!match) throw new UnauthorizedException('Token de reseteo inválido');
    await this.credsService.changePassword(cred.id_credential, newPassword);
    await this.credsService.clearResetToken(cred.id_credential);
    return { message: 'Contraseña restablecida' };
  }
}
