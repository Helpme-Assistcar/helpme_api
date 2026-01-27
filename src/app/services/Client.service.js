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
}

module.exports = new ClientService();
