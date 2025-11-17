// src/reviews/dto/create-review.dto.ts
import { IsString, IsNotEmpty, IsNumber, Min, Max, IsEnum, IsUUID, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReviewEntityType } from '../entities/review.entity';

export class CreateReviewDto {
  @ApiProperty({ example: 4, description: 'Calificación entera de 0 a 5.' })
  @IsNumber({}, { message: 'La calificación debe ser un número.' })
  @IsInt({ message: 'La calificación debe ser un número entero.' })
  @Min(0, { message: 'La calificación mínima es 0.' })
  @Max(5, { message: 'La calificación máxima es 5.' })
  rating: number;

  @ApiProperty({ example: 'Excelente servicio y ubicación', description: 'Comentario de la reseña.' })
  @IsString({ message: 'El comentario debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El comentario es obligatorio.' })
  comment: string;

  @ApiProperty({ enum: ReviewEntityType, example: ReviewEntityType.HOTEL, description: 'Tipo de entidad reseñada.' })
  @IsEnum(ReviewEntityType, { message: 'El tipo de entidad es inválido.' })
  entityType: ReviewEntityType;

  @ApiProperty({ example: 'uuid-del-hotel-o-restaurant', description: 'UUID v4 de la entidad reseñada.' })
  @IsUUID('4', { message: 'El id de la entidad debe ser un UUID v4 válido.' })
  entityId: string;
}