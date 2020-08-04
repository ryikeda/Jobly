const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../helpers/expressError");

const authRequired = (req, res, next) => {
  try {
    const tokenStr = req.body._token;
    jwt.verify(tokenStr, SECRET_KEY);
    return next();
  } catch (err) {
    return next(new ExpressError("Please login first", 401));
  }
};

module.exports = {
  authRequired,
};

const adminRequired = (req, res, next) => {
  try {
    const tokenStr = req.body._token;
    const token = jwt.verify(tokenStr, SECRET_KEY);
    if (token.is_admin) {
      return next();
    }
    throw new Error();
  } catch (err) {
    return next(new ExpressError("You must be admin to access", 401));
  }
};

const confirmUser = (req, res, next) => {
  try {
    const tokenStr = req.body._token;

    let token = jwt.verify(tokenStr, SECRET_KEY);

    if (token.username === req.params.username) {
      return next();
    }

    // throw an error, so we catch it in our catch, below
    throw new Error();
  } catch (err) {
    return next(new ExpressError("Unauthorized", 401));
  }
};

module.exports = {
  authRequired,
  adminRequired,
  confirmUser,
};
