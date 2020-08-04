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

describe("GET /users", () => {
  test("Gets a list of one user", async () => {
    const resp = await request(app).get("/users");
    const user = resp.body.users[0];

    expect(user.username).not.toBe(null);
    expect(user.fist_name).not.toBe(null);
    expect(user.last_name).not.toBe(null);
    expect(user.email).not.toBe(null);
  });
});

describe("GET /users/:username", () => {
  test("Gets a single user", async () => {
    const resp = await request(app).get(`/users/${TEST_DATA.user.username}`);
    const user = resp.body.user;
    console.log(user);

    expect(user.username).not.toBe(null);
    expect(user.fist_name).not.toBe(null);
    expect(user.last_name).not.toBe(null);
    expect(user.email).not.toBe(null);
  });
  test("Returns 404 if no match", async () => {
    const resp = await request(app).get(`/users/notauser`);
    expect(resp.body.status).toEqual(404);
  });
});
