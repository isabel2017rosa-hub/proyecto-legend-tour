// src/reviews/reviews.service.ts
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { Review, ReviewEntityType } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(private readonly repository: ReviewsRepository) {}

  async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
    return this.repository.createAndSave(createReviewDto, userId);
  }

  async findAll(): Promise<Review[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<Review> {
    return this.repository.findByIdOrThrow(id);
  }

  async findByEntity(entityType: ReviewEntityType | string, entityId: string): Promise<Review[]> {
    return this.repository.findByEntity(entityType, entityId);
  }

  async findByUser(userId: string): Promise<Review[]> {
    return this.repository.findByUser(userId);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId: string): Promise<Review> {
    const review = await this.findOne(id);
    if (review.user.id_usuario !== userId) {
      throw new ForbiddenException('No puedes editar esta reseña');
    }
    Object.assign(review, updateReviewDto);
    return this.repository.save(review);
  }

  async remove(id: string, userId: string, isAdmin: boolean): Promise<void> {
    const review = await this.findOne(id);
    if (!isAdmin && review.user.id_usuario !== userId) {
      throw new ForbiddenException('No puedes eliminar esta reseña');
    }
    await this.repository.remove(review);
  }

  async getAverageRating(entityType: string, entityId: string): Promise<number> {
    if (!Object.values(ReviewEntityType).includes(entityType as ReviewEntityType)) {
      throw new BadRequestException('Tipo de entidad inválido.');
    }
    return this.repository.getAverageRating(entityType, entityId);
  }
}