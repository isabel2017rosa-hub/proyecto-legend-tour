import { PartialType } from '@nestjs/swagger';
import { CreateMythStoryDto } from './create-myth-story.dto';

// DTO de actualización parcial: hereda validaciones y hace todos los campos opcionales
export class UpdateMythStoryDto extends PartialType(CreateMythStoryDto) {}
