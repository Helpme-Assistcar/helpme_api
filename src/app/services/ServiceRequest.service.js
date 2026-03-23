const AppError = require("../errors/AppError");

const {
  ServiceRequest,
  Users,
  ClientProfile,
  ProviderProfile,
} = require("../models");

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
        `📢 Serviço do cliente: ${serviceRequest?.client_id} foi aceito.`,
      );
    }

    serviceRequest.update({
      accepted_at: new Date(),
      started_at: new Date(),
      status: "ACCEPTED",
    });

    return serviceRequest;
  }

  async cancel(req, service_id, user_id) {
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
        `📢 Serviço do cliente: ${serviceRequest?.client_id} foi recusado.`,
      );
    }

    serviceRequest.update({
      cancelled_at: new Date(),
      cancelled_by: user_id,
      status: "CANCELLED_PROVIDER",
    });

    return serviceRequest;
  }

  async completed(req, service_id, user_id) {
    const serviceRequest = await ServiceRequest.findByPk(service_id);
    if (!serviceRequest) throw new AppError(403, "Serviço não encontrado");

    const io = req.app.get("io");
    const connectedCustomer = req.app.get("connectedCustomers");

    // 3. Envia o evento em tempo real pro profissional
    const targetSocket = connectedCustomer.get(serviceRequest?.client_id);

    if (targetSocket) {
      io.to(targetSocket).emit("new_call_customer", {
        accepted: false,
        completed: true,
        customerId: serviceRequest?.client_id,
        serviceRequestId: serviceRequest.id,
      });
      console.log(
        `📢 Serviço do cliente: ${serviceRequest?.client_id} foi concluido.`,
      );
    }

    serviceRequest.update({ completed_at: new Date(), status: "DONE" });

    return serviceRequest;
  }

  async clientCancel(req, service_id, user_id) {
    const serviceRequest = await ServiceRequest.findByPk(service_id);
    if (!serviceRequest) throw new AppError(403, "Serviço não encontrado");

    const io = req.app.get("io");
    const connectedProfessionals = req.app.get("connectedProfessionals");

    // 3. Envia o evento em tempo real pro profissional
    const targetSocket = connectedProfessionals.get(
      serviceRequest?.provider_id,
    );

    if (targetSocket) {
      io.to(targetSocket).emit("new_call", {
        accepted: false,
        professionalId: serviceRequest?.provider_id,
        serviceRequestId: serviceRequest.id,
      });
      console.log(
        `📢 Serviço do cliente: ${serviceRequest?.client_id} foi recusado.`,
      );
    }

    serviceRequest.update({
      cancelled_at: new Date(),
      cancelled_by: user_id,
      status: "CANCELLED_CLIENT",
    });

    return serviceRequest;
  }

  async findReq(service_id) {
    const serviceRequest = await ServiceRequest.findByPk(service_id, {
      include: [
        {
          model: ClientProfile,
          as: "client",
          include: [
            {
              model: Users,
              as: "user",
            },
          ],
        },
        {
          model: ProviderProfile,
          as: "provider",
          include: [
            {
              model: Users,
              as: "user",
            },
          ],
        },
      ],
    });
    if (!serviceRequest) throw new AppError(403, "Serviço não encontrado");

    return serviceRequest;
  }

  async findAllProviderServices(userId) {
    const provider = await ProviderProfile.findOne({
      where: { user_id: userId },
      attributes: ["id"],
    });

    if (!provider) throw new AppError(403, "Profissional não encontrado");

    const services = await ServiceRequest.findAll({
      where: { provider_id: provider.id },
      include: [
        {
          model: ClientProfile,
          as: "client",
          include: [
            {
              model: Users,
              as: "user",
            },
          ],
        },
      ],
    });
    if (!services) throw new AppError(403, "Serviços não encontrados");

    return services;
  }

  async findAllCustomerServices(userId) {
    const client = await ClientProfile.findOne({
      where: { user_id: userId },
      attributes: ["user_id"],
    });

    if (!client) throw new AppError(403, "Cliente não encontrado");

    const services = await ServiceRequest.findAll({
      where: { client_id: client.user_id },
      include: [
        {
          model: ProviderProfile,
          as: "provider",
          include: [
            {
              model: Users,
              as: "user",
            },
          ],
        },
      ],
    });
    if (!services) throw new AppError(403, "Serviços não encontrados");

    return services;
  }
}

module.exports = new ServiceRequestService();
