/* Table to store users with access to the store */
CREATE TABLE users (
    "id" SERIAL PRIMARY KEY,
    "userName" VARCHAR UNIQUE NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "lastName" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL
);