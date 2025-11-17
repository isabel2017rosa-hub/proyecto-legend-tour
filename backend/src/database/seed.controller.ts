import { Controller, Post, HttpCode } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('z-seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  // Endpoint para poblar la base de datos
  @Post('seed') 
  @HttpCode(200)
  @ApiOperation({ summary: 'Poblar la base de datos con datos de ejemplo' })
  @ApiResponse({ status: 200, description: 'Base de datos poblada exitosamente' })
  async run() {
    return await this.seedService.seed();
  }
}
