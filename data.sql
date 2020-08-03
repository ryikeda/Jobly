DROP DATABASE IF EXISTS jobly;
CREATE DATABASE jobly;

\c jobly

DROP TABLE IF EXISTS companies;

CREATE TABLE companies(
    handle TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    num_employees INTEGER,
    description TEXT,
    logo_url TEXT
);

-- SAMPLE DATA
INSERT INTO companies 
VALUES
('apple', 'apple inc', 1000,'this is the description', 'logo.com'),
('google', 'Google LLC', 110000,'this is the description' , 'logo.com/google');
 