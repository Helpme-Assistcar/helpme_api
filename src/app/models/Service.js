'use strict';
const { Model, Sequelize } = require('sequelize');

class Service extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      category_id: { type: Sequelize.UUID, allowNull: true },
      name: { type: Sequelize.STRING(150), allowNull: false, validate: { notNull: { msg: 'Nome do serviço é obrigatório.' } } },
      description: { type: Sequelize.TEXT, allowNull: true },
      unit: { type: Sequelize.STRING(50), allowNull: true }
    }, {
      sequelize,
      tableName: 'service',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.ServiceCategory, { foreignKey: 'category_id', as: 'category' });
    this.hasMany(models.ProviderService, { foreignKey: 'service_id', as: 'providerServices' });
    this.belongsToMany(models.ProviderProfile, { through: models.ProviderService, foreignKey: 'service_id', otherKey: 'provider_id', as: 'providers' });
    this.hasMany(models.ServiceRequest, { foreignKey: 'service_id', as: 'serviceRequests' });
  }
}

module.exports = Service;
