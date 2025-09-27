'use strict';
const { Model, Sequelize } = require('sequelize');

class ServiceRequest extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      client_id: { type: Sequelize.UUID, allowNull: false },
      provider_id: { type: Sequelize.UUID, allowNull: true },
      service_id: { type: Sequelize.UUID, allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM('PENDING','ACCEPTED','REJECTED','CANCELLED_CLIENT','CANCELLED_PROVIDER','IN_ROUTE','ARRIVED','WORKING','DONE','AWAITING_PAYMENT','PAID','CLOSED'),
        allowNull: false,
        defaultValue: 'PENDING'
      },
      request_location: { type: Sequelize.GEOGRAPHY('POINT', 4326), allowNull: true },
      address_snapshot: { type: Sequelize.STRING(500), allowNull: true },
      distance_km: { type: Sequelize.DECIMAL(8,3), allowNull: true },
      price_estimate: { type: Sequelize.DECIMAL(10,2), allowNull: true },
      final_price: { type: Sequelize.DECIMAL(10,2), allowNull: true },
      requested_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      accepted_at: { type: Sequelize.DATE, allowNull: true },
      arrived_at: { type: Sequelize.DATE, allowNull: true },
      started_at: { type: Sequelize.DATE, allowNull: true },
      completed_at: { type: Sequelize.DATE, allowNull: true },
      cancelled_at: { type: Sequelize.DATE, allowNull: true },
      cancelled_by: { type: Sequelize.STRING(50), allowNull: true }
    }, {
      sequelize,
      tableName: 'service_request',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.ClientProfile, { foreignKey: 'client_id', targetKey: 'user_id', as: 'client' });
    this.belongsTo(models.ProviderProfile, { foreignKey: 'provider_id', as: 'provider' });
    this.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service' });
    this.hasMany(models.RequestMessage, { foreignKey: 'request_id', as: 'messages' });
    this.hasOne(models.Review, { foreignKey: 'request_id', as: 'review' });
  }
}

module.exports = ServiceRequest;
