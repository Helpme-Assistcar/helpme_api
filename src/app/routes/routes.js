const { Router } = require("express");
const routes = Router();

const AuthRoutes = require("./auth.routes");
const ProviderRoutes = require("./provider.routes");
const ClientRoutes = require("./client.routes");
const ServiceRequestRoutes = require("./serviceRequest.routes");
const ServiceCategoryRoutes = require("./serviceCategory.routes");

routes.use("/auth", AuthRoutes);
routes.use("/provider", ProviderRoutes);
routes.use("/client", ClientRoutes);
routes.use("/serviceRequest", ServiceRequestRoutes);
routes.use("/serviceCategory", ServiceCategoryRoutes);

module.exports = routes;
