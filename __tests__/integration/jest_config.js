const db = require("../../db");
const bcrypt = require("bcrypt");

const TEST_DATA = {};

const setupBeforeTest = async (TEST_DATA) => {
  try {
    // Create test data for companies
    const companiesRes = await db.query(
      `INSERT INTO companies 
        (handle, name, num_employees)
       VALUES ($1, $2, $3) 
       RETURNING *`,
      ["tst", "test inc", 10]
    );
    // Add to TEST_DATA to be exported
    TEST_DATA.currentCompany = companiesRes.rows[0];

    // Create test data for jobs
    const jobsRes = await db.query(
      `
    INSERT INTO jobs (title, salary, equity, company_handle)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
      ["software engineer", "110000", 0.01, TEST_DATA.currentCompany.handle]
    );
    TEST_DATA.job = jobsRes.rows[0];

    // Create test data for users
    const hashedPassword = await bcrypt.hash("password", 1);
    const userRes = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, email)
      VALUES ('testUser', $1, 'userFirst', 'userLast', 'user@email.com') RETURNING *`,
      [hashedPassword]
    );
    TEST_DATA.user = userRes.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const setupAfterTest = async () => {
  try {
    await db.query(`DELETE FROM companies`);
    await db.query(`DELETE FROM jobs`);
    await db.query(`DELETE FROM users`);
  } catch (err) {
    console.log(err);
  }
};

const afterAllTests = async () => {
  try {
    await db.end();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  setupBeforeTest,
  setupAfterTest,
  afterAllTests,
  TEST_DATA,
};
