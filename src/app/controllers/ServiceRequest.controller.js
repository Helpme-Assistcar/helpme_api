const { ServiceRequest } = require("../models");
const ServiceRequestService = require("../services/ServiceRequest.service");

class ServiceRequestController {
  async create(req, res) {
    const { professionalId, serviceType, request_location, address_snapshot } =
      req.body;
    const { userId } = req;

    try {
      // 1. Cria o chamado no banco MySQL via Sequelize
      const serviceRequest = await ServiceRequest.create({
        client_id: userId,
        provider_id: professionalId,
        serviceType,
        status: "PENDING",
        request_location,
        address_snapshot,
      });

      // 2. Pega o socket.io do app
      const io = req.app.get("io");
      const connectedProfessionals = req.app.get("connectedProfessionals");

      // 3. Envia o evento em tempo real pro profissional
      const targetSocket = connectedProfessionals.get(professionalId);

      if (targetSocket) {
        io.to(targetSocket).emit("new_call", {
          clientId: userId,
          professionalId,
          serviceType,
          serviceRequestId: serviceRequest.id,
        });
        console.log(`📢 Chamado enviado para profissional ${professionalId}`);
      }

      return res.status(201).json(serviceRequest);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar chamado" });
    }
  }

  async accept(req, res) {
    try {
      const { service_id } = req.body;
      const data = await ServiceRequestService.accept(service_id);
      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar chamado" });
    }
  }

  async cancel(req, res) {
    try {
      const { service_id } = req.body;
      const { userId } = req;
      const data = await ServiceRequestService.cancel(service_id, userId);
      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar chamado" });
    }
  }
}

module.exports = new ServiceRequestController();
