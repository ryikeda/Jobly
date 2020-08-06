const User = require("../models/users");
const express = require("express");
const router = new express.Router();

const createToken = require("../helpers/createToken");

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.authenticate(req.body);
    const _token = createToken(user);
    return res.json({ _token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
