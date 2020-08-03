const db = require("../db");
const ExpressError = require("../helpers/expressError");

class Company {
  constructor(
    handle,
    name,
    num_emlpoyees = null,
    description = null,
    logo_url = null
  ) {
    this.handle = handle;
    this.name = name;
    this.num_emlpoyees = num_emlpoyees;
    this.description = description;
    this.logo_url = logo_url;
  }
  static async findAll(data) {
    let baseQuery = `SELECT handle, name FROM companies`;
    const whereExpressions = [];
    const queryValues = [];

    if (+data.min_employees >= +data.max_employees) {
      throw new ExpressError(
        "Min employees must be less than max employees",
        400
      );
    }

    if (data.search) {
      queryValues.push(`%${data.search}%`);
      whereExpressions.push(`name ILIKE $${queryValues.length}`);
    }

    if (data.min_employees) {
      queryValues.push(+data.min_employees);
      whereExpressions.push(`num_employees >= $${queryValues.length}`);
    }

    if (data.max_employees) {
      queryValues.push(+data.max_employees);
      whereExpressions.push(`num_employees <= $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      baseQuery += " WHERE ";
    }

    const finalQuery =
      baseQuery + whereExpressions.join(" AND ") + " ORDER BY name";
    const results = await db.query(finalQuery, queryValues);

    return results.rows.map(
      (company) =>
        new Company(
          company.handle,
          company.name,
          company.num_emlpoyees,
          company.description,
          company.logo_url
        )
    );
  }

  static async get(handle) {
    const resp = await db.query(
      `
    SELECT handle, name, num_employees, description, logo_url FROM companies
    WHERE handle = $1`,
      [handle]
    );

    const company = resp.rows.map(
      (company) =>
        new Company(
          company.handle,
          company.name,
          company.num_emlpoyees,
          company.description,
          company.logo_url
        )
    );

    if (!company.length)
      throw new ExpressError(`No company found under: ${handle}`, 404);

    return company;
  }
}

module.exports = Company;
