const express = require("express");
const ExpressError = require("../helpers/expressError");
const Job = require("../models/jobs");
const router = new express.Router();
const { validate } = require("jsonschema");
const { adminRequired, authRequired } = require("../middleware/auth");
const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");

// GET routes
// Returns a list with jobs
router.get("/", authRequired, async (req, res, next) => {
  try {
    const jobs = await Job.findAll(req.query);
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});
// Return one job
router.get("/:id", authRequired, async (req, res, next) => {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

// POST routes
// Creates a new job
router.post("/", adminRequired, async (req, res, next) => {
  try {
    const validation = validate(req.body, jobNewSchema);
    if (!validation.valid) {
      throw new ExpressError(
        validation.errors.map((e) => e.stack),
        400
      );
    }
    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
});
// Updates state of application
router.post("/:id/apply", authRequired, async (req, res, next) => {
  try {
    const state = req.body.state || "applied";
    await Job.apply(req.params.id, res.locals.username, state);
    return res.json({ message: state });
  } catch (err) {
    return next(err);
  }
});

// PATCH route
// Updates a job
router.patch("/:id", adminRequired, async (req, res, next) => {
  try {
    const validation = validate(req.body, jobUpdateSchema);
    if (!validation.valid) {
      throw new ExpressError(
        validation.errors.map((e) => e.stack),
        400
      );
    }
    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

// DELETE route
// Delets a job
router.delete("/:id", adminRequired, async (req, res, next) => {
  try {
    await Job.remove(req.params.id);
    return res.json({ message: "Job deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
