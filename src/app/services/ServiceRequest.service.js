const AppError = require("../errors/AppError");

const { ServiceRequest } = require("../models");

class ServiceRequestService {
  async accept(req, id) {
    const serviceRequest = await ServiceRequest.findByPk(id);
    if (!serviceRequest) throw new AppError(403, "Serviço não encontrado");

    const io = req.app.get("io");
    const connectedCustomer = req.app.get("connectedCustomers");

    // 3. Envia o evento em tempo real pro profissional
    const targetSocket = connectedCustomer.get(serviceRequest?.client_id);

    if (targetSocket) {
      io.to(targetSocket).emit("new_call_customer", {
        accepted: true,
        customerId: serviceRequest?.client_id,
        serviceRequestId: serviceRequest.id,
      });
      console.log(
        `📢 Serviço do cliente: ${serviceRequest?.client_id} foi aceito.`
      );
    }

    serviceRequest.update({ accepted_at: new Date() });

    return serviceRequest;
  }

  async cancel(service_id, user_id) {
    const serviceRequest = await ServiceRequest.findByPk(service_id);
    if (!serviceRequest) throw new AppError(403, "Serviço não encontrado");

    const io = req.app.get("io");
    const connectedCustomer = req.app.get("connectedCustomers");

    // 3. Envia o evento em tempo real pro profissional
    const targetSocket = connectedCustomer.get(serviceRequest?.client_id);

    if (targetSocket) {
      io.to(targetSocket).emit("new_call_customer", {
        accepted: false,
        customerId: serviceRequest?.client_id,
        serviceRequestId: serviceRequest.id,
      });
      console.log(
        `📢 Serviço do cliente: ${serviceRequest?.client_id} foi recusado.`
      );
    }

    serviceRequest.update({ cancelled_at: new Date(), cancelled_by: user_id });

    return service;
  }
}

module.exports = new ServiceRequestService();
