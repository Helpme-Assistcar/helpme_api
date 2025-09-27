const TokenManager = require("../../utils/Token.manager");
const AppError = require("../errors/AppError");
const { RefreshToken } = require("../models");
const jwt = require("jsonwebtoken");

class RefreshTokenService {
  async saveTokens(userId, access_token, refresh_token) {
    try {
      const existingToken = await RefreshToken.findOne({
        where: { user_id: userId },
      });

      if (existingToken) {
        existingToken.access_token = access_token;
        existingToken.refresh_token = refresh_token;
        await existingToken.save();
      } else {
        await RefreshToken.create({
          user_id: userId,
          access_token: access_token,
          refresh_token: refresh_token,
        });
      }
    } catch (error) {
      throw new AppError("Erro ao salvar o refresh token: " + error.message);
    }
  }

  async saveAccessToken(userId, access_token) {
    try {
      const existingToken = await RefreshToken.findOne({
        where: { user_id: userId },
      });

      if (existingToken) {
        existingToken.access_token = access_token;
        existingToken.save();
        return {
          accessToken: access_token,
          message: "Token atualizado com sucesso!",
        };
      } else {
        throw new AppError("Token não encontrado!");
      }
    } catch (error) {
      throw new AppError("Erro ao salvar o refresh token: " + error.message);
    }
  }

  async saveRefreshToken(userId, refresh_token) {
    try {
      const existingToken = await RefreshToken.findOne({
        where: { user_id: userId },
      });

      if (existingToken) {
        existingToken.refresh_token = refresh_token;
        await existingToken.save();
      } else {
        throw new AppError("Token não encontrado!");
      }
    } catch (error) {
      throw new AppError("Erro ao salvar o refresh token: " + error.message);
    }
  }

  async refreshAccessToken(accessToken) {
    try {
      if (!accessToken) {
        throw new AppError("Token não fornecido");
      }

      const response = await RefreshToken.findOne({
        where: { access_token: accessToken },
      });

      if (response === null) {
        throw new AppError(401, "Token inválido ou expirado");
      }

      jwt.verify(
        response.refresh_token,
        process.env.CLIENT_SECRET_KEY,
        (err) => {
          if (err) throw new AppError(401, "Refresh token inspirado!");
        },
      );

      const newAccessToken = TokenManager.generate(
        response.user_id,
        response.refresh_token,
        "7h",
      );

      const saveResponse = await this.saveAccessToken(
        response.user_id,
        newAccessToken,
      );
      return saveResponse;
    } catch ({ message, statusCode }) {
      throw new AppError(
        statusCode || 401,
        message || "Erro ao renovar o token",
      );
    }
  }

  async deleteRefreshToken(userId, transaction = null) {
    try {
      const user = await RefreshToken.findOne(
        { where: { user_id: userId } },
        transaction,
      );

      if (!user) {
        throw new AppError(404, "Usuário não encontrado");
      }

      await RefreshToken.destroy({ where: { user_id: userId } }, transaction);
    } catch (error) {
      throw new AppError(
        error.statusCode || 500,
        "Erro ao excluir refresh token: " + error.message,
      );
    }
  }
}

module.exports = new RefreshTokenService();
