require("dotenv").config();
const appInstance = require("./app");

const PORT = process.env.SERVER_PORT || 8080; // Render fornece PORT automaticamente

appInstance.server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
