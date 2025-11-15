"use strict";
const { Model, Sequelize } = require("sequelize");

class Review extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        request_id: { type: Sequelize.UUID, allowNull: false, unique: true },
        client_id: { type: Sequelize.UUID, allowNull: false },
        provider_id: { type: Sequelize.UUID, allowNull: false },
        rating: {
          type: Sequelize.SMALLINT,
          allowNull: false,
          validate: { min: 1, max: 5 },
        },
        comment: { type: Sequelize.TEXT, allowNull: true },
      },
      {
        sequelize,
        tableName: "Review",
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        created_at: "created_at",
        updated_at: false,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.ServiceRequest, {
      foreignKey: "request_id",
      as: "request",
    });
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

module.exports = Review;
