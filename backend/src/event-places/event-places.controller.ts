import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { EventPlacesService } from './event-places.service';
import { CreateEventPlaceDto } from './dto/create-event-place.dto';
import { UpdateEventPlaceDto } from './dto/update-event-place.dto';
import { EventPlace, EventPlaceType } from './entities/event-place.entity';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Event Places')
@Controller('event-places')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    validationError: { target: false },
  }),
)
export class EventPlacesController {
  constructor(private readonly service: EventPlacesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Crear un lugar/evento' })
  @ApiCreatedResponse({ description: 'Lugar/evento creado correctamente.', type: EventPlace })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async create(@Body() dto: CreateEventPlaceDto): Promise<EventPlace> {
    return this.service.create(dto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar todos los lugares/eventos' })
  @ApiOkResponse({ description: 'Listado obtenido correctamente.', type: [EventPlace] })
  async findAll(): Promise<EventPlace[]> {
    return this.service.findAll();
  }

  @Get('type/:type')
  @Public()
  @ApiOperation({ summary: 'Listar lugares/eventos por tipo' })
  @ApiParam({ name: 'type', description: 'Tipo de lugar/evento (festival, ruta, evento, atractivo)' })
  async findByType(@Param('type') type: EventPlaceType): Promise<EventPlace[]> {
    return this.service.findByType(type);
  }

  @Get('region/:regionId')
  @Public()
  @ApiOperation({ summary: 'Listar lugares/eventos por región' })
  @ApiParam({ name: 'regionId', description: 'UUID de la región' })
  async findByRegion(
    @Param(
      'regionId',
      new ParseUUIDPipe({
        version: '4',
        exceptionFactory: () => new BadRequestException('El regionId debe ser un UUID v4 válido.'),
      }),
    ) regionId: string,
  ): Promise<EventPlace[]> {
    return this.service.findByRegion(regionId);
  }

  @Get('nearby')
  @Public()
  @ApiOperation({ summary: 'Listar lugares/eventos cercanos (lat, lon, radiusKm)' })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos.' })
  async findNearby(
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Query('radiusKm') radiusKm: string,
  ): Promise<EventPlace[]> {
    const numLat = parseFloat(lat);
    const numLon = parseFloat(lon);
    const numRad = parseFloat(radiusKm);
    if ([numLat, numLon, numRad].some((n) => isNaN(n))) {
      throw new BadRequestException('Parámetros numéricos inválidos');
    }
    return this.service.findNearby(numLat, numLon, numRad);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener un lugar/evento por ID' })
  @ApiParam({ name: 'id', description: 'UUID v4 del lugar/evento' })
  @ApiOkResponse({ description: 'Lugar/evento encontrado.', type: EventPlace })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 404, description: 'No encontrado.' })
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        exceptionFactory: () => new BadRequestException('El id debe ser un UUID v4 válido.'),
      }),
    )
    id: string,
  ): Promise<EventPlace> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Actualizar un lugar/evento por ID' })
  @ApiParam({ name: 'id', description: 'UUID v4 del lugar/evento' })
  @ApiOkResponse({ description: 'Lugar/evento actualizado.', type: EventPlace })
  @ApiResponse({ status: 400, description: 'Datos o ID inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'No encontrado.' })
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        exceptionFactory: () => new BadRequestException('El id debe ser un UUID v4 válido.'),
      }),
    )
    id: string,
    @Body() dto: UpdateEventPlaceDto,
  ): Promise<EventPlace> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Eliminar un lugar/evento por ID' })
  @ApiParam({ name: 'id', description: 'UUID v4 del lugar/evento' })
  @ApiResponse({ status: 200, description: 'Lugar/evento eliminado.' })
  @ApiResponse({ status: 400, description: 'ID inválido.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'No encontrado.' })
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        exceptionFactory: () => new BadRequestException('El id debe ser un UUID v4 válido.'),
      }),
    )
    id: string,
  ): Promise<void> {
    return this.service.remove(id);
  }
}
