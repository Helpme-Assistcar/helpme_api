'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('provider_payment', {
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
      payer_user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      payment_type: { type: Sequelize.ENUM('ONBOARDING','SUBSCRIPTION','COMMISSION'), allowNull: true },
      period_start: { type: Sequelize.DATE, allowNull: true },
      period_end: { type: Sequelize.DATE, allowNull: true },
      method: { type: Sequelize.ENUM('CARD','PIX','CASH'), allowNull: true },
      status: { type: Sequelize.ENUM('REQUIRING_ACTION','AUTHORIZED','CAPTURED','CANCELED','REFUNDED','FAILED'), allowNull: true },
      provider: { type: Sequelize.STRING(120), allowNull: true },
      provider_payment_id: { type: Sequelize.STRING(200), allowNull: true },
      amount: { type: Sequelize.DECIMAL(10,2), allowNull: true },
      currency: { type: Sequelize.CHAR(3), allowNull: true, defaultValue: 'BRL' },
      paid_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('provider_payment');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_provider_payment_payment_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_provider_payment_method";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_provider_payment_status";');
  }
};
