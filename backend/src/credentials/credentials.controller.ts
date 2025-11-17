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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
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
  @ApiCreatedResponse({ description: 'Credencial creada' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  @ApiForbiddenResponse({ description: 'Acceso denegado. Solo administradores pueden crear credenciales.' })
  create(@Body() createCredentialDto: CreateCredentialDto) {
    return this.credentialsService.create(createCredentialDto);
  }
  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Listar todas las credenciales (solo admin)' })
  @ApiOkResponse({ description: 'Lista de credenciales' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  @ApiForbiddenResponse({ description: 'Acceso denegado. Solo administradores pueden ver las credenciales.' })
  findAll() {
    return this.credentialsService.findAll();
  }
  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener credencial por ID (solo admin)' })
  @ApiOkResponse({ description: 'Credencial encontrada' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  @ApiForbiddenResponse({ description: 'Acceso denegado. Solo administradores pueden ver las credenciales.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.credentialsService.findOne(id);
  }
  @Patch(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Actualizar credencial (solo admin)' })
  @ApiOkResponse({ description: 'Credencial actualizada' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  @ApiForbiddenResponse({ description: 'Acceso denegado. Solo administradores pueden actualizar credenciales.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCredentialDto: UpdateCredentialDto,
  ) {
    return this.credentialsService.update(id, updateCredentialDto);
  }
  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Eliminar credencial (solo admin)' })
  @ApiOkResponse({ description: 'Credencial eliminada' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o no proporcionado. Requiere autenticación.' })
  @ApiForbiddenResponse({ description: 'Acceso denegado. Solo administradores pueden eliminar credenciales.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.credentialsService.remove(id);
  }
}