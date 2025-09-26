'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('provider_address', {
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
      label: { type: Sequelize.STRING(100), allowNull: true },
      street: { type: Sequelize.STRING(255), allowNull: true },
      number: { type: Sequelize.STRING(50), allowNull: true },
      complement: { type: Sequelize.STRING(255), allowNull: true },
      district: { type: Sequelize.STRING(100), allowNull: true },
      city: { type: Sequelize.STRING(100), allowNull: true },
      state: { type: Sequelize.STRING(100), allowNull: true },
      country: { type: Sequelize.STRING(100), allowNull: true },
      zipcode: { type: Sequelize.STRING(20), allowNull: true },
      location: { type: Sequelize.GEOGRAPHY('POINT', 4326), allowNull: true },
      is_primary: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('provider_address');
  }
};
