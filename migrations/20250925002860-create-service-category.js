'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('service_category', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      name: { type: Sequelize.STRING(120), allowNull: false, unique: true },
      icon: { type: Sequelize.STRING(255), allowNull: true },
      sort_order: { type: Sequelize.INTEGER, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('service_category');
  }
};
