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

// POST routes
describe("POST /users", () => {
  test("Creates a new user", async () => {
    const resp = await request(app).post("/users").send({
      username: "postUser",
      password: "password",
      first_name: "postFirst",
      last_name: "postLast",
      email: "postuser@email.com",
    });
    expect(resp.statusCode).toBe(201);
    const user = resp.body.user;
    expect(user.username).not.toBe(null);
    expect(user.fist_name).not.toBe(null);
    expect(user.last_name).not.toBe(null);
    expect(user.email).not.toBe(null);
  });

  test("Prevents from creating with missing username", async () => {
    const { first_name, last_name, email } = TEST_DATA.user;
    const password = "password";
    const resp = await request(app)
      .post("/users")
      .send({ password, first_name, last_name, email });
    expect(resp.statusCode).toBe(400);
  });
});

// PATCH route
describe("PATCH /users/:username", () => {
  test("Updates a single user", async () => {
    const resp = await request(app)
      .patch(`/users/${TEST_DATA.user.username}`)
      .send({
        first_name: "updatedFirst",
        last_name: "updatedLast",
        email: "updatedEmail@email.com",
      });
    const user = resp.body.user;
    expect(user.username).not.toBe(null);
    expect(user.first_name).toBe("updatedFirst");
    expect(user.last_name).toBe("updatedLast");
    expect(user.email).toBe("updatedEmail@email.com");
  });

  test("Prevents a bad user update", async () => {
    const resp = await request(app).patch(`/users/${TEST_DATA.username}`).send({
      invalid: "invalid",
    });
    expect(resp.statusCode).toBe(400);
  });

  test("Returns 404 if no match", async () => {
    const resp = await request(app).patch(`/users/notauser`).send({
      first_name: "notauser",
    });
    expect(resp.statusCode).toBe(404);
  });
});

// DELETE route
describe("DELETE /users/:id", () => {
  test("Deletes a single user", async () => {
    const resp = await request(app).delete(`/users/${TEST_DATA.user.username}`);
    expect(resp.body).toEqual({ message: "User deleted" });
  });
  test("Returns 404 if no match", async () => {
    const resp = await request(app).delete(`/users/notauser`);
    expect(resp.statusCode).toBe(404);
  });
});
