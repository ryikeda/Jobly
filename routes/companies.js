const express = require("express");
const ExpressError = require("../helpers/expressError");
const Company = require("../models/companies");
const router = new express.Router();

router.get("/", async (req, res, next) => {
  try {
    const companies = await Company.findAll(req.query);
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
