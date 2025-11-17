import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LegendsService } from './legends.service';
import { CreateLegendDto } from './dto/create-legend.dto';
import { UpdateLegendDto } from './dto/update-legend.dto';

@ApiTags('Legends')
@Controller('legends')
@ApiBearerAuth('JWT-auth')
export class LegendsController {
  constructor(private readonly legendsService: LegendsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear leyenda' })
  create(@Body() dto: CreateLegendDto) {
    return this.legendsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar leyendas' })
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