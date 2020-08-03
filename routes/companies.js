const express = require("express");
const ExpressError = require("../helpers/expressError");
const Company = require("../models/companies");
const router = new express.Router();

// GET routes
// Returns a list of all companies, allows for queries
router.get("/", async (req, res, next) => {
  try {
    const companies = await Company.findAll(req.query);
    return res.json(companies);
  } catch (err) {
    return next(err);
  }
});

// Returns a company based on handle
router.get("/:handle", async (req, res, next) => {
  try {
    const company = await Company.get(req.params.handle);
    return res.json(company);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
