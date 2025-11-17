import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Credential } from '../credentials/entities/credential.entity';
import { Review } from '../reviews/entities/review.entity';
import { User } from '../users/entities/user.entity';
import { Region } from '../regions/entities/region.entity';
import { MythStory } from '../myth-stories/entities/myth-story.entity';
import { EventPlace } from '../event-places/entities/event-place.entity';
import { Legend } from '../legends/entities/legend.entity';
import { Hotel } from '../hotels/entities/hotel.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

ConfigModule.forRoot({ isGlobal: true });

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'legend_tour',
  synchronize: process.env.DB_SYNC === 'false' ? false : true, // desactivar en producción
  autoLoadEntities: true,
  logging: process.env.DB_LOGGING === 'true',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};