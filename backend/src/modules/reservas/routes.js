const router = require("express").Router();
const { db, insertar } = require("../../config/db");
const { autenticar } = require("../../middlewares/auth");
const { httpError } = require("../../middlewares/errores");

router.get("/", autenticar, (req, res) => {
  // El cliente ve sus reservas; el personal ve todas, opcionalmente filtradas por fecha
  const { fecha } = req.query;
  res.json(db.reservas.filter((r) => (req.usuario.rol === "cliente" ? r.cliente_id === req.usuario.id : true))
    .filter((r) => (fecha ? r.fecha === fecha : true)));
});

router.post("/", autenticar, (req, res, next) => {
  const { fecha, hora, personas } = req.body;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha || "") || !/^\d{2}:\d{2}$/.test(hora || "")) {
    return next(httpError(400, "Fecha (aaaa-mm-dd) y hora (hh:mm) son obligatorias"));
  }
  if (!(personas > 0)) return next(httpError(400, "El número de personas debe ser mayor a cero"));
  // Primera mesa con capacidad suficiente
  const mesa = db.mesas.find((m) => m.capacidad >= personas);
  if (!mesa) return next(httpError(409, "No hay mesas disponibles para esa fecha y hora"));
  const reserva = insertar("reservas", { cliente_id: req.usuario.id, mesa_id: mesa.id, fecha, hora, personas, estado: "activa" });
  res.status(201).json(reserva);
});

router.patch("/:id/cancelar", autenticar, (req, res, next) => {
  const reserva = db.reservas.find((r) => r.id === Number(req.params.id));
  if (!reserva) return next(httpError(404, "Reserva no encontrada"));
  if (req.usuario.rol === "cliente" && reserva.cliente_id !== req.usuario.id) return next(httpError(403, "No puede cancelar esta reserva"));
  reserva.estado = "cancelada";
  res.json(reserva);
});

module.exports = router;
