const cron = require("node-cron");
const ProviderReferralService = require("../services/ProviderReferral.service");

// Todo dia 1º às 09:00 (horário de Brasília): avisa por e-mail cada cliente
// com indicações confirmadas e ainda não notificadas.
const SCHEDULE = "0 9 1 * *";

function start() {
  cron.schedule(
    SCHEDULE,
    async () => {
      try {
        const result = await ProviderReferralService.runMonthlyPayoutCheck();
        console.log(
          `📧 Job de indicações: ${result.clientsNotified} cliente(s) notificado(s)`,
        );
      } catch (error) {
        console.error("Erro no job mensal de indicações:", error);
      }
    },
    { timezone: "America/Sao_Paulo" },
  );
}

module.exports = { start };
