const { literal } = require("sequelize");
const AppError = require("../errors/AppError");

const {
  Users,
  ProviderProfile,
  ServiceRequest,
  ClientProfile,
} = require("../models");

class ProviderService {
  async findProvider(userId) {
    const user = await Users.findOne({
      where: { id: userId },
      attributes: ["name", "photo", "email", "phone"],
      include: [
        {
          model: ProviderProfile,
          as: "providerProfile",
          required: true,
          attributes: ["id", "service_provided", "status", "avg_rating"],
        },
      ],
    });
    if (!user) throw new AppError(403, "Usuário não encontrado");

    return user;
  }

  async changeStatus(userId, status) {
    const provider = await ProviderProfile.findOne({
      where: { user_id: userId },
      attributes: ["id", "status"],
    });

    if (!provider) throw new AppError(403, "Profissional não encontrado");

    const newStatus = status
      ? status
      : provider.status === "OFFLINE"
        ? "ONLINE"
        : "OFFLINE";

    await provider.update({ status: newStatus });

    return provider; // opcional, pode retornar o novo status se quiser
  }

  async findClientService(id) {
    const service = await ServiceRequest.findByPk(id, {
      include: [
        {
          model: ClientProfile,
          as: "client",
          required: true,
          include: [
            {
              model: Users,
              as: "user",
              required: true,
              attributes: ["name", "photo", "email", "phone"],
            },
          ],
        },
      ],
    });

    if (!service) throw new AppError(403, "Serviço não encontrado");

    return service;
  }

  async updateLocation(userId, latitude, longitude) {
    await ProviderProfile.update(
      {
        latitude,
        longitude,
        location: literal(
          `ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography`,
        ),
      },
      {
        where: { user_id: userId },
      },
    );
  }

  async updateUser(id, photo, name, email, password, phone) {
    const transaction = await Users.sequelize.transaction();

    try {
      const user = await Users.findByPk(id, {
        attributes: { exclude: ["password"] },
        transaction,
      });

      if (!user) throw new AppError(404, "Usuário não encontrado.");

      let profilePhoto = user.photo;
      // if (photo && typeof photo === "string") {
      //   const isFirebasePhoto = photo.includes(
      //     "firebasestorage.googleapis.com",
      //   );
      //   if (!isFirebasePhoto) {
      //     const resizedImage = await ImageManager.resizeImage(photo);

      //     profilePhoto = await FirebaseManager.sendFileToFirebase(
      //       "example-url",
      //       resizedImage,
      //       "image/jpeg",
      //     );
      //   }
      // }

      let passwordUpdate = undefined;

      if (password?.length) passwordUpdate = password;

      await user.update(
        {
          photo: profilePhoto,
          email,
          name,
          password: passwordUpdate,
          phone,
        },
        { transaction },
      );

      // Confirma a transação
      await transaction.commit();

      return user;
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      throw new AppError(
        error.statusCode || 500,
        error.message || "Erro ao atualizar o usuário.",
      );
    }
  }

  async deleteUser(id) {
    const transaction = await Users.sequelize.transaction();

    try {
      const user = await Users.findByPk(id, { transaction });

      if (!user) throw new AppError(404, "Usuário não encontrado.");

      await user.update({ deleted_at: new Date() }, { transaction });

      await transaction.commit();

      return { message: "Usuário desativado com sucesso." };
    } catch (error) {
      await transaction.rollback();

      throw new AppError(
        error.statusCode || 500,
        error.message || "Erro ao deletar o usuário.",
      );
    }
  }
}

module.exports = new ProviderService();
