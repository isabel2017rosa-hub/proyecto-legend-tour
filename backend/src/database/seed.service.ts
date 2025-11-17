import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Credential } from '../credentials/entities/credential.entity';
import { Review, ReviewEntityType } from '../reviews/entities/review.entity';
import { Legend } from '../legends/entities/legend.entity';
import { Region } from '../regions/entities/region.entity';
import { EventPlace, EventPlaceType } from '../event-places/entities/event-place.entity';
import { Hotel } from '../hotels/entities/hotel.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { MythStory } from '../myth-stories/entities/myth-story.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Credential) private readonly credRepo: Repository<Credential>,
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Legend) private readonly legendRepo: Repository<Legend>,
    @InjectRepository(Region) private readonly regionRepo: Repository<Region>,
    @InjectRepository(EventPlace) private readonly eventPlaceRepo: Repository<EventPlace>,
    @InjectRepository(Hotel) private readonly hotelRepo: Repository<Hotel>,
    @InjectRepository(Restaurant) private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(MythStory) private readonly storyRepo: Repository<MythStory>,
  ) {}

  async seed() {
    // Deshabilitar seeding en producción por seguridad
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Seeding deshabilitado en producción');
    }
    await this.clear();

    const legends = await this.createLegends();
    const regions = await this.createRegions(legends);
    const hotels = await this.createHotels();
    const restaurants = await this.createRestaurants();
    const eventPlaces = await this.createEventPlaces(regions, legends, hotels, restaurants);
    const users = await this.createUsers();
    const reviews = await this.createReviews(users, eventPlaces, hotels, restaurants);
    const stories = await this.createMythStories(users, regions);

    return {
      message: 'Base de datos poblada correctamente',
      counts: {
        legends: legends.length,
        regions: regions.length,
        hotels: hotels.length,
        restaurants: restaurants.length,
        eventPlaces: eventPlaces.length,
        users: users.length,
        reviews: reviews.length,
        stories: stories.length,
      },
    };
  }

  private async clear() {
    // Delete in reverse dependency order
    await this.storyRepo.delete({});
    await this.reviewRepo.delete({});
    await this.eventPlaceRepo.delete({});
    await this.hotelRepo.delete({});
    await this.restaurantRepo.delete({});
    await this.regionRepo.delete({});
    await this.legendRepo.delete({});
    await this.credRepo.delete({});
    await this.userRepo.delete({});
  }

  private async createLegends() {
    const data: Partial<Legend>[] = [
      {
        name: 'Serpiente Dorada',
        description: 'Una serpiente mítica que protege tesoros ocultos en los Andes.',
        imageUrl: 'legend-serpent.jpg',
      },
      {
        name: 'Susurro del Bosque',
        description: 'Espíritus que hablan a través del viento guiando a viajeros perdidos.',
        imageUrl: 'legend-forest.jpg',
      },
    ];
    return await this.legendRepo.save(data);
  }

  private async createRegions(legends: Legend[]) {
    const data: Partial<Region>[] = [
      {
        name: 'Cumbres Andinas',
        description: 'Región de gran altitud con antiguos senderos.',
        latitude: -13.52,
        longitude: -71.97,
        legend: legends[0],
      },
      {
        name: 'Bosque Esmeralda',
        description: 'Denso bosque lleno de biodiversidad.',
        latitude: -2.15,
        longitude: -79.90,
        legend: legends[1],
      },
    ];
    return await this.regionRepo.save(data);
  }

  private async createHotels() {
    const data: Partial<Hotel>[] = [
      {
        name: 'Lodge Horizonte',
        address: 'Av. Montaña 123',
        latitude: -13.521,
        longitude: -71.965,
        rating: 4,
        website: 'https://skyline.example.com',
        phone: '+51 123 4567',
      },
      {
        name: 'Retiro del Bosque',
        address: 'Calle Selva 456',
        latitude: -2.152,
        longitude: -79.899,
        rating: 5,
        website: 'https://forestretreat.example.com',
        phone: '+593 555 9876',
      },
    ];
    return await this.hotelRepo.save(data);
  }

  private async createRestaurants() {
    const data: Partial<Restaurant>[] = [
      {
        name: 'Sabores Andinos',
        address: 'Av. Montaña 789',
        latitude: -13.523,
        longitude: -71.966,
        rating: 5,
        category: 'Local',
        website: 'https://andeanflavors.example.com',
      },
      {
        name: 'Cocina de la Selva',
        address: 'Av. Selva 987',
        latitude: -2.151,
        longitude: -79.898,
        rating: 4,
        category: 'Fusión',
        website: 'https://junglecuisine.example.com',
      },
    ];
    return await this.restaurantRepo.save(data);
  }

  private async createEventPlaces(regions: Region[], legends: Legend[], hotels: Hotel[], restaurants: Restaurant[]) {
    const data: Partial<EventPlace>[] = [
      {
        name: 'Festival del Tesoro',
        description: 'Festival anual que celebra la leyenda de la Serpiente Dorada.',
        latitude: -13.5205,
        longitude: -71.9705,
        type: EventPlaceType.FESTIVAL,
        region: regions[0],
        legend: legends[0],
        hotel: hotels[0],
        restaurant: restaurants[0],
      },
      {
        name: 'Ruta del Susurro',
        description: 'Sendero guiado a través del Bosque Esmeralda.',
        latitude: -2.1505,
        longitude: -79.9005,
        type: EventPlaceType.RUTA,
        region: regions[1],
        legend: legends[1],
        hotel: hotels[1],
        restaurant: restaurants[1],
      },
    ];
    return await this.eventPlaceRepo.save(data);
  }

  private async createUsers() {
    const data: Partial<User>[] = [
      {
        name: 'Administrador',
        lastName: 'Principal',
        email: 'admin@example.com',
        address: 'Calle Admin 1',
        birthdate: new Date('1990-01-01') as any,
        phone: '1234567890',
        credential: {
          name_user: 'admin',
          password_user: await bcrypt.hash('Admin123!', 10),
          isAdmin: true,
        } as Credential,
      },
      {
        name: 'Juana',
        lastName: 'Pérez',
        email: 'jane@example.com',
        address: 'Avenida Usuario 99',
        birthdate: new Date('1992-05-10') as any,
        phone: '987654321',
        credential: {
          name_user: 'jane',
          password_user: await bcrypt.hash('Jane123!', 10),
          isAdmin: false,
        } as Credential,
      },
    ];
    return await this.userRepo.save(data);
  }

  private async createReviews(users: User[], eventPlaces: EventPlace[], hotels: Hotel[], restaurants: Restaurant[]) {
    const data: Partial<Review>[] = [
      {
        rating: 5,
        comment: '¡Experiencia de festival increíble!',
        entityType: ReviewEntityType.EVENT_PLACE,
        entityId: eventPlaces[0].id_eventPlace,
        user: users[1],
      },
      {
        rating: 4,
        comment: 'Estadía cómoda con excelentes vistas.',
        entityType: ReviewEntityType.HOTEL,
        entityId: hotels[0].id_hotel,
        user: users[1],
      },
      {
        rating: 5,
        comment: 'Platos locales deliciosos.',
        entityType: ReviewEntityType.RESTAURANT,
        entityId: restaurants[0].id_restaurant,
        user: users[1],
      },
    ];
    return await this.reviewRepo.save(data);
  }

  private async createMythStories(users: User[], regions: Region[]) {
    const data: Partial<MythStory>[] = [
      {
        title: 'El Guardián Serpiente',
        content: 'La leyenda cuenta de una serpiente dorada que protege caminos sagrados.',
        imageUrl: 'story-serpent.jpg',
        region: regions[0],
        user: users[0],
      },
      {
        title: 'Voces de la Esmeralda',
        content: 'Viajeros escuchan susurros que los guían de forma segura a casa.',
        imageUrl: 'story-forest.jpg',
        region: regions[1],
        user: users[1],
      },
    ];
    return await this.storyRepo.save(data);
  }
}