import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UsePipes, ValidationPipe, BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiOkResponse, ApiCreatedResponse, ApiResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { MythStoriesService } from './myth-stories.service';
import { CreateMythStoryDto } from './dto/create-myth-story.dto';
import { UpdateMythStoryDto } from './dto/update-myth-story.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { MythStory } from './entities/myth-story.entity';

@ApiTags('Myth Stories')
@Controller('myth-stories')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true, validationError: { target: false } }))
export class MythStoriesController {
  constructor(private readonly service: MythStoriesService) {}
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear historia mítica (admin y usuarios normales)' })
  @ApiCreatedResponse({ description: 'Historia creada correctamente.', type: MythStory })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  async create(@Body() dto: CreateMythStoryDto, @GetUser() user: any): Promise<MythStory> {
    return this.service.create(dto, user.id);
  }
  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar historias míticas (público)' })
  @ApiOkResponse({ description: 'Listado obtenido.', type: [MythStory] })
  async findAll(): Promise<MythStory[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener historia por ID' })
  @ApiParam({ name: 'id', description: 'UUID v4 de la historia' })
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4', exceptionFactory: () => new BadRequestException('El id debe ser UUID v4 válido.') })) id: string): Promise<MythStory> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar historia mítica' })
  @ApiParam({ name: 'id', description: 'UUID v4 de la historia' })
  @ApiOkResponse({ description: 'Historia actualizada.', type: MythStory })
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4', exceptionFactory: () => new BadRequestException('El id debe ser UUID v4 válido.') })) id: string,
    @Body() dto: UpdateMythStoryDto,
  ): Promise<MythStory> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar historia mítica' })
  @ApiParam({ name: 'id', description: 'UUID v4 de la historia' })
  @ApiResponse({ status: 200, description: 'Historia eliminada.' })
  async remove(@Param('id', new ParseUUIDPipe({ version: '4', exceptionFactory: () => new BadRequestException('El id debe ser UUID v4 válido.') })) id: string): Promise<void> {
    return this.service.remove(id);
  }
}
