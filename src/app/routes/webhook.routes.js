const { Router } = require("express");
const routes = Router();

const WebhookController = require("../controllers/Webhook.controller");

routes.post("/revenuecat", WebhookController.revenueCat);

module.exports = routes;
