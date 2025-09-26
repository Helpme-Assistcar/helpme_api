'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable UUID and PostGIS extensions
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');
  },

  async down(queryInterface, Sequelize) {
    // Usually we keep extensions installed, but you can drop them if desired.
    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS postgis;');
    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS "uuid-ossp";');
  }
};
