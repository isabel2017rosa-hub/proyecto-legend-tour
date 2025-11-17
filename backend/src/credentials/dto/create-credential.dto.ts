// src/credentials/dto/create-credential.dto.ts
import { IsString, IsNotEmpty, MinLength, IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCredentialDto {
  @ApiProperty({ example: 'juanperez', description: 'Nombre de usuario para login' })
  @IsString({ message: 'el nombre de usuario debe ser texto' })
  @IsNotEmpty({ message: 'el nombre de usuario es obligatorio' })
  @MinLength(4, { message: 'el nombre de usuario debe tener mínimo 4 caracteres' })
  name_user: string;

  @ApiProperty({ example: 'Password123!', description: 'Contraseña (mínimo 6 caracteres)' })
  @IsString({ message: 'la contraseña debe ser texto' })
  @IsNotEmpty({ message: 'la contraseña es obligatoria' })
  @MinLength(6, { message: 'la contraseña debe tener mínimo 6 caracteres' })
  password_user: string;

  @ApiProperty({ example: false, required: false, description: 'Indica si el usuario es administrador' })
  @IsBoolean({ message: 'isAdmin debe ser un valor booleano' })
  @IsOptional()
  isAdmin?: boolean;

  @ApiProperty({ example: 'uuid-del-usuario', description: 'UUID del usuario asociado' })
  @IsUUID(undefined, { message: 'userId debe ser un UUID válido' })
  @IsNotEmpty({ message: 'userId es obligatorio' })
  userId: string;
}
