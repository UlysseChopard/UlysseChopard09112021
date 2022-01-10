const fs = require("fs");

const getSecret = (secret) => fs.readFileSync(secret);

module.exports = {
  getSecret,
};
