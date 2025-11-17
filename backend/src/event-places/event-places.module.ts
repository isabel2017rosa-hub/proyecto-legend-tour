// src/event-places/event-places.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventPlacesService } from './event-places.service';
import { EventPlacesController } from './event-places.controller';
import { EventPlace } from './entities/event-place.entity';
import { EventPlacesRepository } from './event-places.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EventPlace])],
  controllers: [EventPlacesController],
  providers: [EventPlacesService, EventPlacesRepository],
  exports: [EventPlacesService, EventPlacesRepository],
})
export class EventPlacesModule {}