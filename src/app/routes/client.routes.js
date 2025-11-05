// src/app/routes/auth.routes.js
const { Router } = require("express");
const routes = Router();

const ClientController = require("../controllers/Client.controller");
const authMiddleware = require("../middlewares/MiddlewareAuth");

routes.get(
  "/all",
  authMiddleware.isAuthenticated,
  ClientController.findAllProviders
);

module.exports = routes;
