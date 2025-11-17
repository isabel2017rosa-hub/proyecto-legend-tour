// src/event-places/dto/create-event-place.dto.ts
import { 
  IsString, 
  IsNotEmpty, 
  IsNumber, 
  IsEnum, 
  IsUUID, 
  MaxLength, 
  MinLength, 
  Min, 
  Max, 
  IsOptional 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EventPlaceType } from '../entities/event-place.entity';
import { HotelRestaurantExclusive } from '../validators/hotel-restaurant-exclusive.validator';

export class CreateEventPlaceDto {
  @ApiProperty({ example: 'Tour Nocturno Hotel Colonial', description: 'Nombre del lugar o evento (máx 150 caracteres).' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(150, { message: 'El nombre no puede exceder 150 caracteres.' })
  name: string;

  @ApiProperty({ example: 'Experiencia única en hotel histórico con relatos de leyendas.', description: 'Descripción detallada del lugar o evento.' })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres.' })
  description: string;

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

  @ApiProperty({ enum: EventPlaceType, description: 'Tipo de lugar/evento (festival, ruta, evento, atractivo).' })
  @IsEnum(EventPlaceType, { message: 'El tipo proporcionado no es válido.' })
  type: EventPlaceType;

  @HotelRestaurantExclusive({ message: 'No puede asociar simultáneamente un hotel y un restaurante.' })
  @ApiProperty({ required: false, description: 'UUID del hotel asociado (opcional).' })
  @IsOptional()
  @IsUUID('4', { message: 'El hotelId debe ser un UUID válido.' })
  hotelId?: string;

  @ApiProperty({ required: false, description: 'UUID del restaurante asociado (opcional).' })
  @IsOptional()
  @IsUUID('4', { message: 'El restaurantId debe ser un UUID válido.' })
  restaurantId?: string;

  @ApiProperty({ description: 'UUID de la región asociada.' })
  @IsUUID('4', { message: 'El regionId debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'El regionId es obligatorio.' })
  regionId: string;

  @ApiProperty({ description: 'UUID de la leyenda asociada.' })
  @IsUUID('4', { message: 'El legendId debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'El legendId es obligatorio.' })
  legendId: string;
}