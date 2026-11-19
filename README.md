# TaskManager API

API REST desarrollada con NestJS 12, Prisma 7 y PostgreSQL para administrar tareas.

## Requisitos

- Node.js 24.22 o una versión compatible
- npm
- PostgreSQL instalado y ejecutándose localmente
- Una base de datos PostgreSQL para la aplicación

## Instalación

Clona el repositorio e instala las dependencias:

```bash
npm install
```

Crea un archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

Configura `DATABASE_URL` con tu usuario, servidor y base de datos locales. Para autenticación local mediante socket Unix en Linux:

```env
DATABASE_URL="postgresql://TU_USUARIO@localhost/TU_BASE?host=/var/run/postgresql&sslmode=disable"
PORT=3000
```

Ejemplo usando el usuario y la base locales `andres` y `taskmanager`:

```env
DATABASE_URL="postgresql://andres@localhost/taskmanager?host=/var/run/postgresql&sslmode=disable"
PORT=3000
```

Puedes comprobar la conexión directamente:

```bash
psql -d taskmanager -c 'SELECT 1;'
```

Si usas autenticación TCP en lugar de socket Unix, usa:

```env
DATABASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/taskmanager?schema=public"
```

## Base de datos

Genera el cliente Prisma y aplica las migraciones:

```bash
npm run db:generate
npm run db:deploy
```

Durante el desarrollo también puedes crear y aplicar una migración nueva:

```bash
npm run db:migrate -- --name nombre_de_la_migracion
```

Otros comandos útiles:

```bash
npm run db:push
npm run db:studio
```

## Ejecutar la aplicación

Desarrollo con recarga automática:

```bash
npm run start:dev
```

Ejecución normal:

```bash
npm run start
```

La API estará disponible en:

```text
http://127.0.0.1:3000
```

## Compilar

```bash
npm run build
npm run start:prod
```

## Endpoints

### Crear una tarea

```text
POST /tasks
```

```json
{
  "title": "Preparar informe",
  "description": "Preparar el informe mensual",
  "status": "PENDIENTE",
  "responsible": "Andrés",
  "dueDate": "2026-12-10T18:00:00.000Z"
}
```

Estados disponibles:

- `PENDIENTE`
- `EN_CURSO`
- `HECHA`

### Listar tareas

```text
GET /tasks
```

Filtros opcionales y paginación:

```text
GET /tasks?status=PENDIENTE&responsible=Andrés&page=1&limit=10
```

- `status`: estado exacto
- `responsible`: búsqueda parcial del responsable
- `page`: página, desde `1`
- `limit`: resultados por página, máximo `100`

### Obtener una tarea

```text
GET /tasks/:id
```

### Editar una tarea

```text
PATCH /tasks/:id
```

```json
{
  "status": "EN_CURSO",
  "responsible": "Andrés Torres",
  "dueDate": "2026-12-15T18:00:00.000Z"
}
```

### Eliminar una tarea

```text
DELETE /tasks/:id
```

Los identificadores deben ser UUID v4 válidos.

## Ejemplos con curl

```bash
curl -X POST http://127.0.0.1:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Preparar informe","responsible":"Andrés","dueDate":"2026-12-10T18:00:00.000Z"}'

curl 'http://127.0.0.1:3000/tasks?status=PENDIENTE&page=1&limit=10'

curl 'http://127.0.0.1:3000/tasks/TASK_UUID'

curl -X PATCH 'http://127.0.0.1:3000/tasks/TASK_UUID' \
  -H 'Content-Type: application/json' \
  -d '{"status":"HECHA"}'

curl -X DELETE 'http://127.0.0.1:3000/tasks/TASK_UUID'
```

## Colección de Postman

Importa en Postman:

```text
postman/TaskManager.postman_collection.json
```

La variable `baseUrl` usa por defecto:

```text
http://127.0.0.1:3000
```

## Pruebas

Ejecutar todas las pruebas e2e separadas por endpoint:

```bash
npm run test:e2e -- --runInBand
```

Las pruebas se encuentran en:

- `test/tasks-create.e2e-spec.ts`
- `test/tasks-list.e2e-spec.ts`
- `test/tasks-get.e2e-spec.ts`
- `test/tasks-update.e2e-spec.ts`
- `test/tasks-delete.e2e-spec.ts`

Ejecutar el linter:

```bash
npm run lint
```
