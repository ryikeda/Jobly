const express = require("express");
const ExpressError = require("../helpers/expressError");
const Job = require("../models/jobs");
const router = new express.Router();
const { validate } = require("jsonschema");
const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobNew.json");

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
// Return one job
router.get("/:id", async (req, res, next) => {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

// POST route
// Creates a new job
router.post("/", async (req, res, next) => {
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

// PATCH route
// Updates a job
router.patch("/:id", async (req, res, next) => {
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
router.delete("/:id", async (req, res, next) => {
  try {
    await Job.remove(req.params.id);
    return res.json({ message: "Job deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
