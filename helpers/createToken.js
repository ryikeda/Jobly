const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const createToken = (user) => {
  let payload = {
    username: user.username,
    is_admin: user.is_admin,
  };
  return jwt.sign(payload, SECRET_KEY);
};

module.exports = createToken;
