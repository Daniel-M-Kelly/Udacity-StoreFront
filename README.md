# Database setup
 - postgres database docker image running on localhost port 5432
 - production database - storefront
 - test database - storefront_test
 - user: postgres
 - password: password123


# .env file contents
	EXPRESS_PORT=3000
	POSTGRES_HOST=127.0.0.1
	POSTGRES_DB=storefront
	POSTGRES_DB_TEST=storefront_test
	POSTGRES_USER=postgres
	POSTGRES_PASSWORD=password123
	BCRYPT_PASSWORD=password321
	SALT_ROUNDS=10
	ENV=dev
	TOKEN_SECRET=123password


# npm scripts

- npm run prettier - run prettier check - "prettier": "npx prettier **/*.ts --check"

- npm run lint - run lint with prettier plugin, and auto fix issues. - "lint": "eslint **/*.ts --fix --quiet" 

- npm run test - Set environment to test, create test database, run jasmine, then drop test database. Note: for windows systems you need to include the "Set" command to set the ENV variable
"test": "set ENV=test&& db-migrate db:create storefront_test && db-migrate --env test up && jasmine-ts"

- npm run start-dev - start development app /w nodemon monitoring for changes - "start-dev": "nodemon src/server.ts"

- npm run build - build production version of app in ./dist/ folder - "build": "npx tsc"

- npm run start-prod - Start production app from ./dist folder - "start-prod": "node ./dist/server.js"