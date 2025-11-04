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
      const data = await ProviderService.changeStatus(userId);
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
