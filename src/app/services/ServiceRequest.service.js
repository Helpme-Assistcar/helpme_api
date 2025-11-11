const AppError = require("../errors/AppError");

const { ServiceRequest } = require("../models");

class ServiceRequestService {
  async accept(id) {
    const service = await ServiceRequest.findByPk(id);
    if (!service) throw new AppError(403, "Serviço não encontrado");

    service.update({ accepted_at: new Date() });

    return service;
  }

  async cancel(service_id, user_id) {
    const service = await ServiceRequest.findByPk(service_id);
    if (!service) throw new AppError(403, "Serviço não encontrado");

    service.update({ cancelled_at: new Date(), cancelled_by: user_id });

    return service;
  }
}

module.exports = new ServiceRequestService();
