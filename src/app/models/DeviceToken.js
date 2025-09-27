'use strict';
const { Model, Sequelize } = require('sequelize');

class DeviceToken extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      provider_id: { type: Sequelize.UUID, allowNull: true },
      user_id: { type: Sequelize.UUID, allowNull: true },
      platform: { type: Sequelize.ENUM('ios','android','web'), allowNull: false },
      token: { type: Sequelize.STRING(500), allowNull: false, unique: true },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }
    }, {
      sequelize,
      tableName: 'device_token',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.ProviderProfile, { foreignKey: 'provider_id', as: 'provider' });
    this.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
  }
}

module.exports = DeviceToken;
