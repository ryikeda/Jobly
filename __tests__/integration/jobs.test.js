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
    const job = resp.body.job;
    expect(job).toHaveProperty("company_handle");
  });

  test("Returns 404 if no match", async () => {
    const resp = await request(app).get(`/jobs/0`);
    expect(resp.body.status).toEqual(404);
  });
});

// POST route
describe("POST /jobs", () => {
  test("Creates a new job", async () => {
    const resp = await request(app).post("/jobs").send({
      title: "manager",
      salary: 135000,
      equity: 0.05,
      company_handle: TEST_DATA.currentCompany.handle,
    });
    expect(resp.statusCode).toBe(201);
    expect(resp.body.job).toHaveProperty("company_handle");
  });

  test("Prevents from creating with missing title", async () => {
    const { salary, equity, company_handle } = TEST_DATA.job;
    const resp = await request(app)
      .post("/jobs")
      .send({ salary, equity, company_handle });
    expect(resp.statusCode).toBe(400);
  });
  test("Prevents from creating with missing company_handle", async () => {
    const { title, salary, equity } = TEST_DATA.job;
    const resp = await request(app)
      .post("/jobs")
      .send({ title, salary, equity });
    expect(resp.statusCode).toBe(400);
  });
});
