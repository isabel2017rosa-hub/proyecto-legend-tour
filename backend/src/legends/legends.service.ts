import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Legend } from './entities/legend.entity';
import { CreateLegendDto } from './dto/create-legend.dto';
import { UpdateLegendDto } from './dto/update-legend.dto';

@Injectable()
export class LegendsService {
  constructor(
    @InjectRepository(Legend)
    private readonly repo: Repository<Legend>,
  ) {}

  async create(dto: CreateLegendDto): Promise<Legend> {
    const entity = this.repo.create({ ...dto } as Partial<Legend>);
    return this.repo.save(entity);
  }

  async findAll(): Promise<Legend[]> {
    return this.repo.find({ relations: ['regions', 'eventPlaces'] });
  }

  async findOne(id: string): Promise<Legend> {
    const legend = await this.repo.findOne({ where: { id_legend: id }, relations: ['regions', 'eventPlaces'] });
    if (!legend) throw new NotFoundException('Leyenda no encontrada');
    return legend;
  }

  async update(id: string, dto: UpdateLegendDto): Promise<Legend> {
    const legend = await this.findOne(id);
    Object.assign(legend, dto);
    return this.repo.save(legend);
  }

  async remove(id: string): Promise<void> {
    const legend = await this.findOne(id);
    await this.repo.remove(legend);
  }
}