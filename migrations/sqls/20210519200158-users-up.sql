/* Table to store users with access to the store */
CREATE TABLE users (
    "id" SERIAL PRIMARY KEY,
    "userName" VARCHAR UNIQUE,
    "firstName" VARCHAR,
    "lastName" VARCHAR,
    "password" VARCHAR
);