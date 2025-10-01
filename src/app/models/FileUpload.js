"use strict";
const { Model, Sequelize } = require("sequelize");

class FileUpload extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        storage_key: {
          type: Sequelize.STRING(500),
          allowNull: false,
          validate: { notNull: { msg: "storage_key é obrigatório." } },
        },
        mime_type: { type: Sequelize.STRING(100), allowNull: true },
        size_bytes: { type: Sequelize.INTEGER, allowNull: true },
        sha256: { type: Sequelize.STRING(80), allowNull: true },
        meta: { type: Sequelize.JSON, allowNull: true },
      },
      {
        sequelize,
        tableName: "file_upload",
        underscored: true,
        timestamps: true,
        created_at: "created_at",
        updated_at: false,
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.RequestMessage, {
      foreignKey: "attachment_file_id",
      as: "messages",
    });
    this.hasMany(models.ProviderDocument, {
      foreignKey: "file_id",
      as: "documents",
    });
  }
}

module.exports = FileUpload;
