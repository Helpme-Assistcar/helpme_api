const jwt = require("jsonwebtoken");

class TokenManager {
  generate(userId, secretKey, expirationTime) {
    const token = jwt.sign({ sub: userId }, secretKey, {
      expiresIn: expirationTime,
    });

    return token;
  }
}

module.exports = new TokenManager();
