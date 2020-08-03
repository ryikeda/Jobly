const db = require("../../db");

const TEST_DATA = {};

const setupBeforeTest = async (TEST_DATA) => {
  try {
    // Create Sample data for companies
    const companiesRes = await db.query(
      `INSERT INTO companies 
        (handle, name, num_employees)
       VALUES ($1, $2, $3) 
       RETURNING *`,
      ["tst", "test inc", 10]
    );
    // Add to TEST_DATA to be exported
    TEST_DATA.currentCompany = companiesRes.rows[0];
  } catch (err) {
    console.log(err);
  }
};

const setupAfterTest = async () => {
  try {
    await db.query(`DELETE FROM companies`);
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
