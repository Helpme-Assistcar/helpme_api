"use strict";
const { Model, Sequelize } = require("sequelize");

class Notification extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        user_id: { type: Sequelize.UUID, allowNull: false },
        title: { type: Sequelize.STRING(200), allowNull: true },
        body: { type: Sequelize.TEXT, allowNull: true },
        data: { type: Sequelize.JSON, allowNull: true },
        read: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        read_at: { type: Sequelize.DATE, allowNull: true },
      },
      {
        sequelize,
        tableName: "notification",
        underscored: true,
        timestamps: true,
        created_at: "created_at",
        updated_at: false,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Users, { foreignKey: "user_id", as: "user" });
  }
}

module.exports = Notification;
