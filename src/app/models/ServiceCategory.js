"use strict";
const { Model, Sequelize } = require("sequelize");

class ServiceCategory extends Model {
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
          unique: true,
          validate: {
            len: {
              args: [2, 120],
              msg: "Nome da categoria deve ter entre 2 e 120 caracteres.",
            },
            notNull: { msg: "Nome da categoria é obrigatório." },
          },
        },
        icon: { type: Sequelize.STRING(255), allowNull: true },
        sort_order: { type: Sequelize.INTEGER, allowNull: true },
      },
      {
        sequelize,
        tableName: "service_category",
        underscored: true,
        timestamps: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Service, { foreignKey: "category_id", as: "services" });
  }
}

module.exports = ServiceCategory;
