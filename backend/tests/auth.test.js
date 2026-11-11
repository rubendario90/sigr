const { app, request } = require("./helpers");
const { reset } = require("../src/config/db");

beforeEach(reset);

test("registra un usuario e inicia sesión", async () => {
  const reg = await request(app).post("/api/auth/registro")
    .send({ nombre: "Ana", correo: "ana@sigr.co", clave: "clave123", rol: "mesero" });
  expect(reg.status).toBe(201);
  const login = await request(app).post("/api/auth/login").send({ correo: "ana@sigr.co", clave: "clave123" });
  expect(login.status).toBe(200);
  expect(login.body.rol).toBe("mesero");
  expect(login.body.token).toBeDefined();
});

test("rechaza credenciales incorrectas", async () => {
  await request(app).post("/api/auth/registro").send({ nombre: "Ana", correo: "ana@sigr.co", clave: "clave123" });
  const res = await request(app).post("/api/auth/login").send({ correo: "ana@sigr.co", clave: "otra" });
  expect(res.status).toBe(401);
});

test("no permite correos duplicados", async () => {
  const datos = { nombre: "Ana", correo: "ana@sigr.co", clave: "clave123" };
  await request(app).post("/api/auth/registro").send(datos);
  const res = await request(app).post("/api/auth/registro").send(datos);
  expect(res.status).toBe(409);
});
