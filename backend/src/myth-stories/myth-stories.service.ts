import { Injectable, NotFoundException } from '@nestjs/common';
import { MythStory } from './entities/myth-story.entity';
import { CreateMythStoryDto } from './dto/create-myth-story.dto';
import { UpdateMythStoryDto } from './dto/update-myth-story.dto';
import { MythStoriesRepository } from './myth-stories.repository';

@Injectable()
export class MythStoriesService {
  constructor(private readonly repository: MythStoriesRepository) {}

  /** Crear historia mítica */
  async create(dto: CreateMythStoryDto, userId: string): Promise<MythStory> {
    return this.repository.createAndSave(dto, userId);
  }

  /** Listar historias (incluye región y usuario) */
  async findAll(): Promise<MythStory[]> {
    return this.repository.findAll();
  }

  /** Buscar por ID (lanza si no existe) */
  async findOne(id: string): Promise<MythStory> {
    return this.repository.findByIdOrThrow(id);
  }

  /** Actualizar parcialmente */
  async update(id: string, dto: UpdateMythStoryDto): Promise<MythStory> {
    return this.repository.updatePartial(id, dto);
  }

  /** Eliminar */
  async remove(id: string): Promise<void> {
    return this.repository.removeById(id);
  }
}