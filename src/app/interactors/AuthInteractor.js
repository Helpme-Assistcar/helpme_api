// src/app/interactors/AuthInteractor.js
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

module.exports = {
  generateSecret(label) {
    // label aparece no app autenticador
    const secret = speakeasy.generateSecret({ name: label });
    return {
      base32: secret.base32,
      otpauth_url: secret.otpauth_url,
    };
  },

  async generateQRCode(otpauthUrl) {
    return qrcode.toDataURL(otpauthUrl);
  },

  verifyToken(secretBase32, token) {
    return speakeasy.totp.verify({
      secret: secretBase32,
      encoding: 'base32',
      token: String(token || ''),
      window: 1,
    });
  }
};
