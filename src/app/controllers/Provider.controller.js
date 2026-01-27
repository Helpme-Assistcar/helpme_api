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
      console.log("========================================");
      console.log("userId");
      console.log(userId);
      console.log(status);
      console.log("========================================");

      const data = await ProviderService.changeStatus(userId, status);
      console.log("========================================");
      console.log("Finalizou o changeStatus");
      console.log("========================================");
      return res.json(data);
    } catch (error) {
      console.log("========================================");
      console.log("error changeStatus");
      console.log(error);
      console.log("========================================");
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
      console.log("========================================");
      console.log(error);
      console.log("========================================");
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }
}

module.exports = new ProviderController();
