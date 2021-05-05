/* Replace with your SQL commands */

/* Table to store the list of products available in the store with their associated price and category */
CREATE TABLE products (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR, 
    "price" NUMERIC(17,2), /* Limit price to 15 digits before decimal, and two after. */
    "category" VARCHAR
);

/* Table to store users with access to the store */
CREATE TABLE users (
    "id" SERIAL PRIMARY KEY,
    "userName" VARCHAR,
    "firstName" VARCHAR,
    "lastName" VARCHAR,
    "password" VARCHAR
);

CREATE TABLE orders (
    "id" SERIAL PRIMARY KEY,
    "user_id" BIGINT REFERENCES users(id),
    "complete"  BOOLEAN
);

CREATE TABLE order_products (
    "id" SERIAL PRIMARY KEY,
    "quantity" INTEGER,
    "order_id" BIGINT REFERENCES orders(id),
    "product" BIGINT REFERENCES products(id)
);