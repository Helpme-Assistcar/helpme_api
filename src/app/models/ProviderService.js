"use strict";
const { Model, Sequelize } = require("sequelize");

class ProviderService extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        provider_id: { type: Sequelize.UUID, allowNull: false },
        service_id: { type: Sequelize.UUID, allowNull: false },
        price_min: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          validate: { min: 0 },
        },
        price_max: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          validate: { min: 0 },
        },
        active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: "ProviderService",
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        created_at: "created_at",
        updated_at: "updated_at",
        indexes: [
          {
            unique: true,
            fields: ["provider_id", "service_id"],
            name: "uq_provider_service_provider_id_service_id",
          },
        ],
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.ProviderProfile, {
      foreignKey: "provider_id",
      as: "provider",
    });
    this.belongsTo(models.Service, { foreignKey: "service_id", as: "service" });
  }
}

module.exports = ProviderService;
