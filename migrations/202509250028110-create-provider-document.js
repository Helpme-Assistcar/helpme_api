'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('provider_document', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      provider_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'provider_profile', key: 'id' },
        onDelete: 'CASCADE',
      },
      document_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'document_type', key: 'id' },
        onDelete: 'RESTRICT',
      },
      number: { type: Sequelize.STRING(80), allowNull: true },
      issue_date: { type: Sequelize.DATEONLY, allowNull: true },
      expiration_date: { type: Sequelize.DATEONLY, allowNull: true },
      file_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'file_upload', key: 'id' },
        onDelete: 'SET NULL',
      },
      status: { type: Sequelize.ENUM('PENDING','VERIFIED','REJECTED','EXPIRED'), allowNull: false, defaultValue: 'PENDING' },
      notes: { type: Sequelize.TEXT, allowNull: true },
      verified_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('provider_document');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_provider_document_status";');
  }
};
