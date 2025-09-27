'use strict';
const { Model, Sequelize } = require('sequelize');

class ProviderPresence extends Model {
  static init(sequelize) {
    super.init({
      provider_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      current_position: { type: Sequelize.GEOGRAPHY('POINT', 4326), allowNull: true },
      status: { type: Sequelize.ENUM('ONLINE','OFFLINE','BUSY'), allowNull: false, defaultValue: 'OFFLINE' }
    }, {
      sequelize,
      tableName: 'provider_presence',
      underscored: true,
      timestamps: true,
      createdAt: false,
      updatedAt: 'updated_at'
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.ProviderProfile, { foreignKey: 'provider_id', as: 'provider' });
  }
}

module.exports = ProviderPresence;
