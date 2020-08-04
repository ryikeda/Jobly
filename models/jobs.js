const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class Job {
  constructor(id, title, salary, equity, company_handle) {
    this.id = id;
    this.title = title;
    this.salary = salary;
    this.equity = equity;
    this.company_handle = company_handle;
  }

  static async findAll(data) {
    let baseQuery = `SELECT id, title, salary, equity, company_handle FROM jobs`;
    const whereExpressions = [];
    const queryValues = [];

    if (data.min_salary) {
      queryValues.push(+data.min_salary);
      whereExpressions.push(`salary >= $${queryValues.length}`);
    }
    if (data.min_equity) {
      queryValues.push(+data.min_equity);
      whereExpressions.push(`equity >= $${queryValues.length}`);
    }
    if (data.search) {
      queryValues.push(`%${data.search}%`);
      whereExpressions.push(`title ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      baseQuery += " WHERE ";
    }

    const finalQuery =
      baseQuery + whereExpressions.join(" AND ") + " ORDER BY title";
    const results = await db.query(finalQuery, queryValues);

    const jobs = this.mapJobs(results);

    if (!jobs.length) throw new ExpressError(`No job found`, 404);

    return jobs;
  }

  static async get(id) {
    const result = await db.query(
      `
    SELECT id, title, salary, equity, company_handle
    FROM jobs WHERE id=$1`,
      [id]
    );
    const job = this.mapJobs(result)[0];
    if (!job) throw new ExpressError(`No job found under id :${id}`, 404);

    return job;
  }

  static async create(data) {
    const results = await db.query(
      `
    INSERT INTO jobs 
    (title, salary, equity, company_handle)
    VALUES ($1, $2, $3, $4)
    RETURNING 
    id, title, salary, equity, company_handle`,
      [data.title, data.salary, data.equity, data.company_handle]
    );
    const job = this.mapJobs(results)[0];
    return job;
  }

  static async update(id, data) {
    let { query, values } = sqlForPartialUpdate("jobs", data, "id", id);

    const result = await db.query(query, values);
    const job = result.rows[0];

    if (!job) throw new ExpressError(`No job found under id :${id}`, 404);

    return job;
  }

  static async remove(id) {
    const result = await db.query(
      `
    DELETE FROM jobs WHERE id=$1
    RETURNING id`,
      [id]
    );
    if (!result.rows.length)
      throw new ExpressError(`No job found under id :${id}`, 404);
  }

  static mapJobs(results) {
    return results.rows.map(
      (job) =>
        new Job(job.id, job.title, job.salary, job.equity, job.company_handle)
    );
  }
}

module.exports = Job;
