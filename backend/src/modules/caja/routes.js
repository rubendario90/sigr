const router = require("express").Router();
const { db, insertar } = require("../../config/db");
const { autenticar, permitir } = require("../../middlewares/auth");
const { httpError } = require("../../middlewares/errores");

const METODOS = ["efectivo", "tarjeta", "transferencia"];
const hoy = () => new Date().toISOString().slice(0, 10);

// Registrar el pago de un pedido entregado
router.post("/pagos", autenticar, permitir("mesero", "administrador"), (req, res, next) => {
  const { pedido_id, metodo } = req.body;
  const pedido = db.pedidos.find((p) => p.id === pedido_id);
  if (!pedido) return next(httpError(404, "Pedido no encontrado"));
  if (pedido.pagado) return next(httpError(409, "El pedido ya fue pagado"));
  if (!METODOS.includes(metodo)) return next(httpError(400, `Método de pago no válido (${METODOS.join(", ")})`));
  pedido.pagado = true;
  res.status(201).json(insertar("pagos", { pedido_id, metodo, valor: pedido.total, fecha: hoy() }));
});

// Reporte de ventas de un día: total, por método de pago y por plato
function reporte(fecha) {
  const pagos = db.pagos.filter((p) => p.fecha === fecha);
  const porMetodo = Object.fromEntries(METODOS.map((m) => [m, pagos.filter((p) => p.metodo === m).reduce((s, p) => s + p.valor, 0)]));
  const porPlato = {};
  pagos.forEach((pago) => db.pedidos.find((p) => p.id === pago.pedido_id).detalle.forEach((d) => {
    porPlato[d.nombre] = porPlato[d.nombre] || { cantidad: 0, valor: 0 };
    porPlato[d.nombre].cantidad += d.cantidad;
    porPlato[d.nombre].valor += d.cantidad * d.precio_unitario;
  }));
  return { fecha, pedidos_pagados: pagos.length, total: pagos.reduce((s, p) => s + p.valor, 0), por_metodo: porMetodo, por_plato: porPlato };
}

router.get("/reportes/diario", autenticar, permitir("administrador"), (req, res) => res.json(reporte(req.query.fecha || hoy())));

// Cierre de caja: solo una vez por día
router.post("/cierre", autenticar, permitir("administrador"), (req, res, next) => {
  const fecha = hoy();
  if (db.cierres_caja.some((c) => c.fecha === fecha)) return next(httpError(409, "La caja de hoy ya fue cerrada"));
  const r = reporte(fecha);
  res.status(201).json(insertar("cierres_caja", { fecha, total: r.total, por_metodo: r.por_metodo, cerrado_por: req.usuario.id }));
});

module.exports = router;
