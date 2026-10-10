// Comando manual do e-mail de indicações.
//
//   npm run referrals:payout                         simula (não envia nada)
//   npm run referrals:payout -- --test-to=voce@x.com envia o e-mail real para
//                                                    você, sem marcar nada
//   npm run referrals:payout -- --send               envia aos clientes e marca
//                                                    como NOTIFIED (pede confirmação)
//   npm run referrals:payout -- --send --yes         idem, sem pedir confirmação
//
// Usa o banco apontado pelo .env — confira o "Ambiente" impresso no início.
require("dotenv").config({ quiet: true });
const readline = require("readline");

const EMAIL_REGEX = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function parseArgs(argv) {
  const args = { send: false, yes: false, help: false, testTo: null };
  for (const arg of argv) {
    if (arg === "--send") args.send = true;
    else if (arg === "--yes") args.yes = true;
    else if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg.startsWith("--test-to=")) args.testTo = arg.slice(10).trim();
    else throw new Error(`Argumento desconhecido: ${arg}`);
  }
  return args;
}

function mask(email) {
  const [user, domain] = String(email).split("@");
  if (!domain) return "***";
  return `${user.slice(0, 2)}***@${domain}`;
}

const brl = (n) =>
  Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function askConfirmation(question, input = process.stdin) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input, output: process.stdout });
    let answered = false;
    rl.question(question, (answer) => {
      answered = true;
      rl.close();
      resolve(answer.trim() === "ENVIAR");
    });
    // stdin fechado sem resposta (ex.: execução não interativa) = não confirma.
    rl.on("close", () => {
      if (!answered) resolve(false);
    });
  });
}

function printPlan(results) {
  if (!results.length) {
    console.log("  (nenhuma indicação CONFIRMED pendente de notificação)");
    return;
  }
  for (const r of results) {
    console.log(
      `  - ${r.name} <${mask(r.email)}> | ${r.referralCount} indicação(ões) | ${brl(r.totalAmount)}`,
    );
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    console.log(
      "Uso: npm run referrals:payout -- [--test-to=email] [--send [--yes]]",
    );
    return 0;
  }
  if (args.send && args.testTo) {
    throw new Error("Use --send OU --test-to, não os dois juntos.");
  }
  if (args.testTo && !EMAIL_REGEX.test(args.testTo)) {
    throw new Error(`E-mail inválido em --test-to: ${args.testTo}`);
  }

  // Inicializa conexão e models (mesmo caminho do app.js).
  const { mainConnection } = require("../database/index");
  const dbConfig = require("../config/database");
  const ProviderReferralService = require("../app/services/ProviderReferral.service");
  const EmailService = require("../app/services/Email.service");

  const mode = args.send ? "ENVIO REAL" : args.testTo ? "TESTE" : "SIMULAÇÃO";
  console.log(
    `Ambiente: NODE_ENV=${process.env.NODE_ENV || "(não definido)"} | banco: ${dbConfig.dialect}`,
  );
  console.log(`Modo: ${mode}\n`);

  let exitCode = 0;
  try {
    // 1) Sempre começa mostrando o que seria enviado.
    const plan = await ProviderReferralService.runMonthlyPayoutCheck({
      dryRun: true,
    });
    console.log(`Clientes com indicações a notificar: ${plan.results.length}`);
    printPlan(plan.results);

    if (!args.send && !args.testTo) {
      console.log("\nNada foi enviado. Use --test-to=<email> ou --send.");
      return 0;
    }

    // 2) Teste: e-mail real para o endereço informado, sem tocar no banco.
    if (args.testTo) {
      console.log(`\nEnviando e-mail(s) de TESTE para ${mask(args.testTo)}...`);
      if (plan.results.length) {
        const result = await ProviderReferralService.runMonthlyPayoutCheck({
          redirectTo: args.testTo,
        });
        for (const r of result.results) {
          console.log(`  - ${r.name}: ${r.outcome}${r.error ? ` (${r.error})` : ""}`);
          if (r.outcome !== "TEST_SENT") exitCode = 1;
        }
      } else {
        console.log("  Sem indicações pendentes: enviando um exemplo fictício.");
        await EmailService.sendReferralPayoutEmail({
          to: args.testTo,
          clientName: "Cliente Exemplo",
          referralCount: 2,
          totalAmount: 79.8,
          test: true,
        });
        console.log("  - Cliente Exemplo: TEST_SENT");
      }
      console.log("\nNenhum status foi alterado no banco.");
      return exitCode;
    }

    // 3) Envio real, com confirmação.
    if (!plan.results.length) return 0;
    if (!args.yes) {
      const ok = await askConfirmation(
        `\nIsso vai ENVIAR ${plan.results.length} e-mail(s) reais aos clientes acima e marcar como NOTIFIED.\nDigite ENVIAR para confirmar: `,
      );
      if (!ok) {
        console.log("Cancelado. Nada foi enviado.");
        return 0;
      }
    }

    const result = await ProviderReferralService.runMonthlyPayoutCheck();
    console.log(`\nNotificados: ${result.clientsNotified}`);
    for (const r of result.results) {
      console.log(`  - ${r.name}: ${r.outcome}${r.error ? ` (${r.error})` : ""}`);
      if (r.outcome !== "SENT") exitCode = 1;
    }
    return exitCode;
  } finally {
    await mainConnection.close();
  }
}

if (require.main === module) {
  main()
    .then((code) => process.exit(code))
    .catch((error) => {
      console.error(`Erro: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { parseArgs, mask, askConfirmation };
