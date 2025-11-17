// src/regions/regions.controller.ts
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
import { RegionsService } from './regions.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Region } from './entities/region.entity';

@ApiTags('Regions')
@Controller('regions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class RegionsController {
  constructor(private readonly regionsService: RegionsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Crear región (solo admin)' })
  @ApiCreatedResponse({ description: 'Región creada correctamente.', type: Region })
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionsService.create(createRegionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las regiones' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiOkResponse({ description: 'Lista de regiones.', type: [Region] })
  findAll(@Query('skip', ParseIntPipe) skip?: number, @Query('take', ParseIntPipe) take?: number) {
    return this.regionsService.findAll({ skip, take });
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Buscar regiones cercanas' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiOkResponse({ description: 'Regiones cercanas ordenadas por distancia.', type: [Region] })
  findNearby(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radius', ParseFloatPipe) radius: number = 50,
    @Query('skip', ParseIntPipe) skip?: number,
    @Query('take', ParseIntPipe) take?: number,
  ) {
    return this.regionsService.findByCoordinates(lat, lng, radius, { skip, take });
  }

  @Get('search/by-name')
  @ApiOperation({ summary: 'Buscar regiones por nombre (case-insensitive)' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiOkResponse({ description: 'Resultados de la búsqueda de regiones.', type: [Region] })
  searchByName(
    @Query('q') q: string,
    @Query('skip', ParseIntPipe) skip?: number,
    @Query('take', ParseIntPipe) take?: number,
  ) {
    return this.regionsService.searchByName(q, { skip, take });
  }

  @Get('by-legend/:legendId')
  @ApiOperation({ summary: 'Listar regiones por leyenda asociada' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiOkResponse({ description: 'Regiones filtradas por leyenda.', type: [Region] })
  findByLegend(
    @Param('legendId', ParseUUIDPipe) legendId: string,
    @Query('skip', ParseIntPipe) skip?: number,
    @Query('take', ParseIntPipe) take?: number,
  ) {
    return this.regionsService.findByLegend(legendId, { skip, take });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener región por ID' })
  @ApiOkResponse({ description: 'Región encontrada.', type: Region })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.regionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar región (solo admin)' })
  @ApiOkResponse({ description: 'Región actualizada.', type: Region })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRegionDto: UpdateRegionDto,
  ) {
    return this.regionsService.update(id, updateRegionDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar región (solo admin)' })
  @ApiResponse({ status: 200, description: 'Región eliminada.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.regionsService.remove(id);
  }
}
