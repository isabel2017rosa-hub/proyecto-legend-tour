import { PartialType } from '@nestjs/swagger';
import { CreateEventPlaceDto } from './create-event-place.dto';
import { HotelRestaurantExclusive } from '../validators/hotel-restaurant-exclusive.validator';

export class UpdateEventPlaceDto extends PartialType(CreateEventPlaceDto) {
  // Aplica validación de exclusión mutua también en actualizaciones
  @HotelRestaurantExclusive({ message: 'No puede asociar simultáneamente un hotel y un restaurante.' })
  hotelId?: string;

  @HotelRestaurantExclusive({ message: 'No puede asociar simultáneamente un hotel y un restaurante.' })
  restaurantId?: string;
}