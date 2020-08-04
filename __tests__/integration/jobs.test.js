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

// PATCH route
describe("PATCH /jobs/:id", () => {
  test("Updates a single job's title", async () => {
    const resp = await request(app).patch(`/jobs/${TEST_DATA.job.id}`).send({
      title: "updatedTitle",
    });
    const job = resp.body.job;
    expect(job.title).toBe("updatedTitle");
    expect(job.equity).not.toBe(null);
    expect(job.salary).not.toBe(null);
    expect(job.company_handle).not.toBe(null);
  });

  test("Prevents a bad job update", async () => {
    const resp = await request(app).patch(`/jobs/${TEST_DATA.job.id}`).send({
      invalid: "invalid",
    });
    expect(resp.statusCode).toBe(500);
  });

  test("Returns 404 if no match", async () => {
    const resp = await request(app).patch(`/jobs/0`).send({
      title: "patchTest",
    });
    expect(resp.statusCode).toBe(404);
  });
});

// DELETE route
describe("DELETE /jobs/:id", () => {
  test("Deletes a single company", async () => {
    const resp = await request(app).delete(`/jobs/${TEST_DATA.job.id}`);
    expect(resp.body).toEqual({ message: "Job deleted" });
  });
  test("Returns 404 if no match", async () => {
    const resp = await request(app).delete(`/jobs/0`);
    expect(resp.statusCode).toBe(404);
  });
});
