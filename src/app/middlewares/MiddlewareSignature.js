const jwt = require("jsonwebtoken");
const { ProviderProfile } = require("../models");

class MiddlewareSignature {
  static async signatueIsActive(req, res, next) {
    try {
      const id = req.userId;

      const user = await ProviderProfile.findOne({
        where: { user_id: id },
        attributes: ["user_id", "plan_active"],
      });

      if (!user) throw new AppError(404, "Usuário não encontrado.");

      if (!user.plan_active) {
        return res.status(401).json({ message: "Assinatura expirada" });
      }

      return next();
    } catch (error) {
      console.error("Erro na assinatura do profissional:", error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Erro interno no servidor",
      });
    }
  }
}

module.exports = MiddlewareSignature;
