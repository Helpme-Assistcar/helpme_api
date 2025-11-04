const AppError = require("../errors/AppError");

const { Users, ProviderProfile } = require("../models");

class ProviderService {
  async findProvider(userId) {
    const user = await Users.findOne({
      where: { id: userId },
      attributes: ["name", "photo", "email", "phone"],
    });
    if (!user) throw new AppError(403, "Usuário não encontrado");

    return user;
  }

  async changeStatus(userId) {
    const provider = await ProviderProfile.findOne({
      where: { user_id: userId },
      attributes: ["id", "status"],
    });

    if (!provider) throw new AppError(403, "Profissional não encontrado");

    const newStatus = provider.status === "OFFLINE" ? "ONLINE" : "OFFLINE";

    await provider.update({ status: newStatus });

    return provider; // opcional, pode retornar o novo status se quiser
  }
}

module.exports = new ProviderService();
