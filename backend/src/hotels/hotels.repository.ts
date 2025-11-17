// ============ src/hotels/hotels.repository.ts ============
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

/**
 * Repositorio de acceso a datos para Hotel.
 * Encapsula operaciones CRUD usando TypeORM Repository<Hotel>.
 */
@Injectable()
export class HotelsRepository {
  constructor(
    @InjectRepository(Hotel)
    private readonly repo: Repository<Hotel>,
  ) {}

  /** Crea y persiste un hotel */
  async createAndSave(dto: CreateHotelDto): Promise<Hotel> {
    const entity = this.repo.create({ ...dto } as Partial<Hotel>);
    return this.repo.save(entity);
  }

  /** Lista todos los hoteles (opcionalmente con relaciones) */
  async findAll(withRelations = false): Promise<Hotel[]> {
    return this.repo.find({ relations: withRelations ? ['eventPlaces'] : [] });
  }

  /** Busca un hotel por ID (con o sin relaciones). Retorna null si no existe */
  async findById(id: string, withRelations = true): Promise<Hotel | null> {
    return this.repo.findOne({ where: { id_hotel: id }, relations: withRelations ? ['eventPlaces'] : [] });
  }

  /** Busca un hotel por ID o lanza NotFoundException */
  async findByIdOrThrow(id: string, withRelations = true): Promise<Hotel> {
    const hotel = await this.findById(id, withRelations);
    if (!hotel) throw new NotFoundException(`Hotel con ID ${id} no encontrado`);
    return hotel;
  }

  /** Actualiza parcialmente un hotel por ID */
  async updatePartial(id: string, dto: UpdateHotelDto): Promise<Hotel> {
    const hotel = await this.findByIdOrThrow(id);

    if (dto.name !== undefined) hotel.name = dto.name;
    if (dto.address !== undefined) hotel.address = dto.address;
    if (dto.latitude !== undefined) hotel.latitude = dto.latitude;
    if (dto.longitude !== undefined) hotel.longitude = dto.longitude;
    if (dto.rating !== undefined) hotel.rating = dto.rating;
    if (dto.website !== undefined) hotel.website = dto.website;
    if (dto.phone !== undefined) hotel.phone = dto.phone;

    return this.repo.save(hotel);
  }

  /** Elimina un hotel por ID (si no existe, lanza NotFound) */
  async removeById(id: string): Promise<void> {
    const hotel = await this.findByIdOrThrow(id);
    await this.repo.remove(hotel);
  }

  /** Consulta hoteles por calificación mínima, ordenados desc */
  async findByRating(minRating: number): Promise<Hotel[]> {
    return this.repo
      .createQueryBuilder('hotel')
      .where('hotel.rating >= :minRating', { minRating })
      .orderBy('hotel.rating', 'DESC')
      .getMany();
  }
}