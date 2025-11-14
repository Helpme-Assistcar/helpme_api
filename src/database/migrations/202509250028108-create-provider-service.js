"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProviderService", {
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
      service_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Service", key: "id" },
        onDelete: "CASCADE",
      },
      price_min: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      price_max: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint("ProviderService", {
      fields: ["provider_id", "service_id"],
      type: "unique",
      name: "uq_provider_service_provider_id_service_id",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "ProviderService",
      "uq_provider_service_provider_id_service_id"
    );
    await queryInterface.dropTable("ProviderService");
  },
};
