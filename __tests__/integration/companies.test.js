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

describe("GET /companies", () => {
  test("Gets a list of one company", async () => {
    const resp = await request(app).get("/companies");
    expect(resp.body.companies).toHaveLength(1);
    expect(resp.body.companies[0].handle).toEqual(
      TEST_DATA.currentCompany.handle
    );
  });
});
