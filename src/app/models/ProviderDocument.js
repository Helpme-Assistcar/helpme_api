'use strict';
const { Model, Sequelize } = require('sequelize');

class ProviderDocument extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      provider_id: { type: Sequelize.UUID, allowNull: false },
      document_type_id: { type: Sequelize.UUID, allowNull: false },
      number: { type: Sequelize.STRING(80), allowNull: true },
      issue_date: { type: Sequelize.DATEONLY, allowNull: true },
      expiration_date: { type: Sequelize.DATEONLY, allowNull: true },
      file_id: { type: Sequelize.UUID, allowNull: true },
      status: { type: Sequelize.ENUM('PENDING','VERIFIED','REJECTED','EXPIRED'), allowNull: false, defaultValue: 'PENDING' },
      notes: { type: Sequelize.TEXT, allowNull: true },
      verified_at: { type: Sequelize.DATE, allowNull: true }
    }, {
      sequelize,
      tableName: 'provider_document',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.ProviderProfile, { foreignKey: 'provider_id', as: 'provider' });
    this.belongsTo(models.DocumentType, { foreignKey: 'document_type_id', as: 'documentType' });
    this.belongsTo(models.FileUpload, { foreignKey: 'file_id', as: 'file' });
  }
}

module.exports = ProviderDocument;
