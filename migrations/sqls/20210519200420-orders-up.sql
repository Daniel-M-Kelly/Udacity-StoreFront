CREATE TABLE orders (
    "id" SERIAL PRIMARY KEY,
    "user_id" BIGINT REFERENCES users(id),
    "complete"  BOOLEAN
);