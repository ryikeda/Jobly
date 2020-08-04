const express = require("express");
const ExpressError = require("../helpers/expressError");
const Company = require("../models/companies");
const router = new express.Router();
const { validate } = require("jsonschema");
const companyNewSchema = require("../schemas/companyNew.json");
const companyUpdateSchema = require("../schemas/companyUpdate.json");
const { adminRequired, authRequired } = require("../middleware/auth");
// GET routes
// Returns a list of all companies, allows for queries
router.get("/", authRequired, async (req, res, next) => {
  try {
    const companies = await Company.findAll(req.query);
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});

// Returns a company based on handle
router.get("/:handle", authRequired, async (req, res, next) => {
  try {
    const company = await Company.get(req.params.handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

// POST route
// Creates new company
router.post("/", adminRequired, async (req, res, next) => {
  try {
    const validation = validate(req.body, companyNewSchema);
    if (!validation.valid) {
      throw new ExpressError(
        validation.errors.map((e) => e.stack),
        400
      );
    }
    const company = await Company.create(req.body);
    return res.status(201).json({ company });
  } catch (err) {
    // Check for duplicates
    if (err.code === "23505") {
      err = new ExpressError(
        `A company with this handle ${req.body.handle} already exists`,
        400
      );
    }
    return next(err);
  }
});

// PACTH route
// Updates a company
router.patch("/:handle", adminRequired, async (req, res, next) => {
  try {
    const validation = validate(req.body, companyUpdateSchema);
    if (!validation.valid) {
      throw new ExpressError(
        validation.errors.map((e) => e.stack),
        400
      );
    }
    const company = await Company.update(req.params.handle, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

// DELETE route
// Deletes a company

router.delete("/:handle", adminRequired, async (req, res, next) => {
  try {
    await Company.remove(req.params.handle);
    return res.json({ message: "Company deleted" });
  } catch (err) {
    return next(err);
  }
});
module.exports = router;
