const ClientService = require("../services/Client.service");

class ClientController {
  async findClient(req, res) {
    try {
      const userId = req.userId;
      const data = await ClientService.findClient(userId);
      return res.json(data);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }

  async findAllProviders(req, res) {
    const { service_provided } = req.params;
    const { lat, lng, distance } = req.query;

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radius = parseInt(distance) || 5000;

    try {
      const data = await ClientService.findAllProviders(
        service_provided,
        latitude,
        longitude,
        radius,
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

      await ClientService.updateUser(
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

module.exports = new ClientController();
