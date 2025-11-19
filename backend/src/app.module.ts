import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegionsModule } from './regions/regions.module';
import { LegendsModule } from './legends/legends.module';
import { EventPlacesModule } from './event-places/event-places.module';
import { HotelsModule } from './hotels/hotels.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CredentialsModule } from './credentials/credentials.module';
import { MythStoriesModule } from './myth-stories/myth-stories.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './database/seed.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm') ?? {},
    }),
    
    RegionsModule,
    LegendsModule,
    EventPlacesModule,
    HotelsModule,
    RestaurantsModule,
    ReviewsModule,
    CredentialsModule,
    MythStoriesModule,
    UsersModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
