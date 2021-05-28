CREATE TABLE orders (
    "id" SERIAL PRIMARY KEY,
    "user_id" BIGINT REFERENCES users(id) NOT NULL,
    "complete"  BOOLEAN NOT NULL
);