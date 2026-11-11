const jwt = require("jsonwebtoken");
const { httpError } = require("./errores");

const SECRETO = process.env.JWT_SECRET || "secreto_de_desarrollo";

function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization || "").split(" ");
  if (tipo !== "Bearer" || !token) return next(httpError(401, "Token requerido"));
  try {
    req.usuario = jwt.verify(token, SECRETO);
    next();
  } catch {
    next(httpError(401, "Token inválido o vencido"));
  }
}

// Permite el acceso solo a los roles indicados
const permitir = (...roles) => (req, res, next) =>
  roles.includes(req.usuario.rol) ? next() : next(httpError(403, "No tiene permisos para esta acción"));

module.exports = { autenticar, permitir, SECRETO };
