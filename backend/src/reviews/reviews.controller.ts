// src/reviews/reviews.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Post()
  @ApiOperation({ summary: 'Crear una reseña (admin y usuarios normales)' })
  @ApiCreatedResponse({ description: 'Reseña creada exitosamente' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  create(@Body() createReviewDto: CreateReviewDto, @GetUser() user: any) {
    return this.reviewsService.create(createReviewDto, user.id);
  }
  @Get()
  @ApiOperation({ summary: 'Listar todas las reseñas (admin y usuarios normales)' })
  @ApiOkResponse({ description: 'Lista de reseñas' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  findAll() {
    return this.reviewsService.findAll();
  }
  @Get('my-reviews')
  @ApiOperation({ summary: 'Obtener mis reseñas (admin y usuarios normales)' })
  @ApiOkResponse({ description: 'Reseñas del usuario autenticado' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  findMyReviews(@GetUser() user: any) {
    return this.reviewsService.findByUser(user.id);
  }

  @Get('by-entity')
  @ApiOperation({ summary: 'Obtener reseñas por entidad' })
  @ApiResponse({ status: 200, description: 'Reseñas de la entidad' })
  findByEntity(
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
  ) {
    return this.reviewsService.findByEntity(entityType, entityId);
  }

  @Get('average-rating')
  @ApiOperation({ summary: 'Obtener calificación promedio' })
  @ApiResponse({ status: 200, description: 'Rating promedio' })
  getAverageRating(
    @Query('entityType') entityType: string,
    @Query('entityId') entityId: string,
  ) {
    return this.reviewsService.getAverageRating(entityType, entityId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener reseña por ID' })
  @ApiResponse({ status: 200, description: 'Reseña encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar reseña propia' })
  @ApiResponse({ status: 200, description: 'Reseña actualizada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @GetUser() user: any,
  ) {
    return this.reviewsService.update(id, updateReviewDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar reseña' })
  @ApiResponse({ status: 200, description: 'Reseña eliminada' })
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: any) {
    return this.reviewsService.remove(id, user.id, user.isAdmin);
  }
}