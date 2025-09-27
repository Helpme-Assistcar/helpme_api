"use strict";
const { Model, Sequelize } = require("sequelize");

class ProviderPayment extends Model {
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
        payer_user_id: { type: Sequelize.UUID, allowNull: false },
        payment_type: {
          type: Sequelize.ENUM("ONBOARDING", "SUBSCRIPTION", "COMMISSION"),
          allowNull: true,
        },
        period_start: { type: Sequelize.DATE, allowNull: true },
        period_end: { type: Sequelize.DATE, allowNull: true },
        method: {
          type: Sequelize.ENUM("CARD", "PIX", "CASH"),
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM(
            "REQUIRING_ACTION",
            "AUTHORIZED",
            "CAPTURED",
            "CANCELED",
            "REFUNDED",
            "FAILED"
          ),
          allowNull: true,
        },
        payment_provider: { type: Sequelize.STRING(120), allowNull: true },
        provider_payment_id: { type: Sequelize.STRING(200), allowNull: true },
        amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          validate: { min: 0 },
        },
        currency: {
          type: Sequelize.CHAR(3),
          allowNull: true,
          defaultValue: "BRL",
        },
        paid_at: { type: Sequelize.DATE, allowNull: true },
      },
      {
        sequelize,
        tableName: "provider_payment",
        underscored: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.ProviderProfile, {
      foreignKey: "provider_id",
      as: "provider",
    });
    this.belongsTo(models.Users, { foreignKey: "payer_user_id", as: "payer" });
  }
}

module.exports = ProviderPayment;
