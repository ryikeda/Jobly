const express = require("express");
const ExpressError = require("../helpers/expressError");
const User = require("../models/users");
const router = new express.Router();
const { validate } = require("jsonschema");
const userNewSchema = require("../schemas/usersNew.json");
const userUpdateSchema = require("../schemas/usersUpdate.json");
const createToken = require("../helpers/createToken");
const auth = require("../middleware/auth");
const { confirmUser, authRequired } = require("../middleware/auth");

// GET routes
// Returns a list with users
router.get("/", authRequired, async (req, res, next) => {
  try {
    const users = await User.findAll(req.query);
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

// Returns a user based on username
router.get("/:username", authRequired, async (req, res, next) => {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

// POST route
router.post("/", async (req, res, next) => {
  try {
    const validation = validate(req.body, userNewSchema);
    if (!validation.valid) {
      throw new ExpressError(
        validation.errors.map((e) => e.stack),
        400
      );
    }
    const user = await User.register(req.body);
    const _token = createToken(user);
    return res.status(201).json({ _token });
  } catch (err) {
    return next(err);
  }
});

// PATCH route
router.patch("/:username", confirmUser, async (req, res, next) => {
  try {
    const validation = validate(req.body, userUpdateSchema);
    if (!validation.valid) {
      throw new ExpressError(
        validation.errors.map((e) => e.stack),
        400
      );
    }

    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

// DELETE route
// Deletes a user
router.delete("/:username", confirmUser, async (req, res, next) => {
  try {
    await User.remove(req.params.username);
    return res.json({ message: "User deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
