// src/app/services/Auth.service.js
const bcrypt = require("bcryptjs");
const AppError = require("../errors/AppError");
const AuthSchemas = require("../schemas/Auth.schemas");

const { Users, ClientProfile, ProviderProfile } = require("../models");
const TokenManager = require("../../utils/Token.manager");
const RefreshTokenService = require("./RefreshToken.service");
const AuthInteractor = require("../interactors/AuthInteractor");

const { Sequelize } = require("sequelize");

class AuthService {
  // --------- helpers ---------
  async #issueTokens(userId) {
    const refreshToken = TokenManager.generate(
      userId,
      process.env.CLIENT_SECRET_KEY,
      "15d"
    );
    const accessToken = TokenManager.generate(userId, refreshToken, "7h");
    await RefreshTokenService.saveTokens(userId, accessToken, refreshToken);
    return { accessToken };
  }

  async #findUserByMail(mailOrEmail) {
    return Users.findOne({ where: { email: mailOrEmail } });
  }

  // --------- REGISTROS ---------
  async registerCustomer({ name, mail, password, phone, photo }) {
    const invalid = AuthSchemas.registerCustomerSchema({
      name,
      mail,
      password,
    });
    if (invalid) throw new AppError(400, invalid);

    const t = await Users.sequelize.transaction();
    try {
      const existing = await this.#findUserByMail(mail);
      if (existing) throw new AppError(409, "E-mail já cadastrado");

      const user = await Users.create(
        {
          name,
          email: mail,
          phone: phone || null,
          password_hash: bcrypt.hashSync(password, 8),
          photo,
        },
        { transaction: t }
      );

      await ClientProfile.create({ user_id: user.id }, { transaction: t });

      await t.commit();

      const tokens = await this.#issueTokens(user.id);
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: "CLIENT",
        },
        ...tokens,
      };
    } catch (err) {
      await t.rollback();
      throw new AppError(
        err.statusCode || 500,
        err.message || "Erro ao registrar cliente"
      );
    }
  }

  async registerProvider({
    name,
    mail,
    password,
    phone,
    service_provided,
    photo,
  }) {
    const invalid = AuthSchemas.registerProviderSchema({
      name,
      mail,
      password,
    });
    if (invalid) throw new AppError(400, invalid);

    const t = await Users.sequelize.transaction();
    try {
      const existing = await this.#findUserByMail(mail);
      if (existing) throw new AppError(409, "E-mail já cadastrado");

      const user = await Users.create(
        {
          name,
          email: mail,
          phone: phone || null,
          password_hash: bcrypt.hashSync(password, 8),
          photo,
        },
        { transaction: t }
      );

      const provider = await ProviderProfile.create(
        {
          user_id: user.id,
          service_provided: service_provided,
          status: "OFFLINE",
        },
        { transaction: t }
      );

      await t.commit();

      const tokens = await this.#issueTokens(user.id);
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: "PROVIDER",
        },
        provider: {
          id: provider.id,
          service_provided: provider.service_provided,
        },
        ...tokens,
      };
    } catch (err) {
      await t.rollback();
      throw new AppError(
        err.statusCode || 500,
        err.message || "Erro ao registrar prestador"
      );
    }
  }

  // --------- LOGINS ---------
  async customerLogin(mail, password) {
    const invalid = AuthSchemas.loginSchema({ mail, password });
    if (invalid) throw new AppError(400, invalid);

    const user = await this.#findUserByMail(mail);
    if (!user) throw new AppError(403, "Credenciais inválidas");

    const providerProfile = await ProviderProfile.findOne({
      where: { user_id: user.id },
    });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new AppError(403, "Credenciais inválidas");

    // Clientes: sem 2FA obrigatório
    if (!providerProfile) {
      const tokens = await this.#issueTokens(user.id);
      return { accessToken: tokens.accessToken, type: "CLIENT" };
    } else {
      const tokens = await this.#issueTokens(user.id);
      return { accessToken: tokens.accessToken, type: "PROVIDER" };
    }
  }

  async providerLogin(mail, password, token) {
    const invalid = AuthSchemas.loginSchema({ mail, password });
    if (invalid) throw new AppError(400, invalid);

    // precisa existir provider_profile
    const user = await this.#findUserByMail(mail);
    if (!user) throw new AppError(403, "Credenciais inválidas");

    const providerProfile = await ProviderProfile.findOne({
      where: { user_id: user.id },
    });
    if (!providerProfile)
      throw new AppError(
        403,
        "Conta de prestador não encontrada para este e-mail"
      );

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new AppError(403, "Credenciais inválidas");

    const tokens = await this.#issueTokens(user.id);
    return { accessToken: tokens.accessToken, type: "PROVIDER" };
    // // 2FA (apenas prestador): se existir secret, o token é obrigatório
    // if (user.two_factor_secret) {
    //   if (!token) throw new AppError(400, "Informe o código 2FA");
    //   const verified = AuthInteractor.verifyToken(
    //     user.two_factor_secret,
    //     token
    //   );
    //   if (!verified) throw new AppError(403, "Código 2FA inválido");
    // }

    // // se ainda não configurou 2FA, opcionalmente podemos sugerir setup
    // let twoFactor;
    // if (!user.two_factor_secret) {
    //   // gera secreta temporária e QR para o prestador ativar depois
    //   const secretObj = AuthInteractor.generateSecret(user.email);
    //   const qrCode = await AuthInteractor.generateQRCode(secretObj.otpauth_url);
    //   await user.update({ two_factor_temp_secret: secretObj.base32 });
    //   twoFactor = { qrCode, secret: secretObj.base32 };
    // }

    // const tokens = await this.#issueTokens(user.id);
    // const result = { accessToken: tokens.accessToken, type: "PROVIDER" };
    // if (twoFactor) result.twoFactor = twoFactor;
    // return result;
  }

  // --------- 2FA (somente prestadores) ---------
  async setup2FA(userId) {
    // verifica se é prestador
    const provider = await ProviderProfile.findOne({
      where: { user_id: userId },
    });
    if (!provider)
      throw new AppError(403, "Apenas prestadores podem ativar 2FA");

    const user = await Users.findByPk(userId);
    const secretObj = AuthInteractor.generateSecret(user.email);
    const qrCode = await AuthInteractor.generateQRCode(secretObj.otpauth_url);
    await user.update({ two_factor_temp_secret: secretObj.base32 });
    return { qrCode, secret: secretObj.base32 };
  }

  async verify2FA(userId, token) {
    const invalid = AuthSchemas.verify2FASchema(token);
    if (invalid) throw new AppError(400, invalid);

    const provider = await ProviderProfile.findOne({
      where: { user_id: userId },
    });
    if (!provider)
      throw new AppError(403, "Apenas prestadores podem verificar 2FA");

    const user = await Users.findByPk(userId);
    const temp = user.two_factor_temp_secret;
    if (!temp) throw new AppError(400, "2FA não iniciado");

    const ok = AuthInteractor.verifyToken(temp, token);
    if (!ok) throw new AppError(403, "Código 2FA inválido");

    await user.update({
      two_factor_secret: temp,
      two_factor_temp_secret: null,
    });
    return { message: "2FA ativado com sucesso" };
  }

  async reset2FA(userId) {
    const provider = await ProviderProfile.findOne({
      where: { user_id: userId },
    });
    if (!provider)
      throw new AppError(403, "Apenas prestadores podem resetar 2FA");
    const user = await Users.findByPk(userId);
    await user.update({
      two_factor_secret: null,
      two_factor_temp_secret: null,
    });
    return { message: "2FA resetado" };
  }

  // --------- Outros ---------
  async autoLogin(userId) {
    const user = await Users.findByPk(userId, {
      attributes: ["id", "name", "email"],
    });
    if (!user) throw new AppError(404, "Usuário não encontrado");

    const providerProfile = await ProviderProfile.findOne({
      where: { user_id: user.id },
    });

    if (!providerProfile) {
      const tokens = await this.#issueTokens(user.id);
      return { accessToken: tokens.accessToken, type: "CLIENT" };
    } else {
      const tokens = await this.#issueTokens(user.id);
      return { accessToken: tokens.accessToken, type: "PROVIDER" };
    }
  }
}

module.exports = new AuthService();
