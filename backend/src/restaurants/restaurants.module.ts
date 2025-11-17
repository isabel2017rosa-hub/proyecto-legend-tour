// src/restaurants/restaurants.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsRepository } from './restaurants.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, RestaurantsRepository],
  exports: [RestaurantsService, RestaurantsRepository],
})
export class RestaurantsModule {}