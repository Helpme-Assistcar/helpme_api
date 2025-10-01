const { Router } = require("express");
const routes = Router();

const AuthRoutes = require("./auth.routes");

routes.use("/auth", AuthRoutes);

module.exports = routes;
