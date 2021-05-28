"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAuthToken_1 = __importDefault(require("../middleware/verifyAuthToken"));
const store = new user_1.UserModel();
const index = async (_req, res) => {
    const users = await store.index();
    res.json(users);
};
const show = async (req, res) => {
    const user = await store.show(req.body.id);
    res.json(user);
};
const create = async (req, res) => {
    const user = {
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    };
    try {
        const newUser = await store.create(user);
        const token = jsonwebtoken_1.default.sign({
            user: newUser
        }, process.env.TOKEN_SECRET);
        res.json({ ...newUser, token: token });
    }
    catch (err) {
        res.status(400);
        res.json(err + user);
    }
};
const edit = async (req, res) => {
    const user = {
        id: req.body.id,
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    };
    try {
        const updatedUser = await store.edit(user);
        return res.json(updatedUser);
    }
    catch (err) {
        res.status(400);
        res.json(err + user);
    }
};
const destroy = async (req, res) => {
    const deleted = await store.delete(req.body.id);
    res.json(deleted);
};
const authenticate = async (req, res) => {
    const user = {
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    };
    try {
        const u = await store.authenticate(user.userName, user.password);
        const token = jsonwebtoken_1.default.sign({
            user: u
        }, process.env.TOKEN_SECRET);
        res.json(token);
    }
    catch (err) {
        res.status(401);
        res.json(err);
    }
};
const userRoutes = (app) => {
    app.get('/users', verifyAuthToken_1.default, index);
    app.get('/users/:id', verifyAuthToken_1.default, show);
    app.post('/users', verifyAuthToken_1.default, create);
    app.patch('/users/:id', verifyAuthToken_1.default, edit);
    app.delete('/users', verifyAuthToken_1.default, destroy);
    app.post('/users/authenticate', authenticate);
};
exports.default = userRoutes;
