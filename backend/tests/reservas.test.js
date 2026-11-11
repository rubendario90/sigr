const { app, request, tokenDe } = require("./helpers");
const { reset } = require("../src/config/db");

let cliente;
beforeEach(async () => { reset(); cliente = await tokenDe("cliente"); });

const reservar = (datos) => request(app).post("/api/reservas").set("Authorization", `Bearer ${cliente}`).send(datos);

test("el cliente crea y cancela una reserva", async () => {
  const r = await reservar({ fecha: "2026-12-24", hora: "20:00", personas: 4 });
  expect(r.status).toBe(201);
  const c = await request(app).patch(`/api/reservas/${r.body.id}/cancelar`).set("Authorization", `Bearer ${cliente}`);
  expect(c.body.estado).toBe("cancelada");
});

test("valida el formato de fecha y hora", async () => {
  const r = await reservar({ fecha: "24/12/2026", hora: "8pm", personas: 2 });
  expect(r.status).toBe(400);
});
