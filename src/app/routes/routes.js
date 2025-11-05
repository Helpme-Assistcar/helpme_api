const { Router } = require("express");
const routes = Router();

const AuthRoutes = require("./auth.routes");
const ProviderRoutes = require("./provider.routes");
const ClientRoutes = require("./client.routes");

routes.use("/auth", AuthRoutes);
routes.use("/provider", ProviderRoutes);
routes.use("/client", ClientRoutes);

module.exports = routes;
