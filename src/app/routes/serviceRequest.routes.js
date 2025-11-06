// src/app/routes/auth.routes.js
const { Router } = require("express");
const routes = Router();

const ServiceRequestController = require("../controllers/ServiceRequest.controller");
const authMiddleware = require("../middlewares/MiddlewareAuth");

routes.post(
  "/",
  authMiddleware.isAuthenticated,
  ServiceRequestController.create
);

module.exports = routes;
