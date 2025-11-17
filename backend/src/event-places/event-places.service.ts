// Servicio de dominio para gestionar lugares/eventos turísticos (EventPlace)
// Provee operaciones CRUD y encapsula el acceso al repositorio TypeORM.
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventPlace, EventPlaceType } from './entities/event-place.entity';
import { CreateEventPlaceDto } from './dto/create-event-place.dto';
import { UpdateEventPlaceDto } from './dto/update-event-place.dto';
import { EventPlacesRepository } from './event-places.repository';

@Injectable()
export class EventPlacesService {
  constructor(private readonly repo: EventPlacesRepository) {}

  // Delegar creación
  async create(dto: CreateEventPlaceDto): Promise<EventPlace> {
    return this.repo.createAndSave(dto);
  }

  // Delegar listado completo
  async findAll(): Promise<EventPlace[]> {
    return this.repo.findAll();
  }

  // Delegar búsqueda por ID
  async findOne(id: string): Promise<EventPlace> {
    return this.repo.findByIdOrThrow(id);
  }

  // Delegar actualización parcial
  async update(id: string, dto: UpdateEventPlaceDto): Promise<EventPlace> {
    return this.repo.updatePartial(id, dto);
  }

  // Delegar eliminación
  async remove(id: string): Promise<void> {
    await this.repo.removeById(id);
  }

  // Nuevos métodos de consulta
  async findByType(type: EventPlaceType): Promise<EventPlace[]> {
    return this.repo.findByType(type);
  }

  async findByRegion(regionId: string): Promise<EventPlace[]> {
    return this.repo.findByRegion(regionId);
  }

  async findNearby(lat: number, lon: number, radiusKm: number): Promise<EventPlace[]> {
    return this.repo.findNearby(lat, lon, radiusKm);
  }
}