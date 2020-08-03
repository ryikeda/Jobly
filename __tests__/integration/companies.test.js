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

describe("GET /companies/:handle", () => {});
