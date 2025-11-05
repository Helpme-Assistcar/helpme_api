const AppError = require("../errors/AppError");

const { Users, ProviderProfile } = require("../models");

class ClientService {
  async findAllProviders() {
    const users = await Users.findAll({
      attributes: ["id", "name", "photo", "email", "phone"],
      include: [
        {
          model: ProviderProfile,
          as: "providerProfile",
          required: true,
          attributes: ["service_provided", "status", "avg_rating"],
          where: { status: "ONLINE" },
        },
      ],
    });

    if (!users || users.length === 0) {
      throw new AppError(403, "Nenhum provedor encontrado");
    }

    return users;
  }
}

module.exports = new ClientService();
