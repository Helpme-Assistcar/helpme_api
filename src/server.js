require("dotenv").config();
const appInstance = require("./app");

const PORT = process.env.SERVER_PORT || 8088;

// Usa o server HTTP que criamos dentro do App (com socket.io)
appInstance.server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
