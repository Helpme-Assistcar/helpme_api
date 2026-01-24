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
    try {
      const data = await ClientService.findAllProviders(service_provided);
      return res.json(data);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }
}

module.exports = new ClientController();
