require("dotenv").config();
const appInstance = require("./app");

const PORT = process.env.SERVER_PORT || 8088;

appInstance.server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
