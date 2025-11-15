const Sequelize = require("sequelize");

const connectionDatabase = require("../config/database");

const {
  ClientProfile,
  DeviceToken,
  DocumentType,
  FavoriteProvider,
  FileUpload,
  RefreshToken,
  Notification,
  ProviderAddress,
  ProviderDocument,
  ProviderPayment,
  ProviderPresence,
  ProviderProfile,
  ProviderService,
  RequestMessage,
  Review,
  Service,
  ServiceCategory,
  ServiceRequest,
  Users,
} = require("../app/models");

const models = [
  ClientProfile,
  DeviceToken,
  DocumentType,
  FavoriteProvider,
  FileUpload,
  RefreshToken,
  Notification,
  ProviderAddress,
  ProviderDocument,
  ProviderPayment,
  ProviderPresence,
  ProviderProfile,
  ProviderService,
  RequestMessage,
  Review,
  Service,
  ServiceCategory,
  ServiceRequest,
  Users,
];

class Database {
  constructor() {
    this.init();
  }

  async init() {
    let sequelize;

    if (connectionDatabase.use_env_variable) {
      sequelize = new Sequelize(
        process.env[connectionDatabase.use_env_variable],
        connectionDatabase
      );
    } else {
      sequelize = new Sequelize(
        connectionDatabase.database,
        connectionDatabase.username,
        connectionDatabase.password,
        connectionDatabase
      );
    }

    this.mainConnection = sequelize;
    models.forEach((model) => model.init(this.mainConnection));
    models.forEach(
      (model) => model.associate && model.associate(this.mainConnection.models)
    );
  }
}

module.exports = new Database();
