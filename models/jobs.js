const db = require("../db");
const ExpressError = require("../helpers/expressError");

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

  static mapJobs(results) {
    return results.rows.map(
      (job) =>
        new Job(job.id, job.title, job.salary, job.equity, job.company_handle)
    );
  }
}

module.exports = Job;
