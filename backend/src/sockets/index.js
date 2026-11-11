// Canal de tiempo real: meseros y cocina reciben los cambios de los pedidos.
let io = null;

function iniciar(servidorHttp) {
  const { Server } = require("socket.io");
  io = new Server(servidorHttp, { cors: { origin: "*" } });
  io.on("connection", (socket) => socket.emit("bienvenida", { mensaje: "Conectado a SIGR" }));
}

function emitir(evento, datos) {
  if (io) io.emit(evento, datos);
}

module.exports = { iniciar, emitir };
