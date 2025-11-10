const AppError = require("../errors/AppError");

const {
  Users,
  ProviderProfile,
  ServiceRequest,
  ClientProfile,
} = require("../models");

class ProviderService {
  async findProvider(userId) {
    const user = await Users.findOne({
      where: { id: userId },
      attributes: ["name", "photo", "email", "phone"],
      include: [
        {
          model: ProviderProfile,
          as: "providerProfile",
          required: true,
          attributes: ["id", "service_provided", "status", "avg_rating"],
        },
      ],
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

  async findClientService(id) {
    const service = await ServiceRequest.findByPk(id, {
      include: [
        {
          model: ClientProfile,
          as: "client",
          required: true,
          include: [
            {
              model: Users,
              as: "user",
              required: true,
              attributes: ["name", "photo", "email", "phone"],
            },
          ],
        },
      ],
    });

    if (!service) throw new AppError(403, "Serviço não encontrado");

    return service;
  }
}

module.exports = new ProviderService();
