// src/restaurants/restaurants.service.ts
import { Injectable } from '@nestjs/common';
import { RestaurantsRepository } from './restaurants.repository';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

type PageOpts = { skip?: number; take?: number };

@Injectable()
export class RestaurantsService {
  constructor(private readonly repository: RestaurantsRepository) {}

  private normalizePage(opts?: { skip?: any; take?: any }): PageOpts | undefined {
    if (!opts) return undefined;
    const skip = opts.skip !== undefined ? Number(opts.skip) : undefined;
    const take = opts.take !== undefined ? Number(opts.take) : undefined;
    const norm: PageOpts = {};
    if (!Number.isNaN(skip!) && skip! >= 0) norm.skip = Math.floor(skip!);
    if (!Number.isNaN(take!) && take! > 0) norm.take = Math.min(Math.floor(take!), 100);
    return norm;
  }

  create(dto: CreateRestaurantDto): Promise<Restaurant> {
    return this.repository.createAndSave(dto);
  }

  findAll(opts?: { skip?: any; take?: any }): Promise<Restaurant[]> {
    return this.repository.findAll(this.normalizePage(opts));
  }

  findOne(id: string): Promise<Restaurant> {
    return this.repository.findByIdOrThrow(id);
  }

  findNearby(lat: number, lng: number, radius: number, opts?: { skip?: any; take?: any }): Promise<Restaurant[]> {
    return this.repository.findNearby(lat, lng, radius, this.normalizePage(opts));
  }

  searchByName(term: string, opts?: { skip?: any; take?: any }): Promise<Restaurant[]> {
    return this.repository.searchByName(term, this.normalizePage(opts));
  }

  findByCategory(category: string, opts?: { skip?: any; take?: any }): Promise<Restaurant[]> {
    return this.repository.findByCategory(category, this.normalizePage(opts));
  }

  findByMinRating(min: number, opts?: { skip?: any; take?: any }): Promise<Restaurant[]> {
    return this.repository.findByMinRating(min, this.normalizePage(opts));
  }

  update(id: string, dto: UpdateRestaurantDto): Promise<Restaurant> {
    return this.repository.updatePartial(id, dto);
  }

  remove(id: string): Promise<void> {
    return this.repository.removeById(id);
  }
}
