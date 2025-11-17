import { IsString, IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMythStoryDto {
  @ApiProperty({ example: 'La Serpiente Dorada', description: 'Título de la historia (máx 150 caracteres).' })
  @IsString({ message: 'El título debe ser texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres.' })
  @MaxLength(150, { message: 'El título no puede exceder 150 caracteres.' })
  title: string;

  @ApiProperty({ example: 'Cuenta la historia que...', description: 'Contenido de la historia (mínimo 20 caracteres).' })
  @IsString({ message: 'El contenido debe ser texto.' })
  @IsNotEmpty({ message: 'El contenido es obligatorio.' })
  @MinLength(20, { message: 'El contenido debe tener al menos 20 caracteres.' })
  content: string;

  @ApiProperty({ example: 'story-serpent.jpg', description: 'Nombre de archivo o URL de la imagen (máx 255 caracteres).' })
  @IsString({ message: 'La imagen debe ser texto.' })
  @IsNotEmpty({ message: 'La imagen es obligatoria.' })
  @MaxLength(255, { message: 'La imagen no puede exceder 255 caracteres.' })
  imageUrl: string;

  @ApiProperty({ example: 'uuid-de-la-region', description: 'UUID v4 de la región asociada.' })
  @IsUUID('4', { message: 'regionId debe ser un UUID v4 válido.' })
  @IsNotEmpty({ message: 'regionId es obligatorio.' })
  regionId: string;
}