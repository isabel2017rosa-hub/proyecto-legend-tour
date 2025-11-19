import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean)
      : true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Legend Tour API')
    .setDescription('API para gestión de leyendas y lugares')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
    .addTag('a-auth', 'Autenticación y autorización')
    .addTag('b-credentials', 'Gestión de credenciales')
    .addTag('c-users', 'Gestión de usuarios')
    .build();
  const document = SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup('api', app as any, document, { 
    swaggerOptions: { 
      persistAuthorization: true,
      tagsSorter: 'alpha'
    } 
  });

  app.enableShutdownHooks();

  const port = Number(process.env.PORT ?? 3002);
  const host = process.env.HOST ?? '127.0.0.1';
  await app.listen(3002);
  const baseUrl = `http://${host}:${port}`;
  console.log(` LegendTour API running on: ${baseUrl}`);
  console.log(` Swagger UI: http://localhost:${port}/api`);
}
bootstrap();
