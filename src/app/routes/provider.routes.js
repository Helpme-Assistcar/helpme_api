// src/app/routes/auth.routes.js
const { Router } = require("express");
const routes = Router();

const ProviderController = require("../controllers/Provider.controller");
const authMiddleware = require("../middlewares/MiddlewareAuth");

routes.get(
  "/",
  authMiddleware.isAuthenticated,
  ProviderController.findProvider,
);
routes.put(
  "/status",
  authMiddleware.isAuthenticated,
  ProviderController.changeStatus,
);
routes.get(
  "/client/:id",
  authMiddleware.isAuthenticated,
  ProviderController.findClientService,
);
routes.put(
  "/location",
  authMiddleware.isAuthenticated,
  ProviderController.updateLocation,
);
routes.patch("", authMiddleware.isAuthenticated, ProviderController.updateUser);

routes.delete(
  "",
  authMiddleware.isAuthenticated,
  ProviderController.deleteUser,
);

module.exports = routes;
