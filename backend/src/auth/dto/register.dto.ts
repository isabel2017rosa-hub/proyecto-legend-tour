// src/auth/dto/register.dto.ts
import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsDateString, IsInt, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre' })
  @IsString({ message: 'el nombre debe ser texto' })
  @IsNotEmpty({ message: 'el nombre es obligatorio' })
  @MinLength(2, { message: 'el nombre debe tener al menos 2 caracteres' })
  name: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido' })
  @IsString({ message: 'el apellido debe ser texto' })
  @IsNotEmpty({ message: 'el apellido es obligatorio' })
  @MinLength(2, { message: 'el apellido debe tener al menos 2 caracteres' })
  lastName: string;

  @ApiProperty({ example: 'juan.perez@email.com', description: 'Correo electrónico' })
  @IsEmail({}, { message: 'el correo no tiene formato válido' })
  @IsNotEmpty({ message: 'el correo es obligatorio' })
  email: string;

  @ApiProperty({ example: 'Calle 123, Ciudad', description: 'Dirección' })
  @IsString({ message: 'la dirección debe ser texto' })
  @IsNotEmpty({ message: 'la dirección es obligatoria' })
  @MinLength(5, { message: 'la dirección debe tener al menos 5 caracteres' })
  address: string;

  @ApiProperty({ example: '1990-01-15', description: 'Fecha de nacimiento (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty({ message: 'la fecha de nacimiento es obligatoria' })
  birthdate: string;

  @ApiProperty({ example: 'juanperez', description: 'Nombre de usuario' })
  @IsString({ message: 'el nombre de usuario debe ser texto' })
  @IsNotEmpty({ message: 'el nombre de usuario es obligatorio' })
  @MinLength(4, { message: 'el nombre de usuario debe tener mínimo 4 caracteres' })
  username: string;

  @ApiProperty({ example: 'Password123!', description: 'Contraseña (mínimo 8 caracteres, mayúscula, minúscula, número y símbolo)' })
  @IsString({ message: 'la contraseña debe ser texto' })
  @IsNotEmpty({ message: 'la contraseña es obligatoria' })
  @MinLength(8, { message: 'la contraseña debe tener mínimo 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+=\-{};:'",.<>/?]).+$/, { message: 'la contraseña debe incluir mayúsculas, minúsculas, números y un símbolo' })
  password: string;

  @ApiProperty({ example: '20123456789', required: false, description: 'CUIT opcional' })
  @IsString({ message: 'el CUIT debe ser texto' })
  @IsOptional()
  @MinLength(8, { message: 'el CUIT debe tener al menos 8 caracteres' })
  cuit?: string;

  @ApiProperty({ example: '30011245897', required: false, description: 'Teléfono opcional (solo dígitos, hasta 20 caracteres)' })
  @IsString({ message: 'el teléfono debe ser texto' })
  @IsOptional()
  @Matches(/^\d{7,20}$/,{ message: 'el teléfono debe contener solo dígitos y entre 7 y 20 caracteres' })
  phone?: string;
}