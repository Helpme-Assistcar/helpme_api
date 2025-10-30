const AppError = require("../errors/AppError");

const { Users } = require("../models");

class ProviderService {
  async findProvider(userId) {
    const user = await Users.findOne({
      where: { id: userId },
      attributes: ["name", "photo", "email", "phone"],
    });
    if (!user) throw new AppError(403, "Usuário não encontrado");

    return user;
  }
}

module.exports = new ProviderService();
