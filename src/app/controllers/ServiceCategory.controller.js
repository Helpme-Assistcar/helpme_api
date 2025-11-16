const { ServiceRequest } = require("../models");
const ServiceCategoryService = require("../services/ServiceCategory.service");

class ServiceCategoryController {
  async findNameCategories(_req, res) {
    try {
      const data = await ServiceCategoryService.findCategoryNames();
      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar chamado" });
    }
  }
}

module.exports = new ServiceCategoryController();
