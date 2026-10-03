"use strict";
const { Model, Sequelize } = require("sequelize");

class ProviderReferral extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        client_id: {
          type: Sequelize.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "ID de cliente inválido." },
            notNull: { msg: "client_id é obrigatório." },
          },
        },
        provider_id: {
          type: Sequelize.UUID,
          allowNull: false,
          unique: true,
          validate: {
            isUUID: { args: 4, msg: "ID de profissional inválido." },
            notNull: { msg: "provider_id é obrigatório." },
          },
        },
        amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 39.9,
          validate: { min: 0 },
        },
        status: {
          type: Sequelize.ENUM("PENDING", "CONFIRMED", "NOTIFIED", "PAID"),
          allowNull: false,
          defaultValue: "PENDING",
        },
        confirmed_at: { type: Sequelize.DATE, allowNull: true },
        notified_at: { type: Sequelize.DATE, allowNull: true },
        paid_at: { type: Sequelize.DATE, allowNull: true },
      },
      {
        sequelize,
        tableName: "ProviderReferral",
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        created_at: "created_at",
        updated_at: "updated_at",
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.ClientProfile, {
      foreignKey: "client_id",
      targetKey: "user_id",
      as: "client",
    });
    this.belongsTo(models.ProviderProfile, {
      foreignKey: "provider_id",
      as: "provider",
    });
  }
}

module.exports = ProviderReferral;
