# Legend Tour Backend

Backend en NestJS para la plataforma Legend Tour: gestión de regiones, leyendas, lugares de evento, hoteles, restaurantes, historias míticas y usuarios con autenticación JWT.

## Tecnologías

- Node.js / TypeScript
- NestJS
- TypeORM (PostgreSQL)
- Passport JWT / Local
- Swagger (documentación automática)

## Requisitos

- Node.js 18+
- PostgreSQL 13+
- npm 9+

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz con:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=legend_tour
JWT_SECRET=secret_key_dev
PORT=3002
```

## Scripts

```bash
npm run start        # desarrollo
npm run start:dev    # watch mode
npm run start:prod   # producción (usa dist/)
npm run build        # compila TypeScript
npm run test         # tests unitarios
npm run test:e2e     # tests e2e
npm run test:cov     # cobertura
```

## Documentación API

Luego de iniciar el servidor visita:

```text
http://localhost:3002/api
```

Allí encontrarás Swagger con los endpoints disponibles.

## Seed de base de datos

Para poblar datos de ejemplo:

- Endpoint: `POST /seed`
- Devuelve conteo de registros creados.

## Autenticación

- Registro: `POST /auth/register`
- Login: `POST /auth/login`
- Refresh: `POST /auth/refresh`
- Cambio de contraseña: `POST /auth/change-password`
- Restablecer contraseña: `POST /auth/reset-password`
- Roles: usar decorador `@Admin()` o `@Roles('admin')`.

Guards:

- `JwtAuthGuard`: protege endpoints privados.
- `LocalAuthGuard`: login con estrategia local.
- `RolesGuard`, `AdminGuard`: autorización por rol.

## Estructura principal

```text
src/
  auth/
  users/
  regions/
  legends/
  event-places/
  hotels/
  restaurants/
  reviews/
  myth-stories/
  credentials/
  database/
```

## Docker (opcional)

Si existe `docker-compose.yml`:

```bash
docker compose up -d
```

Asegúrate de que las variables coincidan con tu `.env`.

## Tests

```bash
npm run test
npm run test:e2e
```

## Buenas prácticas

- Usa DTOs con validaciones (`class-validator`).
- Activa `ValidationPipe` (ya configurado en `main.ts`).
- No expongas `JWT_SECRET` público.

## Contribución

1. Crea rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Agrega tests y documentación.
3. Haz PR y describe cambios.

## Licencia

MIT.

---
Proyecto generado a partir de NestJS starter y adaptado para Legend Tour.
