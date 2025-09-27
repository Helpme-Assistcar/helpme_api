'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('provider_presence', {
      provider_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: 'provider_profile', key: 'id' },
        onDelete: 'CASCADE',
      },
      current_position: { type: Sequelize.GEOGRAPHY('POINT', 4326), allowNull: true },
      status: { type: Sequelize.ENUM('ONLINE','OFFLINE','BUSY'), allowNull: false, defaultValue: 'OFFLINE' },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('provider_presence');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_provider_presence_status";');
  }
};
