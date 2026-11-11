const router = require("express").Router();
const { db, insertar } = require("../../config/db");
const { autenticar, permitir } = require("../../middlewares/auth");
const { httpError } = require("../../middlewares/errores");
const { emitir } = require("../../sockets");

const ESTADOS = ["recibido", "en_preparacion", "listo", "entregado"];
const personal = [autenticar, permitir("mesero", "administrador")];

router.get("/", personal, (req, res) => {
  const { estado } = req.query;
  res.json(db.pedidos.filter((p) => (estado ? p.estado === estado : true)));
});

router.post("/", personal, (req, res, next) => {
  const { mesa_id, items } = req.body;
  if (!db.mesas.some((m) => m.id === mesa_id)) return next(httpError(400, "La mesa no existe"));
  if (!Array.isArray(items) || items.length === 0) return next(httpError(400, "El pedido debe tener al menos un plato"));
  const detalle = [];
  for (const { plato_id, cantidad = 1 } of items) {
    const plato = db.platos.find((p) => p.id === plato_id);
    if (!plato || !plato.disponible) return next(httpError(400, `El plato ${plato_id} no está disponible`));
    detalle.push({ plato_id, nombre: plato.nombre, cantidad, precio_unitario: plato.precio });
  }
  const total = detalle.reduce((s, d) => s + d.cantidad * d.precio_unitario, 0);
  const pedido = insertar("pedidos", { mesa_id, mesero_id: req.usuario.id, estado: "recibido", detalle, total,
    fecha: new Date().toISOString(), pagado: false });
  emitir("pedido:nuevo", pedido);
  res.status(201).json(pedido);
});

router.patch("/:id/estado", personal, (req, res, next) => {
  const pedido = db.pedidos.find((p) => p.id === Number(req.params.id));
  if (!pedido) return next(httpError(404, "Pedido no encontrado"));
  const { estado } = req.body;
  // Los estados solo avanzan en orden: recibido → en_preparacion → listo → entregado
  if (ESTADOS.indexOf(estado) !== ESTADOS.indexOf(pedido.estado) + 1) {
    return next(httpError(400, `No se puede pasar de "${pedido.estado}" a "${estado}"`));
  }
  pedido.estado = estado;
  emitir("pedido:estado", { id: pedido.id, estado });
  res.json(pedido);
});

module.exports = router;
