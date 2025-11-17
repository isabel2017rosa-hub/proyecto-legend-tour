// src/credentials/dto/update-credential.dto.ts
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCredentialDto } from './create-credential.dto';

/**
 * DTO de actualización de credenciales.
 * Se basa en CreateCredentialDto pero omite el campo userId (no se cambia el usuario asociado)
 * y hace que todos los demás campos sean opcionales para actualización parcial.
 */
export class UpdateCredentialDto extends PartialType(
  OmitType(CreateCredentialDto, ['userId'] as const),
) {}

// Nota: Este archivo debe contener solo el DTO. La lógica de servicio fue removida y reside en credentials.service.ts