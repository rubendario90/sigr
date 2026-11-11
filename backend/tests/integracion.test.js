// Prueba de integración del flujo completo de un día de operación
const { app, request, tokenDe } = require("./helpers");
const { reset } = require("../src/config/db");

test("flujo completo: menú → reserva → pedido → preparación → pago → cierre", async () => {
  reset();
  const [admin, mesero, cliente] = [await tokenDe("administrador"), await tokenDe("mesero"), await tokenDe("cliente")];
  const auth = (t) => ({ Authorization: `Bearer ${t}` });

  const cat = await request(app).post("/api/menu/categorias").set(auth(admin)).send({ nombre: "Almuerzos" });
  const plato = await request(app).post("/api/menu/platos").set(auth(admin)).send({ nombre: "Sancocho", precio: 28000, categoria_id: cat.body.id });
  expect((await request(app).post("/api/reservas").set(auth(cliente)).send({ fecha: "2026-12-20", hora: "13:00", personas: 2 })).status).toBe(201);

  const pedido = await request(app).post("/api/pedidos").set(auth(mesero)).send({ mesa_id: 1, items: [{ plato_id: plato.body.id, cantidad: 2 }] });
  for (const estado of ["en_preparacion", "listo", "entregado"]) {
    expect((await request(app).patch(`/api/pedidos/${pedido.body.id}/estado`).set(auth(mesero)).send({ estado })).status).toBe(200);
  }
  expect((await request(app).post("/api/caja/pagos").set(auth(mesero)).send({ pedido_id: pedido.body.id, metodo: "transferencia" })).status).toBe(201);
  const cierre = await request(app).post("/api/caja/cierre").set(auth(admin));
  expect(cierre.body.total).toBe(56000);
});
