const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db, insertar } = require("../../config/db");
const { httpError } = require("../../middlewares/errores");
const { SECRETO } = require("../../middlewares/auth");

const ROLES = ["cliente", "mesero", "administrador"];

router.post("/registro", (req, res, next) => {
  const { nombre, correo, clave, rol = "cliente" } = req.body;
  if (!nombre || !correo || !clave) return next(httpError(400, "Nombre, correo y clave son obligatorios"));
  if (!ROLES.includes(rol)) return next(httpError(400, "Rol no válido"));
  if (db.usuarios.some((u) => u.correo === correo)) return next(httpError(409, "El correo ya está registrado"));
  const usuario = insertar("usuarios", { nombre, correo, rol, clave_hash: bcrypt.hashSync(clave, 10) });
  res.status(201).json({ id: usuario.id, nombre, correo, rol });
});

router.post("/login", (req, res, next) => {
  const { correo, clave } = req.body;
  const usuario = db.usuarios.find((u) => u.correo === correo);
  if (!usuario || !bcrypt.compareSync(clave || "", usuario.clave_hash)) return next(httpError(401, "Credenciales incorrectas"));
  const token = jwt.sign({ id: usuario.id, rol: usuario.rol, nombre: usuario.nombre }, SECRETO, { expiresIn: "8h" });
  res.json({ token, rol: usuario.rol });
});

module.exports = router;
