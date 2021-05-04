Installed dotenv package for environment variables including postgres user, password, and database.


Database design
3  tables:
    products - id , name VARCHAR, price NUMERIC(17,2), category VARCHAR
    users - id , firstName VARCHAR, lastName VARCHAR, password VARCHAR
    orders - id , product_id , quantity INT, user_id, complete boolean 

- The design specifies that an order status can only be active or complete. So rather than use a varchar column to store those values, it's more efficient to use a boolean value to represent the two possible states. In a real situation, I would ask weather there is a possibility of additional status' such as 'Returned', or 'Cancelled'

db-migrate installed
    database.json with dev and test DBs.