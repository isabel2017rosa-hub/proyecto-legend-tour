// ============================================
// MÓDULO: LEGENDS
// ============================================

// src/legends/dto/create-legend.dto.ts
import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLegendDto {
  @ApiProperty({ example: 'Serpiente Dorada', description: 'Nombre de la leyenda (máx 150 caracteres).' })
  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(150, { message: 'El nombre no puede exceder 150 caracteres.' })
  name: string;

  @ApiProperty({ example: 'Una serpiente mítica que protege tesoros ocultos.', description: 'Descripción detallada de la leyenda.' })
  @IsString({ message: 'La descripción debe ser texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres.' })
  description: string;

  @ApiProperty({ example: 'legend-serpent.jpg', required: false, description: 'Nombre de archivo o URL de la imagen (opcional, máx 255 caracteres).' })
  @IsOptional()
  @IsString({ message: 'La imagen debe ser texto.' })
  @MaxLength(255, { message: 'La imagen no puede exceder 255 caracteres.' })
  imageUrl?: string;
}