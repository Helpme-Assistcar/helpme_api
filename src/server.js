require("dotenv").config();
const appInstance = require("./app");

const PORT = process.env.SERVER_PORT || 8080; // Render fornece PORT automaticamente

appInstance.server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

// O job mensal envia e-mails reais, então só liga onde ENABLE_REFERRAL_JOB=true
// (definir apenas no servidor de produção). Isso evita disparo duplicado se a
// API também estiver rodando em outra máquina com o mesmo banco.
if (process.env.ENABLE_REFERRAL_JOB === "true") {
  require("./app/jobs/ReferralPayout.job").start();
  console.log("📧 Job mensal de indicações ATIVADO");
} else {
  console.log(
    "📧 Job mensal de indicações desativado (defina ENABLE_REFERRAL_JOB=true para ativar)",
  );
}
