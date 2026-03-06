const { literal, Op } = require("sequelize");
const AppError = require("../errors/AppError");

const { Users, ProviderProfile, ClientProfile } = require("../models");

class ClientService {
  async findClient(userId) {
    const user = await Users.findOne({
      where: { id: userId },
      attributes: ["name", "photo", "email", "phone"],
      include: [
        {
          model: ClientProfile,
          as: "clientProfile",
          required: true,
          attributes: ["user_id"],
        },
      ],
    });
    if (!user) throw new AppError(403, "Usuário não encontrado");

    return user;
  }

  async findAllProviders(service_provided, latitude, longitude, radius = 5000) {
    const providerWhere = {
      status: "ONLINE",
    };

    if (service_provided !== "all") {
      providerWhere.service_provided = service_provided;
    }

    if (latitude && longitude) {
      providerWhere[Op.and] = literal(`
      ST_DWithin(
        "providerProfile"."location",
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
        ${radius}
      )
    `);
    }

    const users = await Users.findAll({
      attributes: ["id", "name", "photo", "email", "phone"],
      include: [
        {
          model: ProviderProfile,
          as: "providerProfile",
          required: true,
          attributes: [
            "id",
            "service_provided",
            "status",
            "avg_rating",
            [
              literal(`
              ST_Distance(
                "providerProfile"."location",
                ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
              )
            `),
              "distance",
            ],
          ],
          where: providerWhere,
        },
      ],

      // ✅ ORDER BY CORRETO (repete o ST_Distance)
      order: [
        [
          literal(`
          ST_Distance(
            "providerProfile"."location",
            ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
          )
        `),
          "ASC",
        ],
      ],
    });

    return users || [];
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
}

module.exports = new ClientService();
