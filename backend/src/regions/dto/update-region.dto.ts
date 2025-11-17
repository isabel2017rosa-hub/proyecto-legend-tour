// src/regions/dto/update-region.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateRegionDto } from './create-region.dto';

/** DTO para actualización parcial de Región. Hereda validaciones y mensajes en español del CreateRegionDto. */
export class UpdateRegionDto extends PartialType(CreateRegionDto) {}