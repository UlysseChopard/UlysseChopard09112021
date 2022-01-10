const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hashPassword = (password) => bcrypt.hash(password, 10);

const checkPassword = (passwordToCheck, hash) =>
  bcrypt.compare(passwordToCheck, hash);

const generateUserToken = (
  userId,
  salt = "RANDOM_TOKEN_SECRET",
  expiration = "24h"
) => {
  return jwt.sign({ userId }, salt, {
    expiresIn: expiration,
  });
};

module.exports = {
  hashPassword,
  checkPassword,
  generateUserToken,
};
