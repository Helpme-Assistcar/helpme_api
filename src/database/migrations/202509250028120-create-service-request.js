"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ServiceRequest", {
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
        allowNull: true,
        references: { model: "ProviderProfile", key: "id" },
        onDelete: "SET NULL",
      },
      service_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "Service", key: "id" },
        onDelete: "SET NULL",
      },
      description: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM(
          "PENDING",
          "ACCEPTED",
          "REJECTED",
          "CANCELLED_CLIENT",
          "CANCELLED_PROVIDER",
          "IN_ROUTE",
          "ARRIVED",
          "WORKING",
          "DONE",
          "AWAITING_PAYMENT",
          "PAID",
          "CLOSED"
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },
      request_location: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      address_snapshot: { type: Sequelize.STRING(500), allowNull: true },
      distance_km: { type: Sequelize.DECIMAL(8, 3), allowNull: true },
      price_estimate: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      final_price: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      requested_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      accepted_at: { type: Sequelize.DATE, allowNull: true },
      arrived_at: { type: Sequelize.DATE, allowNull: true },
      started_at: { type: Sequelize.DATE, allowNull: true },
      completed_at: { type: Sequelize.DATE, allowNull: true },
      cancelled_at: { type: Sequelize.DATE, allowNull: true },
      cancelled_by: { type: Sequelize.STRING(50), allowNull: true },
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
    await queryInterface.dropTable("ServiceRequest");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_service_request_status";'
    );
  },
};
