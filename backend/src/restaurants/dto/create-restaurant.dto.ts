// ============================================
// MÓDULO: RESTAURANTS
// ============================================

// src/restaurants/dto/create-restaurant.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
  MaxLength,
  IsInt,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Restaurante La Leyenda', description: 'Nombre del restaurante (máx 150 caracteres).', maxLength: 150 })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(150, { message: 'El nombre no puede exceder 150 caracteres.' })
  name: string;

  @ApiProperty({ example: 'Calle 85 #15-20', description: 'Dirección (máx 255 caracteres).', maxLength: 255 })
  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  @MaxLength(255, { message: 'La dirección no puede exceder 255 caracteres.' })
  address: string;

  @ApiProperty({ example: 4.65432, description: 'Latitud en grados decimales (-90 a 90).', minimum: -90, maximum: 90 })
  @Type(() => Number)
  @IsNumber({}, { message: 'La latitud debe ser un número.' })
  @Min(-90, { message: 'La latitud mínima permitida es -90.' })
  @Max(90, { message: 'La latitud máxima permitida es 90.' })
  latitude: number;

  @ApiProperty({ example: -74.12345, description: 'Longitud en grados decimales (-180 a 180).', minimum: -180, maximum: 180 })
  @Type(() => Number)
  @IsNumber({}, { message: 'La longitud debe ser un número.' })
  @Min(-180, { message: 'La longitud mínima permitida es -180.' })
  @Max(180, { message: 'La longitud máxima permitida es 180.' })
  longitude: number;

  @ApiPropertyOptional({ example: 4, description: 'Calificación entera de 0 a 5.' })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'La calificación (rating) debe ser un número entero.' })
  @Min(0, { message: 'La calificación mínima es 0.' })
  @Max(5, { message: 'La calificación máxima es 5.' })
  rating?: number;

  @ApiPropertyOptional({ example: 'Comida colombiana', description: 'Categoría del restaurante (máx 100 caracteres).', maxLength: 100 })
  @IsString({ message: 'La categoría debe ser una cadena de texto.' })
  @IsOptional()
  @MaxLength(100, { message: 'La categoría no puede exceder 100 caracteres.' })
  category?: string;

  @ApiPropertyOptional({ example: 'https://restaurant.com', description: 'Sitio web del restaurante (máx 255 caracteres).', maxLength: 255 })
  @IsOptional()
  @IsUrl({}, { message: 'La URL del sitio web no es válida.' })
  @MaxLength(255, { message: 'La URL no puede exceder 255 caracteres.' })
  website?: string;
}