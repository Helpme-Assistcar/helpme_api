'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      name: { type: Sequelize.STRING(255), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: true, unique: true },
      phone: { type: Sequelize.STRING(32), allowNull: true, unique: true },
      password_hash: { type: Sequelize.TEXT, allowNull: false },
      email_verified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      phone_verified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
