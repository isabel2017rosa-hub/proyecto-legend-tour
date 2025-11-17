import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
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

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
