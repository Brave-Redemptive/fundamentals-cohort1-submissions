CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  owner VARCHAR(100),
  balance NUMERIC DEFAULT 0
);

INSERT INTO accounts(owner, balance)
VALUES ('John Doe', 5000), ('Jane Doe', 3000);
