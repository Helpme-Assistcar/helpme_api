"use strict";
const { Model, Sequelize } = require("sequelize");

class DocumentType extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(120),
          allowNull: false,
          validate: {
            notNull: { msg: "Nome do tipo de documento é obrigatório." },
          },
        },
        country: { type: Sequelize.STRING(2), allowNull: true },
        rules: { type: Sequelize.JSON, allowNull: true },
      },
      {
        sequelize,
        tableName: "DocumentType",
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        created_at: "created_at",
        updated_at: "updated_at",
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.ProviderDocument, {
      foreignKey: "document_type_id",
      as: "providerDocuments",
    });
  }
}

module.exports = DocumentType;
