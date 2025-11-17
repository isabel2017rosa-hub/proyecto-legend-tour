// src/users/dto/user-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

/**
 * DTO de salida para Usuario
 * Evita exponer campos sensibles (p.ej., credenciales, relaciones completas)
 * y define el contrato de respuesta documentado en Swagger.
 */
export class UserResponseDto {
  @ApiProperty({ example: 'e0f7c8d8-1234-4a6b-9abc-1234567890ab', description: 'Identificador del usuario (UUID v4).' })
  id: string;

  @ApiProperty({ example: 'John' })
  name: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@email.com' })
  email: string;

  @ApiProperty({ example: '123 Main St, City' })
  address: string;

  @ApiProperty({ example: '1990-01-15', description: 'Fecha de nacimiento (YYYY-MM-DD).' })
  birthdate: string;

  @ApiPropertyOptional({ example: '20123456789' })
  cuit?: string;

  @ApiPropertyOptional({ example: '3001234567' })
  phone?: string;

  /** Factory: mapear desde entidad */
  static fromEntity(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id_usuario;
    dto.name = user.name;
    dto.lastName = user.lastName;
    dto.email = user.email;
    dto.address = user.address;
    dto.birthdate = user.birthdate instanceof Date
      ? user.birthdate.toISOString().split('T')[0]
      : String(user.birthdate);
    dto.cuit = user.cuit ?? undefined;
    dto.phone = user.phone ?? undefined;
    return dto;
  }

  /** Factory: mapear múltiples entidades */
  static fromEntities(users: User[]): UserResponseDto[] {
    return users.map((u) => UserResponseDto.fromEntity(u));
  }
}
