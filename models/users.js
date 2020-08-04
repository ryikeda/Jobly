const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

class User {
  constructor(
    username,
    password,
    first_name,
    last_name,
    email,
    photo_url,
    is_admin
  ) {
    this.username = username;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.photo_url = photo_url;
    this.is_admin = is_admin;
  }
  static async findAll() {
    const result = await db.query(
      `SELECT username, first_name, last_name, email
        FROM users
        ORDER BY username`
    );
    return result.rows;
  }

  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, email, photo_url 
      FROM users 
      WHERE username = $1`,
      [username]
    );
    const user = result.rows[0];
    if (!user)
      throw new ExpressError(`No user found under username: ${username}`, 404);

    return user;
  }
}
module.exports = User;
