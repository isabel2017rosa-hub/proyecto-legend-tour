// src/restaurants/restaurants.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

const RELATIONS = ['eventPlaces'] as const;

type PageOpts = { skip?: number; take?: number };

@Injectable()
export class RestaurantsRepository {
  constructor(
    @InjectRepository(Restaurant)
    private readonly repo: Repository<Restaurant>,
  ) {}

  async createAndSave(dto: CreateRestaurantDto): Promise<Restaurant> {
    const entity: Partial<Restaurant> = {
      name: dto.name,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      rating: dto.rating,
      category: dto.category,
      website: dto.website,
    };
    const restaurant = this.repo.create(entity);
    return this.repo.save(restaurant);
  }

  async findAll(opts?: PageOpts): Promise<Restaurant[]> {
    return this.repo.find({
      relations: RELATIONS as unknown as string[],
      order: { name: 'ASC' },
      skip: opts?.skip,
      take: opts?.take,
    });
  }

  async findById(id: string): Promise<Restaurant | null> {
    return this.repo.findOne({ where: { id_restaurant: id }, relations: RELATIONS as unknown as string[] });
  }

  async findByIdOrThrow(id: string): Promise<Restaurant> {
    const r = await this.findById(id);
    if (!r) throw new NotFoundException(`Restaurante con ID ${id} no encontrado`);
    return r;
  }

  async findNearby(lat: number, lng: number, radiusKm: number, opts?: PageOpts): Promise<Restaurant[]> {
    const clamped = Math.max(1, Math.min(radiusKm ?? 50, 500));
    const qb = this.repo
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.eventPlaces', 'eventPlaces')
      .addSelect(
        `6371 * acos(cos(radians(:lat)) * cos(radians(restaurant.latitude)) * 
        cos(radians(restaurant.longitude) - radians(:lng)) + 
        sin(radians(:lat)) * sin(radians(restaurant.latitude)))`,
        'distance',
      )
      .where('6371 * acos(cos(radians(:lat)) * cos(radians(restaurant.latitude)) * cos(radians(restaurant.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(restaurant.latitude))) <= :radius', {
        lat,
        lng,
        radius: clamped,
      })
      .orderBy('distance', 'ASC');

    if (opts?.skip !== undefined) qb.skip(opts.skip);
    if (opts?.take !== undefined) qb.take(opts.take);

    return qb.getMany();
  }

  async searchByName(term: string, opts?: PageOpts): Promise<Restaurant[]> {
    return this.repo.find({
      where: { name: ILike(`%${term}%`) },
      relations: RELATIONS as unknown as string[],
      order: { name: 'ASC' },
      skip: opts?.skip,
      take: opts?.take,
    });
  }

  async findByCategory(category: string, opts?: PageOpts): Promise<Restaurant[]> {
    return this.repo.find({
      where: { category: ILike(`%${category}%`) as any },
      relations: RELATIONS as unknown as string[],
      order: { name: 'ASC' },
      skip: opts?.skip,
      take: opts?.take,
    });
  }

  async findByMinRating(minRating: number, opts?: PageOpts): Promise<Restaurant[]> {
    const qb = this.repo
      .createQueryBuilder('restaurant')
      .leftJoinAndSelect('restaurant.eventPlaces', 'eventPlaces')
      .where('restaurant.rating IS NOT NULL AND restaurant.rating >= :min', { min: minRating })
      .orderBy('restaurant.rating', 'DESC')
      .addOrderBy('restaurant.name', 'ASC');

    if (opts?.skip !== undefined) qb.skip(opts.skip);
    if (opts?.take !== undefined) qb.take(opts.take);

    return qb.getMany();
  }

  async updatePartial(id: string, dto: UpdateRestaurantDto): Promise<Restaurant> {
    const r = await this.findByIdOrThrow(id);
    Object.assign(r, dto);
    return this.repo.save(r);
    }

  async removeById(id: string): Promise<void> {
    const r = await this.findByIdOrThrow(id);
    await this.repo.remove(r);
  }
}