"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Review", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      request_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: { model: "ServiceRequest", key: "id" },
        onDelete: "CASCADE",
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
      rating: { type: Sequelize.SMALLINT, allowNull: false },
      comment: { type: Sequelize.TEXT, allowNull: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // await queryInterface.sequelize.query(`
    //   ALTER TABLE Review
    //   ADD CONSTRAINT review_rating_check CHECK (rating BETWEEN 1 AND 5);
    // `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Review");
  },
};
