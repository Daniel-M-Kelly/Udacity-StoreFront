/* Table to store the list of products available in the store with their associated price and category */
CREATE TABLE products (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR, 
    "price" NUMERIC(17,2), /* Limit price to 15 digits before decimal, and two after. */
    "category" VARCHAR
);