const ProviderService = require("../services/Provider.service");

class ProviderController {
  async findProvider(req, res) {
    try {
      const userId = req.userId;
      const data = await ProviderService.findProvider(userId);
      return res.json(data);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }

  async changeStatus(req, res) {
    try {
      const userId = req.userId;
      const { status } = req.body;

      const data = await ProviderService.changeStatus(userId, status);
      return res.json(data);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }

  async findClientService(req, res) {
    try {
      const { id } = req.params;
      const data = await ProviderService.findClientService(id);
      return res.json(data);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }

  async updateLocation(req, res) {
    try {
      const userId = req.userId;
      const { latitude, longitude } = req.body;

      const data = await ProviderService.updateLocation(
        userId,
        latitude,
        longitude,
      );
      return res.json(data);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }

  async updateUser(req, res) {
    try {
      const { userId } = req;

      const { photo, name, email, password, phone } = req.body;

      await ProviderService.updateUser(
        userId,
        photo,
        name,
        email,
        password,
        phone,
      );

      return res.status(200).json({ message: "Usuário atualizado." });
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }
}

module.exports = new ProviderController();
