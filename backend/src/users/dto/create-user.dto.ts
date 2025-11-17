// src/users/dto/create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsInt,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'Nombre del usuario (máx 100 caracteres).', maxLength: 100 })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres.' })
  name: string;

  @ApiProperty({ example: 'Doe', description: 'Apellido del usuario (máx 100 caracteres).', maxLength: 100 })
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres.' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@email.com', description: 'Correo electrónico único (máx 100 caracteres).', maxLength: 100 })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio.' })
  @MaxLength(100, { message: 'El correo electrónico no puede exceder 100 caracteres.' })
  email: string;

  @ApiProperty({ example: '123 Main St, City', description: 'Dirección (máx 255 caracteres).', maxLength: 255 })
  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  @MaxLength(255, { message: 'La dirección no puede exceder 255 caracteres.' })
  address: string;

  @ApiProperty({ example: '1990-01-15', description: 'Fecha de nacimiento en formato ISO (YYYY-MM-DD).' })
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida (ISO 8601).' })
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria.' })
  birthdate: string;

  @ApiPropertyOptional({ example: '20123456789', description: 'CUIT/CUIL del usuario (máx 50 caracteres).', maxLength: 50 })
  @IsString({ message: 'El CUIT debe ser una cadena de texto.' })
  @IsOptional()
  @MaxLength(50, { message: 'El CUIT no puede exceder 50 caracteres.' })
  cuit?: string;

  @ApiPropertyOptional({ example: 3001234567, description: 'Teléfono de contacto (entero, opcional).' })
  @Type(() => Number)
  @IsInt({ message: 'El teléfono debe ser un número entero.' })
  @IsOptional()
  phone?: number;
}