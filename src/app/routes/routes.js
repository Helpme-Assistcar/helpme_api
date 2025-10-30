const { Router } = require("express");
const routes = Router();

const AuthRoutes = require("./auth.routes");
const ProviderRoutes = require("./provider.routes");

routes.use("/auth", AuthRoutes);
routes.use("/provider", ProviderRoutes);

module.exports = routes;
