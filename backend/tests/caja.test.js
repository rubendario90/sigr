const { app, request, tokenDe } = require("./helpers");
const { reset } = require("../src/config/db");

let admin, mesero, pedidoId;
beforeEach(async () => {
  reset();
  admin = await tokenDe("administrador");
  mesero = await tokenDe("mesero");
  const cat = await request(app).post("/api/menu/categorias").set("Authorization", `Bearer ${admin}`).send({ nombre: "Bebidas" });
  const plato = await request(app).post("/api/menu/platos").set("Authorization", `Bearer ${admin}`)
    .send({ nombre: "Limonada", precio: 8000, categoria_id: cat.body.id });
  const pedido = await request(app).post("/api/pedidos").set("Authorization", `Bearer ${mesero}`)
    .send({ mesa_id: 2, items: [{ plato_id: plato.body.id, cantidad: 3 }] });
  pedidoId = pedido.body.id;
});

test("registra el pago y lo refleja en el reporte diario", async () => {
  const pago = await request(app).post("/api/caja/pagos").set("Authorization", `Bearer ${mesero}`).send({ pedido_id: pedidoId, metodo: "efectivo" });
  expect(pago.status).toBe(201);
  const rep = await request(app).get("/api/caja/reportes/diario").set("Authorization", `Bearer ${admin}`);
  expect(rep.body.total).toBe(24000);
  expect(rep.body.por_plato.Limonada.cantidad).toBe(3);
});

test("no permite pagar dos veces ni cerrar la caja dos veces el mismo día", async () => {
  await request(app).post("/api/caja/pagos").set("Authorization", `Bearer ${mesero}`).send({ pedido_id: pedidoId, metodo: "tarjeta" });
  const doble = await request(app).post("/api/caja/pagos").set("Authorization", `Bearer ${mesero}`).send({ pedido_id: pedidoId, metodo: "tarjeta" });
  expect(doble.status).toBe(409);
  expect((await request(app).post("/api/caja/cierre").set("Authorization", `Bearer ${admin}`)).status).toBe(201);
  expect((await request(app).post("/api/caja/cierre").set("Authorization", `Bearer ${admin}`)).status).toBe(409);
});
