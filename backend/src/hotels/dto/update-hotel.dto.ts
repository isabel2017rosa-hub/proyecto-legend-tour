// ============ src/hotels/dto/update-hotel.dto.ts ============
import { PartialType } from '@nestjs/swagger';
import { CreateHotelDto } from './create-hotel.dto';

// DTO para actualización parcial de Hotel: todos los campos son opcionales
export class UpdateHotelDto extends PartialType(CreateHotelDto) {}