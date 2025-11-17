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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Crear restaurante (solo admin)' })
  @ApiCreatedResponse({ description: 'Restaurante creado correctamente.', type: Restaurant })
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar restaurantes' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiOkResponse({ description: 'Listado de restaurantes.', type: [Restaurant] })
  findAll(@Query('skip', ParseIntPipe) skip?: number, @Query('take', ParseIntPipe) take?: number) {
    return this.restaurantsService.findAll({ skip, take });
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Buscar restaurantes cercanos' })
  @ApiQuery({ name: 'lat', required: true, type: Number })
  @ApiQuery({ name: 'lng', required: true, type: Number })
  @ApiQuery({ name: 'radius', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiOkResponse({ description: 'Restaurantes cercanos ordenados por distancia.', type: [Restaurant] })
  findNearby(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radius', ParseFloatPipe) radius = 50,
    @Query('skip', ParseIntPipe) skip?: number,
    @Query('take', ParseIntPipe) take?: number,
  ) {
    return this.restaurantsService.findNearby(lat, lng, radius, { skip, take });
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
  @ApiOperation({ summary: 'Obtener restaurante por ID' })
  @ApiOkResponse({ description: 'Restaurante encontrado.', type: Restaurant })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar restaurante (solo admin)' })
  @ApiOkResponse({ description: 'Restaurante actualizado.', type: Restaurant })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRestaurantDto) {
    return this.restaurantsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar restaurante (solo admin)' })
  @ApiResponse({ status: 200, description: 'Restaurante eliminado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantsService.remove(id);
  }
}