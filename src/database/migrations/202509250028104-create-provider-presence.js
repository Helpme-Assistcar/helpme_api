"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProviderPresence", {
      provider_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: "ProviderProfile", key: "id" },
        onDelete: "CASCADE",
      },
      current_position: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("ONLINE", "OFFLINE", "BUSY"),
        allowNull: false,
        defaultValue: "OFFLINE",
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
    await queryInterface.dropTable("ProviderPresence");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_ProviderPresenceStatus";'
    );
  },
};
