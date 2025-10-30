"use strict";
const { Model, Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");

class Users extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "Identificador inválido." },
            notNull: { msg: "Identificador de usuário não pode ser vazio." },
          },
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
          validate: {
            len: {
              args: [2, 100],
              msg: "O nome deve ter entre 2 e 100 caracteres.",
            },
            notNull: { msg: "O nome do usuário não pode ser nulo." },
          },
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: true,
          validate: {
            isEmail: { args: true, msg: "Formato de e-mail inválido." },
          },
        },
        phone: {
          type: Sequelize.STRING(32),
          allowNull: true,
          unique: true,
        },
        photo: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        password: {
          // Campo virtual para receber a senha em texto puro
          type: Sequelize.VIRTUAL,
          set(value) {
            this.setDataValue("password", value);
          },
          validate: {
            len: { args: [6], msg: "Senha deve ter no mínimo 6 caracteres." },
            is: {
              args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/,
              msg: "A senha deve conter letras maiúsculas, minúsculas e caráter especial.",
            },
          },
        },
        password_hash: {
          type: Sequelize.TEXT,
          allowNull: false,
          validate: {
            notNull: { msg: "A senha não pode ser nula." },
          },
        },
        email_verified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        phone_verified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        underscored: true,
        timestamps: true,
      }
    );

    this.addHook("beforeSave", async (user) => {
      if (user.changed("password") && user.password) {
        user.password_hash = bcrypt.hashSync(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasOne(models.ClientProfile, {
      foreignKey: "user_id",
      as: "clientProfile",
    });
    this.hasOne(models.ProviderProfile, {
      foreignKey: "user_id",
      as: "providerProfile",
    });
    this.hasMany(models.RequestMessage, {
      foreignKey: "sender_user_id",
      as: "messages",
    });
    this.hasMany(models.Notification, {
      foreignKey: "user_id",
      as: "notifications",
    });
    this.hasMany(models.ProviderPayment, {
      foreignKey: "payer_user_id",
      as: "providerPayments",
    });
    this.hasMany(models.DeviceToken, {
      foreignKey: "user_id",
      as: "deviceTokens",
    });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = Users;
