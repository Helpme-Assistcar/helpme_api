'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE INDEX IF NOT EXISTS idx_provider_presence_position ON provider_presence USING GIST (current_position);');
    await queryInterface.sequelize.query('CREATE INDEX IF NOT EXISTS idx_provider_address_location ON provider_address USING GIST (location);');
    await queryInterface.sequelize.query('CREATE INDEX IF NOT EXISTS idx_service_request_location ON service_request USING GIST (request_location);');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_service_request_location;');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_provider_address_location;');
    await queryInterface.sequelize.query('DROP INDEX IF EXISTS idx_provider_presence_position;');
  }
};
