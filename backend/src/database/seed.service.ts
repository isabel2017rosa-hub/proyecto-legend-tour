import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(SeedService.name);

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
  // BORRAR EN ORDEN INVERSO A LAS RELACIONES
  // Usar consultas para eliminar todos los registros respetando las FK
  
  try {
    // Primero eliminar las entidades que dependen de otras
    await this.reviewRepo.createQueryBuilder().delete().execute();       // Review depende de Users y EventPlaces/Hotels/Restaurants
    await this.storyRepo.createQueryBuilder().delete().execute();        // MythStories depende de Users y Regions
    await this.eventPlaceRepo.createQueryBuilder().delete().execute();   // EventPlace depende de Region, Legend, Hotel, Restaurant
    
    // Luego eliminar las entidades principales
    await this.credRepo.createQueryBuilder().delete().execute();         // Credential depende de User
    await this.userRepo.createQueryBuilder().delete().execute();         // User sin dependencias
    await this.hotelRepo.createQueryBuilder().delete().execute();        // Hotel depende de nada
    await this.restaurantRepo.createQueryBuilder().delete().execute();   // Restaurant depende de nada
    await this.regionRepo.createQueryBuilder().delete().execute();       // Region depende de Legend
    await this.legendRepo.createQueryBuilder().delete().execute();       // Legend sin dependencias
    
    console.log(' Base de datos limpiada exitosamente');
    this.logger.log(' Base de datos limpiada exitosamente');
  } catch (error) {
    console.error(' Error al limpiar la base de datos:', error.message);
    throw error;
  }
}


  private async createLegends() {
    const data: Partial<Legend>[] = [
      // Leyendas originales
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
      // Leyendas colombianas
      {
        name: 'La Llorona',
        description: 'Una mujer que vaga lamentándose por sus hijos perdidos. Se aparece cerca de ríos y lagunas.',
        imageUrl: '/images/llorona.jpg',
      },
      {
        name: 'El Sombrerón',
        description: 'Un pequeño hombre elegante con un gran sombrero negro, que persigue mujeres y trenza crines de caballos.',
        imageUrl: '/images/sombreron.jpg',
      },
      {
        name: 'La Patasola',
        description: 'Criatura de una sola pierna que engaña a los hombres en la selva transformándose en una mujer hermosa.',
        imageUrl: '/images/patasola.jpg',
      },
    ];
    const legends = await this.legendRepo.save(data);
    this.logger.log(' Leyendas creadas');
    return legends;
  }
  private async createRegions(legends: Legend[]) {
    const data: Partial<Region>[] = [
      // Regiones originales
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
      // Regiones colombianas
      {
        name: 'Cundinamarca',
        description: 'Región andina de clima frío, hogar de varias lagunas sagradas.',
        latitude: 4.936,
        longitude: -73.833,
        legend: legends[2], // La Llorona
      },
      {
        name: 'Antioquia',
        description: 'Región montañosa conocida por sus leyendas campesinas y relatos tradicionales.',
        latitude: 5.587,
        longitude: -75.822,
        legend: legends[3], // El Sombrerón
      },
      {
        name: 'Amazonas',
        description: 'Zona selvática con mitología indígena muy rica.',
        latitude: -4.215,
        longitude: -69.940,
        legend: legends[4], // La Patasola
      },
    ];
    const regions = await this.regionRepo.save(data);
    this.logger.log('Regiones creadas');
    return regions;
  }
  private async createHotels() {
    const data: Partial<Hotel>[] = [
      // Hoteles originales
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
      // Hoteles colombianos
      {
        name: 'Hotel Lagunas Encantadas',
        address: 'Guatavita, Cundinamarca',
        latitude: 4.936,
        longitude: -73.833,
        rating: 4,
        website: 'https://lagunasencantadas.com',
        phone: '3104567890',
      },
      {
        name: 'Hotel Montañas Verdes',
        address: 'Jardín, Antioquia',
        latitude: 5.587,
        longitude: -75.822,
        rating: 5,
        website: 'https://montanasverdes.com',
        phone: '3109876543',
      },
      {
        name: 'Hotel Selva Mística',
        address: 'Leticia, Amazonas',
        latitude: -4.215,
        longitude: -69.940,
        rating: 4,
        website: 'https://selvamistica.co',
        phone: '3201239876',
      },
    ];
    const hotels = await this.hotelRepo.save(data);
    this.logger.log('Hoteles creados');
    return hotels;
  }
  private async createRestaurants() {
    const data: Partial<Restaurant>[] = [
      // Restaurantes originales
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
      // Restaurantes colombianos
      {
        name: 'Fogón Andino',
        address: 'Zipaquirá, Cundinamarca',
        latitude: 5.026,
        longitude: -74.005,
        rating: 5,
        category: 'Comida Tradicional',
        website: 'https://fogonandino.com',
      },
      {
        name: 'La Parrilla Paisa',
        address: 'Rionegro, Antioquia',
        latitude: 6.155,
        longitude: -75.374,
        rating: 4,
        category: 'Parrilla',
        website: 'https://parrillapaisa.com',
      },
      {
        name: 'Sabores de la Selva',
        address: 'Leticia, Amazonas',
        latitude: -4.215,
        longitude: -69.940,
        rating: 5,
        category: 'Amazónica',
        website: 'https://saboresselva.co',
      },
    ];
    const restaurants = await this.restaurantRepo.save(data);
    this.logger.log('Restaurantes creados');
    return restaurants;
  }
  private async createEventPlaces(regions: Region[], legends: Legend[], hotels: Hotel[], restaurants: Restaurant[]) {
    const data: Partial<EventPlace>[] = [
      // Sitios originales
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
      // Sitios turísticos colombianos
      {
        name: 'Laguna de Guatavita',
        description: 'Laguna sagrada vinculada a la Leyenda del Dorado.',
        latitude: 4.936,
        longitude: -73.833,
        type: EventPlaceType.RUTA,
        region: regions[2], // Cundinamarca
        legend: legends[2], // La Llorona
        hotel: hotels[2],   // Hotel Lagunas Encantadas
        restaurant: restaurants[2], // Fogón Andino
      },
      {
        name: 'Cascada del Amor',
        description: 'Sitio misterioso donde se aparece La Llorona.',
        latitude: 4.940,
        longitude: -73.830,
        type: EventPlaceType.RUTA,
        region: regions[2], // Cundinamarca
        legend: legends[2], // La Llorona
        hotel: hotels[2],   // Hotel Lagunas Encantadas
        restaurant: restaurants[2], // Fogón Andino
      },
      {
        name: 'Cerro Tusa',
        description: 'Montaña piramidal envuelta en mitos paisas.',
        latitude: 5.587,
        longitude: -75.822,
        type: EventPlaceType.RUTA,
        region: regions[3], // Antioquia
        legend: legends[3], // El Sombrerón
        hotel: hotels[3],   // Hotel Montañas Verdes
        restaurant: restaurants[3], // La Parrilla Paisa
      },
      {
        name: 'Reserva Natural Tanimboca',
        description: 'Selva profunda donde se dice vive la Patasola.',
        latitude: -4.215,
        longitude: -69.940,
        type: EventPlaceType.RUTA,
        region: regions[4], // Amazonas
        legend: legends[4], // La Patasola
        hotel: hotels[4],   // Hotel Selva Mística
        restaurant: restaurants[4], // Sabores de la Selva
      },
    ];
    const eventPlaces = await this.eventPlaceRepo.save(data);
    this.logger.log('Sitios turísticos creados');
    return eventPlaces;
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
      // Reviews originales
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
      // Reviews de lugares colombianos
      {
        rating: 5,
        comment: 'Experiencia increíble en Guatavita!',
        entityType: ReviewEntityType.EVENT_PLACE,
        entityId: eventPlaces[2]?.id_eventPlace, // Laguna de Guatavita
        user: users[1],
      },
      {
        rating: 4,
        comment: 'Hermoso lugar pero algo frío.',
        entityType: ReviewEntityType.EVENT_PLACE,
        entityId: eventPlaces[3]?.id_eventPlace, // Cascada del Amor
        user: users[0],
      },
      {
        rating: 5,
        comment: 'Lugar mágico lleno de energía.',
        entityType: ReviewEntityType.EVENT_PLACE,
        entityId: eventPlaces[5]?.id_eventPlace, // Reserva Natural Tanimboca
        user: users[1],
      },
    ];
    const reviews = await this.reviewRepo.save(data);
    this.logger.log(' Reviews creadas');
    return reviews;
  }
  private async createMythStories(users: User[], regions: Region[]) {
    const data: Partial<MythStory>[] = [
      // Historias originales
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
      // Historias mitológicas colombianas
      {
        title: 'Encuentro con La Llorona en Guatavita',
        content: 'Un campesino asegura haber escuchado los lamentos mientras caminaba de noche...',
        imageUrl: '/images/llorona-story.jpg',
        region: regions[2], // Cundinamarca
        user: users[1],
      },
      {
        title: 'Sombrerón en Antioquia',
        content: 'En las fincas cafeteras se cuenta que una mujer fue visitada varias veces por un pequeño hombre elegante...',
        imageUrl: '/images/sombreron-story.jpg',
        region: regions[3], // Antioquia
        user: users[0],
      },
      {
        title: 'La Patasola en la selva amazónica',
        content: 'Un grupo de turistas perdió el camino al escuchar a una mujer pidiendo ayuda...',
        imageUrl: '/images/patasola-story.jpg',
        region: regions[4], // Amazonas
        user: users[1],
      },
    ];
    const stories = await this.storyRepo.save(data);
    this.logger.log('Historias mitológicas creadas');
    return stories;
  }
}