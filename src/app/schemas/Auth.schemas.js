// src/app/schemas/Auth.schemas.js
// Retorna string com erro ou null se válido
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;

function required(v, msg) {
  if (v === undefined || v === null || v === '') return msg;
  return null;
}

module.exports = {
  loginSchema(body) {
    const mail = body.mail || body.email;
    const err1 = required(mail, 'E-mail é obrigatório');
    if (err1) return err1;
    if (!emailRegex.test(mail)) return 'Formato de e-mail inválido';
    const err2 = required(body.password, 'Senha é obrigatória');
    if (err2) return err2;
    return null;
  },

  registerCustomerSchema(body) {
    const mail = body.mail || body.email;
    if (!mail || !emailRegex.test(mail)) return 'E-mail inválido';
    if (!passwordRegex.test(body.password || ''))
      return 'Senha precisa ter no mínimo 6 caracteres, com maiúscula, minúscula e caractere especial';
    if (!body.name || String(body.name).length < 2)
      return 'Nome é obrigatório (mínimo 2 caracteres)';
    return null;
  },

  registerProviderSchema(body) {
    const mail = body.mail || body.email;
    if (!mail || !emailRegex.test(mail)) return 'E-mail inválido';
    if (!passwordRegex.test(body.password || ''))
      return 'Senha precisa ter no mínimo 6 caracteres, com maiúscula, minúscula e caractere especial';
    if (!body.name || String(body.name).length < 2)
      return 'Nome é obrigatório (mínimo 2 caracteres)';
    return null;
  },

  verify2FASchema(token) {
    if (!token) return 'Token 2FA é obrigatório';
    if (!/^\d{6}$/.test(String(token))) return 'Token 2FA deve ter 6 dígitos';
    return null;
  }
};
