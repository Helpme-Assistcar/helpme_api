const axios = require("axios");
const AppError = require("../errors/AppError");

class RevenueCatService {
  // Consulta na API do RevenueCat se o app user id tem o entitlement ativo.
  // Não confiamos no que o app diz: a verificação é feita no servidor.
  async getEntitlementStatus(appUserId) {
    const entitlementId = process.env.REVENUECAT_ENTITLEMENT_ID || "Help me Pro";

    let data;
    try {
      const response = await axios.get(
        `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REVENUECAT_SECRET_API_KEY}`,
          },
          timeout: 10000,
        },
      );
      data = response.data;
    } catch (error) {
      console.error("Erro ao consultar o RevenueCat:", error.message);
      throw new AppError(
        503,
        "Não foi possível confirmar o pagamento agora. Tente novamente.",
      );
    }

    const entitlement = data?.subscriber?.entitlements?.[entitlementId];
    if (!entitlement) return { active: false, isTrial: false };

    const expiresAt = entitlement.expires_date
      ? new Date(entitlement.expires_date)
      : null;
    const active = !expiresAt || expiresAt > new Date();

    const subscription =
      data.subscriber.subscriptions?.[entitlement.product_identifier];

    return { active, isTrial: subscription?.period_type === "trial" };
  }
}

module.exports = new RevenueCatService();
