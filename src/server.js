require("dotenv").config();
const appInstance = require("./app");

const PORT = process.env.SERVER_PORT || 8080; // Render fornece PORT automaticamente

appInstance.server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// Só em produção, para o ambiente de desenvolvimento não disparar e-mails reais.
if (process.env.NODE_ENV === "production") {
  require("./app/jobs/ReferralPayout.job").start();
}
