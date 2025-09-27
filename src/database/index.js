const Sequelize = require("sequelize");

const connectionDatabase = require("../config/database");

const {
  ClientProfile,
  DeviceToken,
  DocumentType,
  FavoriteProvider,
  FileUpload,
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
    this.mainConnection = new Sequelize(connectionDatabase);
    models.forEach((model) => model.init(this.mainConnection));
    models.forEach(
      (model) => model.associate && model.associate(this.mainConnection.models)
    );
  }
}

module.exports = new Database();
