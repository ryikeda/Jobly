const express = require("express");
const ExpressError = require("../helpers/expressError");
const Company = require("../models/companies");
const router = new express.Router();

// GET routes
// Returns a list of all companies, allows for queries
router.get("/", async (req, res, next) => {
  try {
    const companies = await Company.findAll(req.query);
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});

// Returns a company based on handle
router.get("/:handle", async (req, res, next) => {
  try {
    const company = await Company.get(req.params.handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

// POST route
// Creates new company
router.post("/", async (req, res, next) => {
  try {
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
router.patch("/:handle", async (req, res, next) => {
  try {
    const company = await Company.update(req.params.handle, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

// DELETE route
// Deletes a company

router.delete("/:handle", async (req, res, next) => {
  try {
    await Company.remove(req.params.handle);
    return res.json({ message: "Company deleted" });
  } catch (err) {
    return next(err);
  }
});
module.exports = router;
