"use strict";
const { Model, Sequelize } = require("sequelize");

class FavoriteProvider extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        client_id: { type: Sequelize.UUID, allowNull: false },
        provider_id: { type: Sequelize.UUID, allowNull: false },
      },
      {
        sequelize,
        tableName: "FavoriteProvider",
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        created_at: "created_at",
        updated_at: false,
        indexes: [
          {
            unique: true,
            fields: ["client_id", "provider_id"],
            name: "uq_favorite_provider_client_provider",
          },
        ],
      }
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

module.exports = FavoriteProvider;
