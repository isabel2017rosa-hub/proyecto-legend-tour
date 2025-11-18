// src/restaurants/restaurants.controller.ts
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
  ParseFloatPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiOkResponse, ApiCreatedResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Restaurant } from './entities/restaurant.entity';

@ApiTags('Restaurants')
@Controller('restaurants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}
  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Crear restaurante (solo los administradores)' })
  @ApiCreatedResponse({ description: 'Restaurante creado correctamente.', type: Restaurant })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  @ApiForbiddenResponse({ description: 'Acceso denegado: Solo los administradores pueden crear restaurantes.' })
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(dto);
  }
  @Get()
  @ApiOperation({ summary: 'Listar restaurantes (admin y usuarios normales)' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiOkResponse({ description: 'Listado de restaurantes.', type: [Restaurant] })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  findAll(@Query('skip', ParseIntPipe) skip?: number, @Query('take', ParseIntPipe) take?: number) {
    return this.restaurantsService.findAll({ skip, take });
  }

  @Get('search/by-name')
  @ApiOperation({ summary: 'Buscar restaurantes por nombre' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiOkResponse({ description: 'Resultados de la búsqueda por nombre.', type: [Restaurant] })
  searchByName(
    @Query('q') q: string,
    @Query('skip', ParseIntPipe) skip?: number,
    @Query('take', ParseIntPipe) take?: number,
  ) {
    return this.restaurantsService.searchByName(q, { skip, take });
  }

  @Get('by-category')
  @ApiOperation({ summary: 'Listar restaurantes por categoría' })
  @ApiQuery({ name: 'category', required: true, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiOkResponse({ description: 'Restaurantes filtrados por categoría.', type: [Restaurant] })
  findByCategory(
    @Query('category') category: string,
    @Query('skip', ParseIntPipe) skip?: number,
    @Query('take', ParseIntPipe) take?: number,
  ) {
    return this.restaurantsService.findByCategory(category, { skip, take });
  }

  @Get('min-rating/:min')
  @ApiOperation({ summary: 'Listar restaurantes con calificación mínima' })
  @ApiOkResponse({ description: 'Restaurantes con calificación mayor o igual al mínimo.', type: [Restaurant] })
  findByMinRating(@Param('min', ParseIntPipe) min: number, @Query('skip', ParseIntPipe) skip?: number, @Query('take', ParseIntPipe) take?: number) {
    return this.restaurantsService.findByMinRating(min, { skip, take });
  }
  @Get(':id')
  @ApiOperation({ summary: 'Obtener restaurante por ID (admin y usuarios normales)' })
  @ApiOkResponse({ description: 'Restaurante encontrado.', type: Restaurant })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findOne(id);
  }
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar restaurante (solo admin)' })
  @ApiOkResponse({ description: 'Restaurante actualizado.', type: Restaurant })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  @ApiForbiddenResponse({ description: 'Acceso denegado. Solo administradores pueden actualizar restaurantes.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRestaurantDto) {
    return this.restaurantsService.update(id, dto);
  }
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar restaurante (solo admin)' })
  @ApiResponse({ status: 200, description: 'Restaurante eliminado.' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  @ApiForbiddenResponse({ description: 'Acceso denegado. Solo administradores pueden eliminar restaurantes.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.remove(id);
  }
}