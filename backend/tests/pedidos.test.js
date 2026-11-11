const { app, request, tokenDe } = require("./helpers");
const { reset } = require("../src/config/db");

let admin, mesero, platoId;
beforeEach(async () => {
  reset();
  admin = await tokenDe("administrador");
  mesero = await tokenDe("mesero");
  const cat = await request(app).post("/api/menu/categorias").set("Authorization", `Bearer ${admin}`).send({ nombre: "Sopas" });
  const plato = await request(app).post("/api/menu/platos").set("Authorization", `Bearer ${admin}`)
    .send({ nombre: "Ajiaco", precio: 25000, categoria_id: cat.body.id });
  platoId = plato.body.id;
});

test("el mesero registra un pedido y se calcula el total", async () => {
  const res = await request(app).post("/api/pedidos").set("Authorization", `Bearer ${mesero}`)
    .send({ mesa_id: 1, items: [{ plato_id: platoId, cantidad: 2 }] });
  expect(res.status).toBe(201);
  expect(res.body.total).toBe(50000);
  expect(res.body.estado).toBe("recibido");
});

test("los estados avanzan en orden y no se pueden saltar", async () => {
  const p = await request(app).post("/api/pedidos").set("Authorization", `Bearer ${mesero}`)
    .send({ mesa_id: 1, items: [{ plato_id: platoId }] });
  const salto = await request(app).patch(`/api/pedidos/${p.body.id}/estado`).set("Authorization", `Bearer ${mesero}`).send({ estado: "listo" });
  expect(salto.status).toBe(400);
  const ok = await request(app).patch(`/api/pedidos/${p.body.id}/estado`).set("Authorization", `Bearer ${mesero}`).send({ estado: "en_preparacion" });
  expect(ok.body.estado).toBe("en_preparacion");
});
