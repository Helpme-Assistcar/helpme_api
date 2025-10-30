// src/app/controllers/Auth.controller.js
const AppError = require("../errors/AppError");
const AuthSchemas = require("../schemas/Auth.schemas");
const AuthService = require("../services/Auth.service");

class AuthController {
  // --------- REGISTROS ---------
  async registerCustomer(req, res) {
    try {
      const { name, mail, email, password, phone, photo } = req.body;
      const data = await AuthService.registerCustomer({
        name,
        mail: mail || email,
        password,
        phone,
        photo,
      });
      return res.status(201).json(data);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }

  async registerProvider(req, res) {
    try {
      const { name, mail, email, password, phone, service_provided, photo } =
        req.body;
      const data = await AuthService.registerProvider({
        name,
        mail: mail || email,
        password,
        phone,
        service_provided,
        photo,
      });
      return res.status(201).json(data);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }

  // --------- LOGINS ---------
  async customerLogin(req, res) {
    try {
      const { mail, email, password } = req.body;
      const response = await AuthService.customerLogin(mail || email, password);
      return res.status(200).json(response);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }

  async providerLogin(req, res) {
    try {
      const { mail, email, password } = req.body;
      const response = await AuthService.providerLogin(mail || email, password);
      return res.status(200).json(response);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }

  // 2FA (somente prestador)
  async setup2FA(req, res) {
    try {
      const userId = req.userId;
      const data = await AuthService.setup2FA(userId);
      return res.json(data);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }

  async verify2FA(req, res) {
    try {
      const userId = req.userId;
      const { token } = req.body;
      const data = await AuthService.verify2FA(userId, token);
      return res.json(data);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }

  async reset2FA(req, res) {
    try {
      const { id } = req.params;
      const data = await AuthService.reset2FA(id);
      return res.json(data);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }

  async autoLogin(req, res) {
    try {
      const { userId } = req;
      const response = await AuthService.autoLogin(userId);
      return res.status(200).json(response);
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }
}

module.exports = new AuthController();
