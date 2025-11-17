// src/credentials/credentials.controller.ts
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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('b-credentials')
@Controller('credentials')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear credenciales (solo admin)' })
  @ApiResponse({ status: 201, description: 'Credencial creada' })
  create(@Body() createCredentialDto: CreateCredentialDto) {
    return this.credentialsService.create(createCredentialDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Listar todas las credenciales (solo admin)' })
  @ApiResponse({ status: 200, description: 'Lista de credenciales' })
  findAll() {
    return this.credentialsService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener credencial por ID (solo admin)' })
  @ApiResponse({ status: 200, description: 'Credencial encontrada' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.credentialsService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar credencial (solo admin)' })
  @ApiResponse({ status: 200, description: 'Credencial actualizada' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCredentialDto: UpdateCredentialDto,
  ) {
    return this.credentialsService.update(id, updateCredentialDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar credencial (solo admin)' })
  @ApiResponse({ status: 200, description: 'Credencial eliminada' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.credentialsService.remove(id);
  }
}