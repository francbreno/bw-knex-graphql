DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS entries;
DROP TABLE IF EXISTS transactions;

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE TABLE accounts(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp,

  parent_account_id INTEGER REFERENCES accounts,
  user_id INTEGER REFERENCES users NOT NULL
);

CREATE TABLE entries(
  id SERIAL PRIMARY KEY,
  value DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp,

  account_id INTEGER REFERENCES accounts NOT NULL,
  transaction_id integer references transactions(id) not null
);

CREATE TABLE transactions(
  id SERIAL PRIMARY KEY,
  executed_at TIMESTAMP,
  description TEXT,
  value DECIMAL(10, 2) NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
  updated_at TIMESTAMP NOT NULL DEFAULT current_timestamp,

  origin_account_id INTEGER REFERENCES accounts,
  destiny_account_id INTEGER REFERENCES accounts not null
);