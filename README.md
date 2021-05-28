# Database setup
 - Install the latest Official postgres docker image - command `docker pull postgres`
 - Port used: Default postgres TCP port 5432
 - Production database - storefront
 - Test Database - storefront_test
 - User: postgres
 - Password: password123


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

# Package Installation Instructions

## Dependencies:
- express - `npm i express` - Node.js web app framework
- dotenv - `npm i dotenv` - Load environment variables
- pg - `npm i pg` - PostgreSQL client
- bcrypt - `npm i bcrypt` - Password hashing
- jsonwebtoken - `npm i jsonwebtoken` - JSON web tokens
- db-migrate - `npm i -g db-migrate` - Database migration tool
- db-migrate-pg - `npm -g db-migrate-pg` - PostgreSQL driver for DB

## Dev Dependencies:
- eslint - `npm i --save-dev eslint` - Linter
- prettier - `npm i --save-dev prettier` - Code formatting
- eslint-plugin-prettier - `npm i --save-dev eslint-plugin-prettier` - Run prettier as an eslint rule
- eslint-config-prettier - `npm i --save-dev eslint-config-prettier` - Disable conflicting eslint rules
- eslint-plugin-import - `npm i --save-dev eslint-plugin-import` - Support for ES6 import/export syntax
- jasmine-ts - `npm i --save-dev jasmine-ts` - Jasmine unit testing
- jasmine-spec-reporter - `npm i --save-dev jasmine-spec-reporter` - Jasmine test output formatting
- nodemon - `npm i --save-dev nodemon` - Monitor files & auto restart node
- supertest - `npm i --save-dev supertest` - HTTP testing
- ts-node - `npm i --save-dev ts-node` - Typescript node.js

### Types for typescript support for installed packages
	@types/bcrypt - `npm -i --save-dev @types/bcrypt`
	@types/express - `npm -i --save-dev @types/express`
	@types/jasmine - `npm -i --save-dev @types/jasmine`
	@types/jsonwebtoken - `npm -i --save-dev @types/jsonwebtoken`
	@types/node - `npm -i --save-dev @types/node`
	@types/pg - `npm -i --save-dev @types/pg`
	@types/supertest - `npm -i --save-dev @types/supertest`
	@typescript-eslint/eslint-plugin - `npm -i --save-dev @typescript-eslint/eslint-plugin`
	@typescript-eslint/parser - `npm -i --save-dev @typescript-eslint/parser`

# Endpoints
 - See REQUIREMENTS.md file

 # Database Schema
 - See REQUIREMENTS.md file