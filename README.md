# SIGR – Sistema Integral de Gestión de Restaurante

Aplicación web para gestionar pedidos, reservas, menú, caja y reportes.

## Requisitos
Node.js 20, PostgreSQL 16 y Git.

## Instalación
```bash
git clone https://github.com/rubendario90/sigr.git
cd sigr
cp .env.example .env              # completar los datos de la base de datos
psql -U postgres -f database/schema.sql
npm install --prefix backend && npm install --prefix frontend
```

## Ejecución
```bash
npm run dev --prefix backend      # API en http://localhost:3000
npm run dev --prefix frontend     # interfaz en http://localhost:5173
```

## Pruebas
```bash
npm test --prefix backend
```

## Módulos de la línea base v1.0.0
| Módulo | Ruta de la API |
|---|---|
| Autenticación | `/api/auth` |
| Menú digital | `/api/menu` |
| Pedidos en tiempo real | `/api/pedidos` (eventos Socket.IO `pedido:nuevo`, `pedido:estado`) |
| Reservas | `/api/reservas` |
| Caja y reportes | `/api/caja` |

En la línea base, el backend guarda los datos en memoria (`backend/src/config/db.js`) para
desarrollo y pruebas; el esquema para PostgreSQL está en `database/schema.sql`.

## Documentación
- `docs/modelo_datos.md`: modelo de datos.
- `docs/manual_despliegue.md`: manual de despliegue.
- `CHANGELOG.md`: historial de cambios.

## Licencia
MIT. Ver `LICENSE.txt`.
