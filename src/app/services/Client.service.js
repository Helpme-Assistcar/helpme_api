const AppError = require("../errors/AppError");

const { Users, ProviderProfile, ClientProfile } = require("../models");

class ClientService {
  async findClient(userId) {
    const user = await Users.findOne({
      where: { id: userId },
      attributes: ["name", "photo", "email", "phone"],
      include: [
        {
          model: ClientProfile,
          as: "clientProfile",
          required: true,
          attributes: ["user_id"],
        },
      ],
    });
    if (!user) throw new AppError(403, "Usuário não encontrado");

    return user;
  }

  async findAllProviders() {
    const users = await Users.findAll({
      attributes: ["id", "name", "photo", "email", "phone"],
      include: [
        {
          model: ProviderProfile,
          as: "providerProfile",
          required: true,
          attributes: ["id", "service_provided", "status", "avg_rating"],
          where: { status: "ONLINE" },
        },
      ],
    });

    if (!users || users.length === 0) {
      return [];
    }

    return users;
  }
}

module.exports = new ClientService();
