import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Injectable()
export class HotelsService {
  constructor(
    @InjectRepository(Hotel)
    private readonly repo: Repository<Hotel>,
  ) {}

  /**
   * Crea un nuevo hotel a partir del DTO de creación.
   */
  async create(dto: CreateHotelDto): Promise<Hotel> {
    const entity = this.repo.create({ ...dto } as Partial<Hotel>);
    return this.repo.save(entity);
  }

  /**
   * Lista todos los hoteles incluyendo sus lugares/eventos asociados.
   */
  async findAll(): Promise<Hotel[]> {
    return this.repo.find({ relations: ['eventPlaces'] });
  }

  /**
   * Obtiene un hotel por su UUID. Incluye lugares/eventos asociados.
   * Lanza NotFoundException cuando no existe.
   */
  async findOne(id: string): Promise<Hotel> {
    const hotel = await this.repo.findOne({ where: { id_hotel: id }, relations: ['eventPlaces'] });
    if (!hotel) throw new NotFoundException(`Hotel con ID ${id} no encontrado`);
    return hotel;
  }

  /**
   * Actualiza parcialmente un hotel. Solo modifica los campos presentes en el DTO.
   */
  async update(id: string, dto: UpdateHotelDto): Promise<Hotel> {
    const hotel = await this.findOne(id);

    if (dto.name !== undefined) hotel.name = dto.name;
    if (dto.address !== undefined) hotel.address = dto.address;
    if (dto.latitude !== undefined) hotel.latitude = dto.latitude;
    if (dto.longitude !== undefined) hotel.longitude = dto.longitude;
    if (dto.rating !== undefined) hotel.rating = dto.rating;
    if (dto.website !== undefined) hotel.website = dto.website;
    if (dto.phone !== undefined) hotel.phone = dto.phone;

    return this.repo.save(hotel);
  }

  /**
   * Elimina un hotel por su UUID (verifica existencia previa).
   */
  async remove(id: string): Promise<void> {
    const hotel = await this.findOne(id);
    await this.repo.remove(hotel);
  }

  /**
   * Busca hoteles con calificación mayor o igual a minRating.
   * Retorna ordenados de mayor a menor calificación.
   */
  async findByRating(minRating: number): Promise<Hotel[]> {
    return this.repo
      .createQueryBuilder('hotel')
      .where('hotel.rating >= :minRating', { minRating })
      .orderBy('hotel.rating', 'DESC')
      .getMany();
  }
}