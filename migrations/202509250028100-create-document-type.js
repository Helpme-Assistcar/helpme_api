'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('document_type', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      name: { type: Sequelize.STRING(120), allowNull: false },
      country: { type: Sequelize.STRING(2), allowNull: true },
      rules: { type: Sequelize.JSONB, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('document_type');
  }
};
