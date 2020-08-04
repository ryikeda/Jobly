const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");

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

    const users = this.mapUsers(result);

    return users;
  }

  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, email, photo_url 
      FROM users 
      WHERE username = $1`,
      [username]
    );
    const user = this.mapUsers(result)[0];
    if (!user)
      throw new ExpressError(`No user found under username: ${username}`, 404);

    return user;
  }
  static async register(data) {
    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    const results = await db.query(
      `
    INSERT INTO users
    (username, password, first_name, last_name, email, photo_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING username, first_name, last_name, email, photo_url
    `,
      [
        data.username,
        hashedPassword,
        data.first_name,
        data.last_name,
        data.email,
        data.photo_url,
      ]
    );
    const user = this.mapUsers(results)[0];
    return user;
  }

  static async update(username, data) {
    let { query, values } = sqlForPartialUpdate(
      "users",
      data,
      "username",
      username
    );

    const result = await db.query(query, values);
    const user = this.mapUsers(result)[0];

    if (!user)
      throw new ExpressError(`No user found under username :${username}`, 404);

    delete user.password;
    delete user.is_admin;

    return user;
  }
  static async remove(username) {
    const result = await db.query(
      `
    DELETE FROM users WHERE username=$1
    RETURNING username`,
      [username]
    );
    if (!result.rows.length)
      throw new ExpressError(`No user found under username :${username}`, 404);
  }

  static mapUsers(results) {
    return results.rows.map(
      (user) =>
        new User(
          user.username,
          user.password,
          user.first_name,
          user.last_name,
          user.email,
          user.photo_url,
          user.is_admin
        )
    );
  }
}
module.exports = User;
