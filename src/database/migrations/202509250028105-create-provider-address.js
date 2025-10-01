"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProviderAddress", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      provider_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "ProviderProfile", key: "id" },
        onDelete: "CASCADE",
      },
      label: { type: Sequelize.STRING(100), allowNull: true },
      street: { type: Sequelize.STRING(255), allowNull: true },
      number: { type: Sequelize.STRING(50), allowNull: true },
      complement: { type: Sequelize.STRING(255), allowNull: true },
      district: { type: Sequelize.STRING(100), allowNull: true },
      city: { type: Sequelize.STRING(100), allowNull: true },
      state: { type: Sequelize.STRING(100), allowNull: true },
      country: { type: Sequelize.STRING(100), allowNull: true },
      zipcode: { type: Sequelize.STRING(20), allowNull: true },
      location: { type: Sequelize.TEXT, allowNull: true },
      is_primary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ProviderAddress");
  },
};
