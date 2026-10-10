const { Op } = require("sequelize");
const EmailService = require("./Email.service");

const {
  ProviderProfile,
  ProviderReferral,
  ClientProfile,
  Users,
} = require("../models");

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

class ProviderReferralService {
  // Chamado pelo webhook do RevenueCat (INITIAL_PURCHASE / RENEWAL). O
  // pagamento costuma acontecer com um ID anônimo, então casamos o
  // profissional por qualquer um dos IDs do evento: o ID anônimo guardado no
  // cadastro, ou o nosso user_id (depois do Purchases.logIn).
  async handlePaymentEvent(event) {
    const candidateIds = [
      ...new Set(
        [
          event.app_user_id,
          event.original_app_user_id,
          ...(event.aliases || []),
        ].filter(Boolean),
      ),
    ];
    const uuidIds = candidateIds.filter((id) => UUID_REGEX.test(id));

    const provider = await ProviderProfile.findOne({
      where: {
        [Op.or]: [
          { revenuecat_app_user_id: candidateIds },
          ...(uuidIds.length ? [{ user_id: uuidIds }] : []),
        ],
      },
    });
    if (!provider) {
      // Evento de alguém que não é profissional nosso (ex.: usuário de teste
      // do RevenueCat) ou compra ainda sem cadastro — ignora silenciosamente.
      return { handled: false };
    }

    await provider.update({
      plan_active: true,
      last_payment: new Date(),
    });

    // Em período de teste ainda não houve cobrança: a indicação só vale
    // quando o primeiro pagamento real acontece (conversão do teste = RENEWAL).
    if (event.period_type !== "TRIAL") {
      const referral = await ProviderReferral.findOne({
        where: { provider_id: provider.id, status: "PENDING" },
      });
      if (referral) {
        await referral.update({
          status: "CONFIRMED",
          confirmed_at: new Date(),
        });
      }
    }

    return { handled: true, providerId: provider.id };
  }

  // Chamado mensalmente pelo job interno (ReferralPayout.job) e pelo comando
  // manual. Notifica por e-mail todo cliente com indicações CONFIRMED ainda
  // não notificadas e marca essas indicações como NOTIFIED — o status é o que
  // impede reenvio.
  //
  // Modos:
  //  - dryRun: não envia nada nem altera o banco, só devolve o que seria feito.
  //  - redirectTo: envia o e-mail real, mas para este endereço (teste), sem
  //    marcar nada como NOTIFIED.
  async runMonthlyPayoutCheck({ dryRun = false, redirectTo = null } = {}) {
    const now = new Date();

    const referrals = await ProviderReferral.findAll({
      where: { status: "CONFIRMED" },
      include: [
        {
          model: ClientProfile,
          as: "client",
          include: [{ model: Users, as: "user", attributes: ["name", "email"] }],
        },
      ],
    });

    const byClient = new Map();
    for (const referral of referrals) {
      const clientId = referral.client_id;
      if (!byClient.has(clientId)) byClient.set(clientId, []);
      byClient.get(clientId).push(referral);
    }

    const results = [];
    for (const [clientId, clientReferrals] of byClient) {
      const user = clientReferrals[0].client?.user;
      if (!user?.email) continue;

      const totalAmount = clientReferrals.reduce(
        (sum, r) => sum + Number(r.amount),
        0,
      );

      const entry = {
        clientId,
        name: user.name,
        email: user.email,
        referralCount: clientReferrals.length,
        totalAmount,
      };

      if (dryRun) {
        results.push({ ...entry, outcome: "SIMULATED" });
        continue;
      }

      let sent = false;
      try {
        await EmailService.sendReferralPayoutEmail({
          to: redirectTo || user.email,
          clientName: user.name,
          referralCount: clientReferrals.length,
          totalAmount,
          test: Boolean(redirectTo),
        });
        sent = true;

        if (!redirectTo) {
          await ProviderReferral.update(
            { status: "NOTIFIED", notified_at: new Date() },
            { where: { id: clientReferrals.map((r) => r.id) } },
          );
        }

        results.push({ ...entry, outcome: redirectTo ? "TEST_SENT" : "SENT" });
      } catch (error) {
        results.push({
          ...entry,
          // Se o e-mail saiu mas o status não foi gravado, o cliente seria
          // avisado de novo na próxima execução — por isso é um caso à parte.
          outcome: sent ? "SENT_NOT_MARKED" : "FAILED",
          error: error.message,
        });
      }
    }

    return {
      checkedAt: now,
      clientsNotified: results.filter((r) => r.outcome === "SENT").length,
      results,
    };
  }
}

module.exports = new ProviderReferralService();
