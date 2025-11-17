// ============ src/hotels/hotels.controller.ts ============
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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Hotels')
@Controller('hotels')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Crear un nuevo hotel (solo admin)' })
  @ApiCreatedResponse({ description: 'Hotel creado exitosamente' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  @ApiForbiddenResponse({ description: 'Acceso denegado. Solo administradores pueden crear hoteles.' })
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.hotelsService.create(createHotelDto);
  }
  @Get()
  @ApiOperation({ summary: 'Obtener todos los hoteles (admin y usuarios normales)' })
  @ApiOkResponse({ description: 'Lista de hoteles' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  findAll() {
    return this.hotelsService.findAll();
  }

  @Get('by-rating')
  @ApiOperation({ summary: 'Buscar hoteles por rating mínimo' })
  @ApiResponse({ status: 200, description: 'Hoteles filtrados' })
  findByRating(@Query('minRating', ParseFloatPipe) minRating: number) {
    return this.hotelsService.findByRating(minRating);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un hotel por ID' })
  @ApiResponse({ status: 200, description: 'Hotel encontrado' })
  @ApiResponse({ status: 404, description: 'Hotel no encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.hotelsService.findOne(id);
  }
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar un hotel (solo admin)' })
  @ApiOkResponse({ description: 'Hotel actualizado' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  @ApiForbiddenResponse({ description: 'Acceso denegado. Solo administradores pueden actualizar hoteles.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateHotelDto: UpdateHotelDto,
  ) {
    return this.hotelsService.update(id, updateHotelDto);
  }
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar un hotel (solo admin)' })
  @ApiOkResponse({ description: 'Hotel eliminado' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  @ApiForbiddenResponse({ description: 'Acceso denegado. Solo administradores pueden eliminar hoteles.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.hotelsService.remove(id);
  }
}