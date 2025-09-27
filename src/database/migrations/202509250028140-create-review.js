'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('review', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      request_id: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: { model: 'service_request', key: 'id' },
        onDelete: 'CASCADE',
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
      rating: { type: Sequelize.SMALLINT, allowNull: false },
      comment: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE review
      ADD CONSTRAINT review_rating_check CHECK (rating BETWEEN 1 AND 5);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('review');
  }
};
