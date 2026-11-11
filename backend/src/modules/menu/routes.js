const router = require("express").Router();
const { db, insertar } = require("../../config/db");
const { autenticar, permitir } = require("../../middlewares/auth");
const { httpError } = require("../../middlewares/errores");

const soloAdmin = [autenticar, permitir("administrador")];
const buscar = (tabla, id) => db[tabla].find((r) => r.id === Number(id));

// ---- Categorías
router.get("/categorias", (req, res) => res.json(db.categorias));
router.post("/categorias", soloAdmin, (req, res, next) => {
  if (!req.body.nombre) return next(httpError(400, "El nombre es obligatorio"));
  res.status(201).json(insertar("categorias", { nombre: req.body.nombre }));
});
router.put("/categorias/:id", soloAdmin, (req, res, next) => {
  const cat = buscar("categorias", req.params.id);
  if (!cat) return next(httpError(404, "Categoría no encontrada"));
  Object.assign(cat, { nombre: req.body.nombre ?? cat.nombre });
  res.json(cat);
});
router.delete("/categorias/:id", soloAdmin, (req, res, next) => {
  const id = Number(req.params.id);
  if (db.platos.some((p) => p.categoria_id === id)) return next(httpError(409, "La categoría tiene platos asociados"));
  db.categorias = db.categorias.filter((c) => c.id !== id);
  res.status(204).end();
});

// ---- Platos (la consulta es pública: es el menú digital)
router.get("/platos", (req, res) => {
  const { categoria } = req.query;
  res.json(db.platos.filter((p) => (categoria ? p.categoria_id === Number(categoria) : true)));
});
router.post("/platos", soloAdmin, (req, res, next) => {
  const { nombre, descripcion = "", precio, categoria_id, disponible = true } = req.body;
  if (!nombre || !(precio > 0)) return next(httpError(400, "Nombre y precio mayor a cero son obligatorios"));
  if (!buscar("categorias", categoria_id)) return next(httpError(400, "La categoría no existe"));
  res.status(201).json(insertar("platos", { nombre, descripcion, precio, categoria_id, disponible }));
});
router.put("/platos/:id", soloAdmin, (req, res, next) => {
  const plato = buscar("platos", req.params.id);
  if (!plato) return next(httpError(404, "Plato no encontrado"));
  const { nombre, descripcion, precio, disponible } = req.body;
  Object.assign(plato, Object.fromEntries(Object.entries({ nombre, descripcion, precio, disponible }).filter(([, v]) => v !== undefined)));
  res.json(plato);
});
router.delete("/platos/:id", soloAdmin, (req, res) => {
  db.platos = db.platos.filter((p) => p.id !== Number(req.params.id));
  res.status(204).end();
});

module.exports = router;
