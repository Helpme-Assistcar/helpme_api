"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProviderDocument", {
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
      document_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "DocumentType", key: "id" },
        onDelete: "RESTRICT",
      },
      number: { type: Sequelize.STRING(80), allowNull: true },
      issue_date: { type: Sequelize.DATEONLY, allowNull: true },
      expiration_date: { type: Sequelize.DATEONLY, allowNull: true },
      file_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "FileUpload", key: "id" },
        onDelete: "SET NULL",
      },
      status: {
        type: Sequelize.ENUM("PENDING", "VERIFIED", "REJECTED", "EXPIRED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      notes: { type: Sequelize.TEXT, allowNull: true },
      verified_at: { type: Sequelize.DATE, allowNull: true },
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
    await queryInterface.dropTable("ProviderDocument");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_provider_document_status";'
    );
  },
};
