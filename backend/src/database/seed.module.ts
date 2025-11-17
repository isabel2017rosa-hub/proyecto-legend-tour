import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { User } from '../users/entities/user.entity';
import { Credential } from '../credentials/entities/credential.entity';
import { Review } from '../reviews/entities/review.entity';
import { Legend } from '../legends/entities/legend.entity';
import { Region } from '../regions/entities/region.entity';
import { EventPlace } from '../event-places/entities/event-place.entity';
import { Hotel } from '../hotels/entities/hotel.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { MythStory } from '../myth-stories/entities/myth-story.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Credential,
      Review,
      Legend,
      Region,
      EventPlace,
      Hotel,
      Restaurant,
      MythStory,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}