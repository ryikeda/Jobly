const express = require("express");
const ExpressError = require("../helpers/expressError");
const Job = require("../models/jobs");
const router = new express.Router();
const { validate } = require("jsonschema");

// GET routes
// Returns a list with jobs
router.get("/", async (req, res, next) => {
  try {
    const jobs = await Job.findAll(req.query);
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
