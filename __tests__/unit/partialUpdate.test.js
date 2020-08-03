const sqlForPartialUpdate = require("../../helpers/partialUpdate");

describe("partialUpdate()", () => {
  it("should generate a proper partial update query with just 1 field", () => {
    const { query, values } = sqlForPartialUpdate(
      "users",
      { first_name: "Test" },
      "username",
      "newusername"
    );
    // FIXME: write real tests!
    expect(query).toEqual(
      "UPDATE users SET first_name=$1 WHERE username=$2 RETURNING *"
    );
    expect(values).toEqual(["Test", "newusername"]);
  });
});
