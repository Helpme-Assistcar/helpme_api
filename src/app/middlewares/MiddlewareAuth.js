const jwt = require("jsonwebtoken");
const { RefreshToken } = require("../models");

class MiddlewareAuth {
  static async isAuthenticated(req, res, next) {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        return res.status(401).json({ message: "Token não existe" });
      }

      const parts = authorization.split(" ");

      if (parts.length !== 2) {
        return res.status(401).json({ message: "Token error" });
      }

      const [scheme, token] = parts;

      if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ message: "Token mal formatado" });
      }

      const tokens = await RefreshToken.findOne({
        where: { access_token: token },
      });

      if (!tokens) {
        return res.status(401).json({ message: "Token não existe" });
      }

      jwt.verify(token, tokens.refresh_token, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: "Token inválido" });
        }

        req.userId = decoded.sub;
        req.token = token;
        return next();
      });
    } catch (error) {
      console.error("Erro na autenticação:", error);
      return res.status(error.statusCode || 500).json({
        message: error.message || "Erro interno no servidor",
      });
    }
  }
}

module.exports = MiddlewareAuth;
