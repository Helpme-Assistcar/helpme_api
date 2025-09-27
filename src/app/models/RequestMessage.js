'use strict';
const { Model, Sequelize } = require('sequelize');

class RequestMessage extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      request_id: { type: Sequelize.UUID, allowNull: false },
      sender_user_id: { type: Sequelize.UUID, allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: true },
      attachment_file_id: { type: Sequelize.UUID, allowNull: true }
    }, {
      sequelize,
      tableName: 'request_message',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.ServiceRequest, { foreignKey: 'request_id', as: 'request' });
    this.belongsTo(models.Users, { foreignKey: 'sender_user_id', as: 'sender' });
    this.belongsTo(models.FileUpload, { foreignKey: 'attachment_file_id', as: 'attachment' });
  }
}

module.exports = RequestMessage;
