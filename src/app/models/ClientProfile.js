'use strict';
const { Model, Sequelize } = require('sequelize');

class ClientProfile extends Model {
  static init(sequelize) {
    super.init({
      user_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        validate: {
          isUUID: { args: 4, msg: 'ID inválido.' },
          notNull: { msg: 'user_id é obrigatório.' }
        }
      },
      meta: { type: Sequelize.JSONB, allowNull: true }
    }, {
      sequelize,
      tableName: 'client_profile',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
    this.hasMany(models.ServiceRequest, { foreignKey: 'client_id', sourceKey: 'user_id', as: 'serviceRequests' });
    this.hasMany(models.Review, { foreignKey: 'client_id', sourceKey: 'user_id', as: 'reviews' });
    this.hasMany(models.FavoriteProvider, { foreignKey: 'client_id', sourceKey: 'user_id', as: 'favorites' });
  }
}

module.exports = ClientProfile;
