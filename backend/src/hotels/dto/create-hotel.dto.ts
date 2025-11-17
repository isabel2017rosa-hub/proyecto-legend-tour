// ============ src/hotels/dto/create-hotel.dto.ts ============
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
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateHotelDto {
  @ApiProperty({ example: 'Hotel Legend Palace', description: 'Nombre del hotel (máx 150 caracteres).' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(150, { message: 'El nombre no puede exceder 150 caracteres.' })
  name: string;

  @ApiProperty({ example: 'Av. Principal 456', description: 'Dirección del hotel (máx 255 caracteres).' })
  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  @MaxLength(255, { message: 'La dirección no puede exceder 255 caracteres.' })
  address: string;

  @ApiProperty({ example: 4.65432, description: 'Latitud en grados decimales (-90 a 90).' })
  @Type(() => Number)
  @IsNumber({}, { message: 'La latitud debe ser un número.' })
  @Min(-90, { message: 'La latitud mínima permitida es -90.' })
  @Max(90, { message: 'La latitud máxima permitida es 90.' })
  latitude: number;

  @ApiProperty({ example: -74.12345, description: 'Longitud en grados decimales (-180 a 180).' })
  @Type(() => Number)
  @IsNumber({}, { message: 'La longitud debe ser un número.' })
  @Min(-180, { message: 'La longitud mínima permitida es -180.' })
  @Max(180, { message: 'La longitud máxima permitida es 180.' })
  longitude: number;

  @ApiProperty({ example: 4, required: false, description: 'Calificación entera de 0 a 5.' })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'La calificación (rating) debe ser un número entero.' })
  @Min(0, { message: 'La calificación mínima es 0.' })
  @Max(5, { message: 'La calificación máxima es 5.' })
  rating?: number;

  @ApiProperty({ example: 'https://hotellegend.com', required: false, description: 'Sitio web del hotel.' })
  @IsOptional()
  @IsUrl({}, { message: 'La URL del sitio web no es válida.' })
  @MaxLength(255, { message: 'La URL no puede exceder 255 caracteres.' })
  website?: string;

  @ApiProperty({ example: '+57 300 1234567', required: false, description: 'Teléfono de contacto (máx 20 caracteres).' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
  @MaxLength(20, { message: 'El teléfono no puede exceder 20 caracteres.' })
  @Matches(/^[+()\-\s\d]*$/, { message: 'El teléfono solo puede contener números, espacios, "+", "-" y paréntesis.' })
  phone?: string;
}