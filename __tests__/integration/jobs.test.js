const request = require("supertest");

const app = require("../../app");

const {
  setupBeforeTest,
  setupAfterTest,
  afterAllTests,
  TEST_DATA,
} = require("./jest_config");

beforeEach(async () => {
  await setupBeforeTest(TEST_DATA);
});

afterEach(async () => {
  await setupAfterTest();
});
afterAll(async () => {
  await afterAllTests();
});

// GET routes

describe("GET /jobs", () => {
  test("Gets a list of one job", async () => {
    const resp = await request(app).get("/jobs");
    const job = resp.body.jobs[0];
    expect(job).toHaveProperty("company_handle");
  });

  test("Gets job with search query", async () => {
    const resp = await request(app).get(`/jobs?search=${TEST_DATA.job.title}`);
    const job = resp.body.jobs[0];
    expect(job).toHaveProperty("company_handle");
  });

  test("Returns 404 if no match", async () => {
    const resp = await request(app).get(`/jobs?search=notajob`);
    expect(resp.body.status).toEqual(404);
  });
});

describe("GET /jobs/:id", () => {
  test("Gets a list of one job", async () => {
    const resp = await request(app).get(`/jobs/${TEST_DATA.job.id}`);
    console.log(resp.body);
    const job = resp.body.job;
    expect(job).toHaveProperty("company_handle");
  });

  test("Returns 404 if no match", async () => {
    const resp = await request(app).get(`/jobs/0`);
    expect(resp.body.status).toEqual(404);
  });
});
