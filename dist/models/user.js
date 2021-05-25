"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = __importDefault(require("../database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;
class UserModel {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Unable to retrieve users: ${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users WHERE "id"=$1';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Unable to retrieve user ${id}: ${err}`);
        }
    }
    async create(u) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'INSERT INTO users ("userName", "firstName", "lastName", "password") VALUES ($1, $2, $3, $4) RETURNING *';
            const hash = bcrypt_1.default.hashSync(u.password + pepper, parseInt(saltRounds));
            const result = await conn.query(sql, [
                u.userName,
                u.firstName,
                u.lastName,
                hash
            ]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Unable to create user (${u.userName}): ${err}`);
        }
    }
    async edit(u) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'UPDATE users SET "userName" = $1, "firstName" = $2, "lastName" = $3, "password" = $4 WHERE "id" = $5 RETURNING *';
            const hash = bcrypt_1.default.hashSync(u.password + pepper, parseInt(saltRounds));
            const result = await conn.query(sql, [
                u.userName,
                u.firstName,
                u.lastName,
                hash,
                u.id
            ]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Unable to create user (${u.userName}): ${err}`);
        }
    }
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'DELETE FROM users WHERE "id"=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            const user = result.rows[0];
            return user;
        }
        catch (err) {
            throw new Error(`Unable to delete user (${id}): ${err}`);
        }
    }
    async authenticate(userName, password) {
        const conn = await database_1.default.connect();
        const sql = 'SELECT "password" FROM users WHERE "userName"=$1';
        const result = await conn.query(sql, [userName]);
        if (result.rows.length) {
            const user = result.rows[0];
            if (bcrypt_1.default.compareSync(password + pepper, user.password)) {
                return user;
            }
        }
        throw new Error('Invalid username or Password');
    }
}
exports.UserModel = UserModel;
