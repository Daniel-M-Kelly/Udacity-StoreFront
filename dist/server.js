"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import bodyParser from 'body-parser';
const dotenv_1 = __importDefault(require("dotenv"));
//import userRoutes
const users_1 = __importDefault(require("./handlers/users"));
const products_1 = __importDefault(require("./handlers/products"));
const orders_1 = __importDefault(require("./handlers/orders"));
dotenv_1.default.config();
const EXPRESS_PORT = process.env.EXPRESS_PORT;
const app = express_1.default();
const address = `0.0.0.0:${EXPRESS_PORT}`;
//bodyParser is deprecated, use express.json() instead
//app.use(bodyParser.json());
app.use(express_1.default.json());
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
users_1.default(app);
products_1.default(app);
orders_1.default(app);
//Export app for testing
exports.default = app;
