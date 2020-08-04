DROP DATABASE IF EXISTS jobly;
CREATE DATABASE jobly;

\c jobly

DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS users;

CREATE TABLE companies(
    handle TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    num_employees INTEGER,
    description TEXT,
    logo_url TEXT
);

CREATE TABLE jobs(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    salary FLOAT NOT NULL,
    equity FLOAT CHECK(equity <= 1.0) NOT NULL,
    company_handle TEXT NOT NULL REFERENCES companies ON DELETE CASCADE
);

CREATE TABLE users(
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    photo_url TEXT,
    is_admin BOOLEAN NOT NULL default FALSE
);


-- SAMPLE DATA
INSERT INTO companies 
VALUES
('apple', 'apple inc', 1000,'this is the description', 'logo.com'),
('google', 'Google LLC', 110000,'this is the description' , 'logo.com/google');
 
 INSERT INTO jobs
 (title, salary, company_handle, equity)
 VALUES
 ('engineer', 100000, 'apple',0.01),
 ('software engineer', 120000, 'apple',0.02),
 ('data scientist', 200000, 'google',0.01);

 INSERT INTO users
 (username, password, first_name, last_name, email)
 VALUES
 ('user', 'password', 'John','Doe','johndoe@email.com')
