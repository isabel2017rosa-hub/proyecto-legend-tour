import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse, ApiOkResponse, ApiCreatedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { LegendsService } from './legends.service';
import { CreateLegendDto } from './dto/create-legend.dto';
import { UpdateLegendDto } from './dto/update-legend.dto';

@ApiTags('Legends')
@Controller('legends')
@ApiBearerAuth('JWT-auth')
export class LegendsController {  constructor(private readonly legendsService: LegendsService) {}
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Crear leyenda (solo admin)' })
  @ApiCreatedResponse({ description: 'Leyenda creada exitosamente' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  @ApiForbiddenResponse({ description: 'Acceso denegado: Solo los administradores están autorizados.' })
  create(@Body() dto: CreateLegendDto) {
    return this.legendsService.create(dto);
  }
  @Get()
  @ApiOperation({ summary: 'Listar leyendas' })
  @ApiOkResponse({ description: 'Lista de leyendas' })
  findAll() {
    return this.legendsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener leyenda por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.legendsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar leyenda' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateLegendDto) {
    return this.legendsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar leyenda' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.legendsService.remove(id);
  }
}