// src/regions/regions.service.ts
import { Injectable } from '@nestjs/common';
import { Region } from './entities/region.entity';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { RegionsRepository } from './regions.repository';

type PageOpts = { skip?: number; take?: number };

@Injectable()
export class RegionsService {
  constructor(private readonly repository: RegionsRepository) {}

  private normalizePage(opts?: { skip?: any; take?: any }): PageOpts | undefined {
    if (!opts) return undefined;
    const skip = opts.skip !== undefined ? Number(opts.skip) : undefined;
    const take = opts.take !== undefined ? Number(opts.take) : undefined;
    const norm: PageOpts = {};
    if (!Number.isNaN(skip!) && skip! >= 0) norm.skip = Math.floor(skip!);
    if (!Number.isNaN(take!) && take! > 0) norm.take = Math.min(Math.floor(take!), 100);
    return norm;
  }

  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    return this.repository.createAndSave(createRegionDto);
  }

  async findAll(opts?: { skip?: any; take?: any }): Promise<Region[]> {
    return this.repository.findAll(this.normalizePage(opts));
  }

  async findOne(id: string): Promise<Region> {
    return this.repository.findByIdOrThrow(id);
  }

  async findByCoordinates(lat: number, lng: number, radius: number, opts?: { skip?: any; take?: any }): Promise<Region[]> {
    return this.repository.findNearby(lat, lng, radius, this.normalizePage(opts));
  }

  async searchByName(term: string, opts?: { skip?: any; take?: any }): Promise<Region[]> {
    return this.repository.searchByName(term, this.normalizePage(opts));
  }

  async findByLegend(legendId: string, opts?: { skip?: any; take?: any }): Promise<Region[]> {
    return this.repository.findByLegend(legendId, this.normalizePage(opts));
  }

  async update(id: string, updateRegionDto: UpdateRegionDto): Promise<Region> {
    return this.repository.updatePartial(id, updateRegionDto);
  }

  async remove(id: string): Promise<void> {
    return this.repository.removeById(id);
  }
}