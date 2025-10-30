// src/app/routes/auth.routes.js
const { Router } = require("express");
const routes = Router();

const ProviderController = require("../controllers/Provider.controller");
const authMiddleware = require("../middlewares/MiddlewareAuth");

routes.get(
  "/",
  authMiddleware.isAuthenticated,
  ProviderController.findProvider
);

module.exports = routes;
