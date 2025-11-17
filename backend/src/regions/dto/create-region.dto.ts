// src/regions/dto/create-region.dto.ts
import { IsString, IsNotEmpty, IsNumber, MaxLength, IsOptional, IsUUID, Min, Max, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRegionDto {
  @ApiProperty({ example: 'Bogotá', description: 'Nombre de la región', maxLength: 150 })
  @IsString({ message: 'El nombre debe ser una cadena.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(150, { message: 'El nombre no debe exceder 150 caracteres.' })
  name: string;

  @ApiProperty({ example: 'Capital de Colombia, rica en historia colonial', description: 'Descripción de la región.' })
  @IsString({ message: 'La descripción debe ser una cadena.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres.' })
  description: string;

  @ApiProperty({ example: 4.60971, description: 'Latitud en rango -90 a 90.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'La latitud debe ser numérica.' })
  @Min(-90, { message: 'La latitud mínima es -90.' })
  @Max(90, { message: 'La latitud máxima es 90.' })
  latitude: number;

  @ApiProperty({ example: -74.08175, description: 'Longitud en rango -180 a 180.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'La longitud debe ser numérica.' })
  @Min(-180, { message: 'La longitud mínima es -180.' })
  @Max(180, { message: 'La longitud máxima es 180.' })
  longitude: number;

  @ApiProperty({ example: 'uuid-de-leyenda', required: false, description: 'UUID de la leyenda asociada (opcional).' })
  @IsOptional()
  @IsUUID('4', { message: 'El id de leyenda debe ser un UUID v4 válido.' })
  legendId?: string;
}