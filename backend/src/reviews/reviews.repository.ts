// src/reviews/reviews.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review, ReviewEntityType } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

const RELATIONS = ['user'] as const;

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectRepository(Review)
    private readonly repo: Repository<Review>,
  ) {}

  /** Crear reseña y guardar asociando usuario */
  async createAndSave(dto: CreateReviewDto, userId: string): Promise<Review> {
    const entity = this.repo.create({ ...dto, user: { id_usuario: userId } as any });
    return this.repo.save(entity);
  }

  /** Listar todas (incluye usuario) */
  async findAll(): Promise<Review[]> {
    return this.repo.find({ relations: RELATIONS as unknown as string[], order: { createdAt: 'DESC' } });
  }

  /** Buscar por ID (incluye usuario) */
  async findById(id: string): Promise<Review | null> {
    return this.repo.findOne({ where: { id_review: id }, relations: RELATIONS as unknown as string[] });
  }

  async findByIdOrThrow(id: string): Promise<Review> {
    const review = await this.findById(id);
    if (!review) throw new NotFoundException(`Reseña con ID ${id} no encontrada`);
    return review;
  }

  /** Listar por entidad */
  async findByEntity(entityType: ReviewEntityType | string, entityId: string): Promise<Review[]> {
    return this.repo.find({
      where: { entityType: entityType as any, entityId },
      relations: RELATIONS as unknown as string[],
      order: { createdAt: 'DESC' },
    });
  }

  /** Listar por usuario */
  async findByUser(userId: string): Promise<Review[]> {
    return this.repo.find({
      where: { user: { id_usuario: userId } },
      relations: RELATIONS as unknown as string[],
      order: { createdAt: 'DESC' },
    });
  }

  /** Guardar cambios */
  async save(review: Review): Promise<Review> {
    return this.repo.save(review);
  }

  /** Eliminar por entidad */
  async remove(review: Review): Promise<void> {
    await this.repo.remove(review);
  }

  /** Eliminar por ID */
  async removeById(id: string): Promise<void> {
    const review = await this.findByIdOrThrow(id);
    await this.repo.remove(review);
  }

  /** Calcular promedio por entidad */
  async getAverageRating(entityType: ReviewEntityType | string, entityId: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where('review.entityType = :entityType', { entityType })
      .andWhere('review.entityId = :entityId', { entityId })
      .getRawOne();

    return result?.average ? parseFloat(result.average) : 0;
  }
}
