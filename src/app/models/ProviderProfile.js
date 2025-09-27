'use strict';
const { Model, Sequelize } = require('sequelize');

class ProviderProfile extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        validate: {
          isUUID: { args: 4, msg: 'ID de usuário inválido.' },
          notNull: { msg: 'user_id é obrigatório.' }
        }
      },
      display_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
        validate: {
          len: { args: [2, 255], msg: 'Nome de exibição deve ter entre 2 e 255 caracteres.' }
        }
      },
      bio: { type: Sequelize.TEXT, allowNull: true },
      service_radius_km: { type: Sequelize.DECIMAL(5,2), allowNull: true, validate: { min: 0 } },
      status: { type: Sequelize.ENUM('ONLINE','OFFLINE','BUSY'), allowNull: false, defaultValue: 'OFFLINE' },
      avg_rating: { type: Sequelize.DECIMAL(3,2), allowNull: false, defaultValue: 0, validate: { min: 0, max: 5 } },
      rating_count: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } }
    }, {
      sequelize,
      tableName: 'provider_profile',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
    this.hasOne(models.ProviderPresence, { foreignKey: 'provider_id', as: 'presence' });
    this.hasMany(models.ProviderAddress, { foreignKey: 'provider_id', as: 'addresses' });
    this.hasMany(models.ProviderService, { foreignKey: 'provider_id', as: 'providerServices' });
    this.belongsToMany(models.Service, { through: models.ProviderService, foreignKey: 'provider_id', otherKey: 'service_id', as: 'services' });
    this.hasMany(models.ServiceRequest, { foreignKey: 'provider_id', as: 'serviceRequests' });
    this.hasMany(models.Review, { foreignKey: 'provider_id', as: 'reviews' });
    this.hasMany(models.ProviderDocument, { foreignKey: 'provider_id', as: 'documents' });
    this.hasMany(models.DeviceToken, { foreignKey: 'provider_id', as: 'deviceTokens' });
    this.hasMany(models.ProviderPayment, { foreignKey: 'provider_id', as: 'payments' });
    this.hasMany(models.FavoriteProvider, { foreignKey: 'provider_id', as: 'favoritedBy' });
  }
}

module.exports = ProviderProfile;
