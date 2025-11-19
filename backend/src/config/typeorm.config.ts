import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({ isGlobal: true });

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'legend_tour',
  synchronize: true, // desactivar en producción
  autoLoadEntities: true,
  logging: process.env.DB_LOGGING === 'true',
  dropSchema: true,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
};