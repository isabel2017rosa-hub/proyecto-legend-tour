// ============ src/legends/legends.repository.ts ============
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Legend } from './entities/legend.entity';
import { CreateLegendDto } from './dto/create-legend.dto';
import { UpdateLegendDto } from './dto/update-legend.dto';

/**
 * Repositorio de acceso a datos para Legend.
 * Encapsula operaciones CRUD usando TypeORM Repository<Legend>.
 */
@Injectable()
export class LegendsRepository {
  constructor(
    @InjectRepository(Legend)
    private readonly repo: Repository<Legend>,
  ) {}

  /** Crea y persiste una leyenda */
  async createAndSave(dto: CreateLegendDto): Promise<Legend> {
    const entity = this.repo.create({ ...dto } as Partial<Legend>);
    return this.repo.save(entity);
  }

  /** Lista todas las leyendas incluyendo relaciones principales */
  async findAll(): Promise<Legend[]> {
    return this.repo.find({ relations: ['regions', 'eventPlaces'] });
  }

  /** Busca una leyenda por ID. Retorna null si no existe */
  async findById(id: string): Promise<Legend | null> {
    return this.repo.findOne({ where: { id_legend: id }, relations: ['regions', 'eventPlaces'] });
  }

  /** Busca una leyenda por ID o lanza NotFoundException */
  async findByIdOrThrow(id: string): Promise<Legend> {
    const legend = await this.findById(id);
    if (!legend) throw new NotFoundException(`Leyenda con ID ${id} no encontrada`);
    return legend;
  }

  /** Actualiza parcialmente una leyenda por ID */
  async updatePartial(id: string, dto: UpdateLegendDto): Promise<Legend> {
    const legend = await this.findByIdOrThrow(id);
    Object.assign(legend, dto);
    return this.repo.save(legend);
  }

  /** Elimina una leyenda por ID (si no existe, lanza NotFound) */
  async removeById(id: string): Promise<void> {
    const legend = await this.findByIdOrThrow(id);
    await this.repo.remove(legend);
  }
}
