'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('favorite_provider', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'client_profile', key: 'user_id' },
        onDelete: 'CASCADE',
      },
      provider_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'provider_profile', key: 'id' },
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addConstraint('favorite_provider', {
      fields: ['client_id', 'provider_id'],
      type: 'unique',
      name: 'uq_favorite_provider_client_provider'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('favorite_provider', 'uq_favorite_provider_client_provider');
    await queryInterface.dropTable('favorite_provider');
  }
};
