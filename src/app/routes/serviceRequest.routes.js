// src/app/routes/auth.routes.js
const { Router } = require("express");
const routes = Router();

const ServiceRequestController = require("../controllers/ServiceRequest.controller");
const authMiddleware = require("../middlewares/MiddlewareAuth");

routes.post(
  "/",
  authMiddleware.isAuthenticated,
  ServiceRequestController.create,
);

routes.put(
  "/accept",
  authMiddleware.isAuthenticated,
  ServiceRequestController.accept,
);

routes.put(
  "/cancel",
  authMiddleware.isAuthenticated,
  ServiceRequestController.cancel,
);

routes.put(
  "/completed",
  authMiddleware.isAuthenticated,
  ServiceRequestController.completed,
);

routes.put(
  "/client/cancel",
  authMiddleware.isAuthenticated,
  ServiceRequestController.clientCancel,
);

routes.get(
  "/:id",
  authMiddleware.isAuthenticated,
  ServiceRequestController.findReq,
);

routes.get(
  "/all/provider",
  authMiddleware.isAuthenticated,
  ServiceRequestController.findAllProviderServices,
);

routes.get(
  "/all/customer",
  authMiddleware.isAuthenticated,
  ServiceRequestController.findAllCustomerServices,
);

module.exports = routes;
