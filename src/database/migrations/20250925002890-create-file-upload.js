'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('file_upload', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      storage_key: { type: Sequelize.STRING(500), allowNull: false },
      mime_type: { type: Sequelize.STRING(100), allowNull: true },
      size_bytes: { type: Sequelize.INTEGER, allowNull: true },
      sha256: { type: Sequelize.STRING(80), allowNull: true },
      meta: { type: Sequelize.JSONB, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('file_upload');
  }
};
