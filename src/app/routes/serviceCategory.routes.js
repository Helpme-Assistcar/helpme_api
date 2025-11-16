// src/app/routes/auth.routes.js
const { Router } = require("express");
const routes = Router();

const ServiceCategoryController = require("../controllers/ServiceCategory.controller");
const authMiddleware = require("../middlewares/MiddlewareAuth");

routes.get("/", ServiceCategoryController.findNameCategories);

module.exports = routes;
