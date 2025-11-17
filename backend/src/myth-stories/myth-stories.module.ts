// src/myth-stories/myth-stories.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MythStoriesService } from './myth-stories.service';
import { MythStoriesController } from './myth-stories.controller';
import { MythStory } from './entities/myth-story.entity';
import { MythStoriesRepository } from './myth-stories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MythStory])],
  controllers: [MythStoriesController],
  providers: [MythStoriesService, MythStoriesRepository],
  exports: [MythStoriesService, MythStoriesRepository],
})
export class MythStoriesModule {}