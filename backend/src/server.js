const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
require("./sockets").iniciar(server);

server.listen(PORT, () => console.log(`SIGR API escuchando en http://localhost:${PORT}`));
