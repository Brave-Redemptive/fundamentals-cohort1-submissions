CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    balance NUMERIC(12, 2) NOT NULL DEFAULT 0
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    from_account INTEGER REFERENCES accounts(id),
    to_account INTEGER REFERENCES accounts(id),
    amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    balance NUMERIC(12, 2) NOT NULL DEFAULT 0
);
