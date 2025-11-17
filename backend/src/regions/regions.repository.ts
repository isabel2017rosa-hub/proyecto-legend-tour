// src/regions/regions.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Region } from './entities/region.entity';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';

const RELATIONS = ['legend', 'eventPlaces'] as const;

type PageOpts = { skip?: number; take?: number };

@Injectable()
export class RegionsRepository {
  constructor(
    @InjectRepository(Region)
    private readonly repo: Repository<Region>,
  ) {}

  /** Crear y guardar región, mapeando legendId si viene */
  async createAndSave(dto: CreateRegionDto): Promise<Region> {
    const entity: Partial<Region> = {
      name: dto.name,
      description: dto.description,
      latitude: dto.latitude,
      longitude: dto.longitude,
    };
    if (dto.legendId) (entity as any).legend = { id_legend: dto.legendId } as any;
    const region = this.repo.create(entity);
    return this.repo.save(region);
  }

  /** Listar todas las regiones con relaciones y orden por nombre */
  async findAll(opts?: PageOpts): Promise<Region[]> {
    return this.repo.find({
      relations: RELATIONS as unknown as string[],
      order: { name: 'ASC' },
      skip: opts?.skip,
      take: opts?.take,
    });
  }

  /** Buscar por ID con relaciones */
  async findById(id: string): Promise<Region | null> {
    return this.repo.findOne({ where: { id_region: id }, relations: RELATIONS as unknown as string[] });
  }

  async findByIdOrThrow(id: string): Promise<Region> {
    const region = await this.findById(id);
    if (!region) throw new NotFoundException(`Región con ID ${id} no encontrada`);
    return region;
  }

  /** Búsqueda por proximidad geográfica (Haversine) */
  async findNearby(lat: number, lng: number, radiusKm: number, opts?: PageOpts): Promise<Region[]> {
    const clamped = Math.max(1, Math.min(radiusKm ?? 50, 500));
    const qb = this.repo
      .createQueryBuilder('region')
      .leftJoinAndSelect('region.legend', 'legend')
      .leftJoinAndSelect('region.eventPlaces', 'eventPlaces')
      .addSelect(
        `6371 * acos(cos(radians(:lat)) * cos(radians(region.latitude)) * 
        cos(radians(region.longitude) - radians(:lng)) + 
        sin(radians(:lat)) * sin(radians(region.latitude)))`,
        'distance',
      )
      .where('6371 * acos(cos(radians(:lat)) * cos(radians(region.latitude)) * cos(radians(region.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(region.latitude))) <= :radius', {
        lat,
        lng,
        radius: clamped,
      })
      .orderBy('distance', 'ASC');

    if (opts?.skip !== undefined) qb.skip(opts.skip);
    if (opts?.take !== undefined) qb.take(opts.take);

    return qb.getMany();
  }

  /** Búsqueda por nombre (case-insensitive) */
  async searchByName(term: string, opts?: PageOpts): Promise<Region[]> {
    return this.repo.find({
      where: { name: ILike(`%${term}%`) },
      relations: RELATIONS as unknown as string[],
      order: { name: 'ASC' },
      skip: opts?.skip,
      take: opts?.take,
    });
  }

  /** Listar por leyenda asociada */
  async findByLegend(legendId: string, opts?: PageOpts): Promise<Region[]> {
    return this.repo.find({
      where: { legend: { id_legend: legendId } as any },
      relations: RELATIONS as unknown as string[],
      order: { name: 'ASC' },
      skip: opts?.skip,
      take: opts?.take,
    });
  }

  /** Actualizar parcialmente región, mapeando legendId si viene */
  async updatePartial(id: string, dto: UpdateRegionDto): Promise<Region> {
    const region = await this.findByIdOrThrow(id);
    const { legendId, ...rest } = dto as any;
    Object.assign(region, rest);
    if (legendId !== undefined) {
      (region as any).legend = legendId ? ({ id_legend: legendId } as any) : (null as any);
    }
    return this.repo.save(region);
  }

  /** Eliminar por ID */
  async removeById(id: string): Promise<void> {
    const region = await this.findByIdOrThrow(id);
    await this.repo.remove(region);
  }
}
