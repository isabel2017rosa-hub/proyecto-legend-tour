// ============ src/event-places/event-places.repository.ts ============
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventPlace, EventPlaceType } from './entities/event-place.entity';
import { CreateEventPlaceDto } from './dto/create-event-place.dto';
import { UpdateEventPlaceDto } from './dto/update-event-place.dto';

/**
 * Repositorio especializado para EventPlace.
 * Encapsula reglas: exclusión mutua hotel/restaurante, mapeo de relaciones por ID
 * y consultas frecuentes por tipo, región y proximidad.
 */
@Injectable()
export class EventPlacesRepository {
  constructor(
    @InjectRepository(EventPlace)
    private readonly repo: Repository<EventPlace>,
  ) {}

  /** Crea y persiste un lugar/evento aplicando reglas de negocio */
  async createAndSave(dto: CreateEventPlaceDto): Promise<EventPlace> {
    if (dto.hotelId && dto.restaurantId) {
      throw new BadRequestException('No puede asociar simultáneamente un hotel y un restaurante.');
    }

    const entity = this.repo.create({
      name: dto.name,
      description: dto.description,
      latitude: dto.latitude,
      longitude: dto.longitude,
      type: dto.type,
      region: { id_region: dto.regionId } as any,
      legend: { id_legend: dto.legendId } as any,
      hotel: dto.hotelId ? ({ id_hotel: dto.hotelId } as any) : undefined,
      restaurant: dto.restaurantId ? ({ id_restaurant: dto.restaurantId } as any) : undefined,
    });
    return this.repo.save(entity);
  }

  /** Lista todos los lugares (opcional incluir relaciones) */
  async findAll(withRelations = true): Promise<EventPlace[]> {
    return this.repo.find({ relations: withRelations ? ['region', 'legend', 'hotel', 'restaurant'] : [] });
  }

  /** Busca por ID (retorna null si no existe) */
  async findById(id: string, withRelations = true): Promise<EventPlace | null> {
    return this.repo.findOne({ where: { id_eventPlace: id }, relations: withRelations ? ['region', 'legend', 'hotel', 'restaurant'] : [] });
  }

  /** Busca por ID o lanza NotFound */
  async findByIdOrThrow(id: string, withRelations = true): Promise<EventPlace> {
    const place = await this.findById(id, withRelations);
    if (!place) throw new NotFoundException('Lugar/evento no encontrado');
    return place;
  }

  /** Actualiza parcialmente un lugar/evento */
  async updatePartial(id: string, dto: UpdateEventPlaceDto): Promise<EventPlace> {
    const place = await this.findByIdOrThrow(id);

    if (dto.hotelId && dto.restaurantId) {
      throw new BadRequestException('No puede asociar simultáneamente un hotel y un restaurante.');
    }

    if (dto.name !== undefined) place.name = dto.name;
    if (dto.description !== undefined) place.description = dto.description;
    if (dto.latitude !== undefined) place.latitude = dto.latitude;
    if (dto.longitude !== undefined) place.longitude = dto.longitude;
    if (dto.type !== undefined) place.type = dto.type;

    if (dto.regionId !== undefined) place.region = { id_region: dto.regionId } as any;
    if (dto.legendId !== undefined) place.legend = { id_legend: dto.legendId } as any;
    if (dto.hotelId !== undefined) place.hotel = dto.hotelId ? ({ id_hotel: dto.hotelId } as any) : undefined;
    if (dto.restaurantId !== undefined) place.restaurant = dto.restaurantId ? ({ id_restaurant: dto.restaurantId } as any) : undefined;

    return this.repo.save(place);
  }

  /** Elimina por ID (lanza si no existe) */
  async removeById(id: string): Promise<void> {
    const place = await this.findByIdOrThrow(id, false);
    await this.repo.remove(place);
  }

  /** Busca lugares por tipo */
  async findByType(type: EventPlaceType): Promise<EventPlace[]> {
    return this.repo.find({ where: { type }, relations: ['region', 'legend'] });
  }

  /** Busca lugares por región */
  async findByRegion(regionId: string): Promise<EventPlace[]> {
    return this.repo.find({ where: { region: { id_region: regionId } }, relations: ['region', 'legend'] });
  }

  /**
   * Busca lugares cercanos (aprox) usando cálculo Haversine sobre coordenadas.
   * Nota: Para alto rendimiento se recomienda extensión PostGIS; esto es cálculo en memoria.
   */
  async findNearby(lat: number, lon: number, radiusKm: number): Promise<EventPlace[]> {
    const all = await this.findAll(false);
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371; // radio Tierra km
    return all.filter(p => {
      const dLat = toRad(p.latitude - lat);
      const dLon = toRad(p.longitude - lon);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(p.latitude)) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = R * c;
      return dist <= radiusKm;
    });
  }
}
