// ============ src/myth-stories/myth-stories.repository.ts ============
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { MythStory } from './entities/myth-story.entity';
import { CreateMythStoryDto } from './dto/create-myth-story.dto';
import { UpdateMythStoryDto } from './dto/update-myth-story.dto';

/**
 * Repositorio especializado para MythStory.
 * Centraliza operaciones de persistencia y consultas frecuentes.
 */
@Injectable()
export class MythStoriesRepository {
  constructor(
    @InjectRepository(MythStory)
    private readonly repo: Repository<MythStory>,
  ) {}

  /** Crear y guardar historia mítica */
  async createAndSave(dto: CreateMythStoryDto, userId: string): Promise<MythStory> {
    const entity = this.repo.create({
      title: dto.title,
      content: dto.content,
      imageUrl: dto.imageUrl,
      region: { id_region: dto.regionId } as any,
      user: { id_usuario: userId } as any,
    });
    return this.repo.save(entity);
  }

  /** Listar todas las historias (con relaciones) */
  async findAll(): Promise<MythStory[]> {
    return this.repo.find({ relations: ['region', 'user'] });
  }

  /** Buscar por ID (retorna null si no existe) */
  async findById(id: string): Promise<MythStory | null> {
    return this.repo.findOne({ where: { id_mythStory: id }, relations: ['region', 'user'] });
  }

  /** Buscar por ID o lanzar excepción */
  async findByIdOrThrow(id: string): Promise<MythStory> {
    const story = await this.findById(id);
    if (!story) throw new NotFoundException('Historia no encontrada');
    return story;
  }

  /** Actualizar parcialmente historia */
  async updatePartial(id: string, dto: UpdateMythStoryDto): Promise<MythStory> {
    const story = await this.findByIdOrThrow(id);
    if (dto.title !== undefined) story.title = dto.title;
    if (dto.content !== undefined) story.content = dto.content;
    if (dto.imageUrl !== undefined) story.imageUrl = dto.imageUrl;
    if (dto.regionId !== undefined) story.region = { id_region: dto.regionId } as any;
    return this.repo.save(story);
  }

  /** Eliminar historia */
  async removeById(id: string): Promise<void> {
    const story = await this.findByIdOrThrow(id);
    await this.repo.remove(story);
  }

  /** Buscar historias por región */
  async findByRegion(regionId: string): Promise<MythStory[]> {
    return this.repo.find({ where: { region: { id_region: regionId } }, relations: ['region', 'user'] });
  }

  /** Búsqueda por título (LIKE case-insensitive) */
  async searchByTitle(term: string): Promise<MythStory[]> {
    return this.repo.find({ where: { title: ILike(`%${term}%`) }, relations: ['region', 'user'] });
  }
}
