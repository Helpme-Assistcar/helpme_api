'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('request_message', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      request_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'service_request', key: 'id' },
        onDelete: 'CASCADE',
      },
      sender_user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      message: { type: Sequelize.TEXT, allowNull: true },
      attachment_file_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'file_upload', key: 'id' },
        onDelete: 'SET NULL',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('request_message');
  }
};
