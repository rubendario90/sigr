# Manual de despliegue del SIGR

1. Instalar Node.js 20 y PostgreSQL 16.
2. Clonar el repositorio y copiar `.env.example` como `.env`; completar `JWT_SECRET` y `DATABASE_URL`.
3. Crear la base de datos: `createdb sigr && psql -d sigr -f database/schema.sql -f database/seeds/mesas.sql`.
4. Backend: `cd backend && npm ci && npm test && npm start` (puerto 3000).
5. Frontend: `cd frontend && npm ci && npm run build`; publicar la carpeta `dist/` en el servidor web.
6. Verificar: `GET http://<servidor>:3000/api/salud` debe responder `{"estado":"ok"}`.
