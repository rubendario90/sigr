// Almacén de datos. En la línea base se usa un almacén en memoria para desarrollo y
// pruebas; el esquema relacional equivalente para PostgreSQL está en database/schema.sql.
const tablas = ["usuarios", "categorias", "platos", "mesas", "reservas", "pedidos", "pagos", "cierres_caja"];
const db = {};
const secuencias = {};

function reset() {
  tablas.forEach((t) => { db[t] = []; secuencias[t] = 0; });
  // Mesas iniciales del restaurante
  [2, 2, 4, 4, 6].forEach((capacidad, i) => insertar("mesas", { numero: i + 1, capacidad }));
}

function insertar(tabla, registro) {
  secuencias[tabla] += 1;
  const fila = { id: secuencias[tabla], ...registro };
  db[tabla].push(fila);
  return fila;
}

reset();
module.exports = { db, insertar, reset };
