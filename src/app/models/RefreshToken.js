const { Model, Sequelize } = require("sequelize");

class RefreshToken extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "Identificador inválido.",
            },
            notNull: {
              msg: "Identificador de usuário não pode ser vazio.",
            },
          },
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: "Users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          validate: {
            isUUID: {
              args: 4,
              msg: "Identificador do usuário inválido",
            },
          },
        },
        access_token: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notNull: {
              msg: "Token não pode ser nulo",
            },
          },
        },
        refresh_token: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notNull: {
              msg: "Token não pode ser nulo",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "RefreshToken",
        freezeTableName: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Users, {
      foreignKey: "user_id",
      as: "users",
    });
  }
}

module.exports = RefreshToken;
