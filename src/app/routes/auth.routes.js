// src/app/routes/auth.routes.js
const { Router } = require("express");
const routes = Router();

const AuthController = require("../controllers/Auth.controller");
const authMiddleware = require("../middlewares/MiddlewareAuth");
const RefreshTokenController = require("../controllers/RefreshToken.controller");

// Registro
routes.post("/customer/register", AuthController.registerCustomer);
routes.post("/provider/register", AuthController.registerProvider);

// Login
routes.post("/customer/login", AuthController.customerLogin);
routes.post("/provider/login", AuthController.providerLogin);

// 2FA - apenas prestador
routes.get(
  "/login/2fa/setup",
  authMiddleware.isAuthenticated,
  AuthController.setup2FA
);
routes.post(
  "/login/2fa/verify",
  authMiddleware.isAuthenticated,
  AuthController.verify2FA
);
routes.patch(
  "/login/2fa/:id/reset",
  authMiddleware.isAuthenticated,
  AuthController.reset2FA
);

// Auto-login
routes.post(
  "/autologin",
  authMiddleware.isAuthenticated,
  AuthController.autoLogin
);
routes.post("/google", AuthController.googleLogin);

// Refresh token (reutiliza seu controller)
routes.post("/refresh", RefreshTokenController.refreshToken);

module.exports = routes;
