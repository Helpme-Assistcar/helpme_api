const ProviderReferralService = require("../services/ProviderReferral.service");

const PAYMENT_EVENTS = ["INITIAL_PURCHASE", "RENEWAL"];

class WebhookController {
  async revenueCat(req, res) {
    const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
    if (!secret || req.headers.authorization !== `Bearer ${secret}`) {
      return res.status(401).json({ message: "Não autorizado" });
    }

    try {
      const event = req.body?.event;

      if (event && PAYMENT_EVENTS.includes(event.type)) {
        await ProviderReferralService.handlePaymentEvent(event);
      }

      // RevenueCat exige 200 rápido para não reenviar o evento; outros tipos
      // de evento (CANCELLATION, EXPIRATION, etc.) são só confirmados.
      return res.status(200).json({ received: true });
    } catch (error) {
      console.error("Erro ao processar webhook do RevenueCat:", error);
      return res.status(200).json({ received: true });
    }
  }
}

module.exports = new WebhookController();
