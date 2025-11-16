const { ServiceCategory } = require("../models");

class ServiceCategoryService {
  async findCategoryNames() {
    const categoriesName = await ServiceCategory.findAll({
      attributes: ["id", "name"],
    });

    return categoriesName.map((cat) => ({
      label: cat.name,
      value: cat.name,
    }));
  }
}

module.exports = new ServiceCategoryService();
