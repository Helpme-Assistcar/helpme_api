const RefreshTokenService = require("../services/RefreshToken.service");

class RefreshTokenController {
  async refreshToken(req, res) {
    try {
      const { accessToken } = req.body;

      if (!accessToken) {
        return res.status(400).json({ message: "Token é obrigatório" });
      }

      const tokens = await RefreshTokenService.refreshAccessToken(accessToken);

      return res.json(tokens);
    } catch ({ message, statusCode }) {
      return res
        .status(statusCode || 401)
        .json({ message: message || "Token inválido" });
    }
  }

  async deleteRefreshToken(req, res) {
    try {
      const { userId } = req.params;

      await RefreshTokenService.deleteRefreshToken(userId);

      return res.status(204).send();
    } catch (error) {
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  }
}

module.exports = new RefreshTokenController();
