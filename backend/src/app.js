const express = require("express");

const app = express();
app.use(express.json());

app.use("/api/auth", require("./modules/auth/routes"));
app.use("/api/menu", require("./modules/menu/routes"));
app.use("/api/pedidos", require("./modules/pedidos/routes"));

app.get("/api/salud", (req, res) => res.json({ estado: "ok", version: require("../package.json").version }));

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: status === 500 ? "Error interno del servidor" : err.message });
});

module.exports = app;
