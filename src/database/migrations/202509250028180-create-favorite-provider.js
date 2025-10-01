"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("FavoriteProvider", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "ClientProfile", key: "user_id" },
        onDelete: "CASCADE",
      },
      provider_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "ProviderProfile", key: "id" },
        onDelete: "CASCADE",
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

    await queryInterface.addConstraint("FavoriteProvider", {
      fields: ["client_id", "provider_id"],
      type: "unique",
      name: "uq_favorite_provider_client_provider",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "FavoriteProvider",
      "uq_favorite_provider_client_provider"
    );
    await queryInterface.dropTable("FavoriteProvider");
  },
};
