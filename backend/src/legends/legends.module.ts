// src/legends/legends.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegendsService } from './legends.service';
import { LegendsController } from './legends.controller';
import { Legend } from './entities/legend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Legend])],
  controllers: [LegendsController],
  providers: [LegendsService],
  exports: [LegendsService],
})
export class LegendsModule {}