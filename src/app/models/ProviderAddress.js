"use strict";
const { Model, Sequelize } = require("sequelize");

class ProviderAddress extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        provider_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        label: { type: Sequelize.STRING(100), allowNull: true },
        street: { type: Sequelize.STRING(255), allowNull: true },
        number: { type: Sequelize.STRING(50), allowNull: true },
        complement: { type: Sequelize.STRING(255), allowNull: true },
        district: { type: Sequelize.STRING(100), allowNull: true },
        city: { type: Sequelize.STRING(100), allowNull: true },
        state: { type: Sequelize.STRING(100), allowNull: true },
        country: { type: Sequelize.STRING(100), allowNull: true },
        zipcode: { type: Sequelize.STRING(20), allowNull: true },
        location: { type: Sequelize.GEOGRAPHY("POINT", 4326), allowNull: true },
        is_primary: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: "ProviderAddress",
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        created_at: "created_at",
        updated_at: "updated_at",
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.ProviderProfile, {
      foreignKey: "provider_id",
      as: "provider",
    });
  }
}

module.exports = ProviderAddress;
