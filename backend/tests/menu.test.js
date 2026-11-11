const { app, request, tokenDe } = require("./helpers");
const { reset } = require("../src/config/db");

beforeEach(reset);

test("el administrador crea una categoría y un plato, y el menú es público", async () => {
  const admin = await tokenDe("administrador");
  const cat = await request(app).post("/api/menu/categorias").set("Authorization", `Bearer ${admin}`).send({ nombre: "Platos fuertes" });
  expect(cat.status).toBe(201);
  const plato = await request(app).post("/api/menu/platos").set("Authorization", `Bearer ${admin}`)
    .send({ nombre: "Bandeja paisa", precio: 32000, categoria_id: cat.body.id });
  expect(plato.status).toBe(201);
  const menu = await request(app).get("/api/menu/platos");
  expect(menu.body).toHaveLength(1);
});

test("un mesero no puede modificar el menú", async () => {
  const mesero = await tokenDe("mesero");
  const res = await request(app).post("/api/menu/categorias").set("Authorization", `Bearer ${mesero}`).send({ nombre: "Postres" });
  expect(res.status).toBe(403);
});
