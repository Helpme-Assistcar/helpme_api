"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProviderReferral", {
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
        unique: true, // um profissional só pode ter sido indicado uma vez
        references: { model: "ProviderProfile", key: "id" },
        onDelete: "CASCADE",
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 39.9,
      },
      status: {
        type: Sequelize.ENUM("PENDING", "CONFIRMED", "NOTIFIED", "PAID"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      confirmed_at: { type: Sequelize.DATE, allowNull: true },
      notified_at: { type: Sequelize.DATE, allowNull: true },
      paid_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("ProviderReferral");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_ProviderReferral_status";',
    );
  },
};
