const request = require("supertest");
const app = require("../src/app");

// Registra un usuario con el rol indicado y devuelve su token
async function tokenDe(rol) {
  const correo = `${rol}${Date.now()}${Math.random()}@sigr.co`;
  await request(app).post("/api/auth/registro").send({ nombre: rol, correo, clave: "clave123", rol });
  const res = await request(app).post("/api/auth/login").send({ correo, clave: "clave123" });
  return res.body.token;
}

module.exports = { app, request, tokenDe };
