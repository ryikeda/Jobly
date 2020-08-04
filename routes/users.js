const express = require("express");
const ExpressError = require("../helpers/expressError");
const User = require("../models/users");
const router = new express.Router();
const { validate } = require("jsonschema");

// GET routes
// Returns a list with users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll(req.query);
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

// Returns a user based on username
router.get("/:username", async (req, res, next) => {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;