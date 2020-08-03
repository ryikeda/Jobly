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
describe("GET /companies", () => {
  test("Gets a list of one company", async () => {
    const resp = await request(app).get("/companies");
    expect(resp.body.companies).toHaveLength(1);
    expect(resp.body.companies[0].handle).toEqual(
      TEST_DATA.currentCompany.handle
    );
  });
  test("Gets company with search query", async () => {
    const resp = await request(app).get("/companies?search=test");
    expect(resp.body.companies).toHaveLength(1);
    expect(resp.body.companies[0].handle).toEqual(
      TEST_DATA.currentCompany.handle
    );
  });

  test("Returns 404 if no match for search query", async () => {
    const resp = await request(app).get("/companies?search=notacompany");
    expect(resp.body.status).toEqual(404);
  });
});

describe("GET /companies/:handle", () => {
  test("Gets a single company", async () => {
    const resp = await request(app).get(
      `/companies/${TEST_DATA.currentCompany.handle}`
    );
    expect(resp.body.company[0]).toHaveProperty("handle");
    expect(resp.body.company[0].handle).toEqual(
      TEST_DATA.currentCompany.handle
    );
  });
  test("Returns 404 if no match", async () => {
    const resp = await request(app).get(`/companies/notacompany`);
    expect(resp.body.status).toEqual(404);
  });
});

// POST route
describe("POST /companies", () => {
  test("Creates a new company", async () => {
    const resp = await request(app).post("/companies").send({
      handle: "postTest",
      name: "postTest Inc",
    });
    expect(resp.statusCode).toBe(201);
    expect(resp.body.company[0]).toHaveProperty("handle");
    expect(resp.body.company[0].name).toEqual("postTest Inc");
  });

  test("Prevents from creating a duplicate company", async () => {
    const { handle, name } = TEST_DATA.currentCompany;
    const resp = await request(app).post("/companies").send({ handle, name });
    expect(resp.statusCode).toBe(400);
  });
  test("Prevents from creating a with missing handle", async () => {
    const { name } = TEST_DATA.currentCompany;
    const resp = await request(app).post("/companies").send({ name });
    expect(resp.statusCode).toBe(400);
  });
  test("Prevents from creating a with missing name", async () => {
    const { handle } = TEST_DATA.currentCompany;
    const resp = await request(app).post("/companies").send({ handle });
    expect(resp.statusCode).toBe(400);
  });
});
