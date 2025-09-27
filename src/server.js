require("dotenv").config();

const http = require("http");
const app = require("./app");

const PORT = process.env.SERVER_PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
