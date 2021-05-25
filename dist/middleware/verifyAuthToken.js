"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyAuthToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader) {
            const token = authorizationHeader.split(' ')[1];
            const decode = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
            if (decode) {
                next();
            }
            else {
                res.status(401).send('Invalid or Expired Token');
            }
        }
        else {
            res.status(401).send('Valid Token Required');
        }
    }
    catch (err) {
        res.status(401);
        res.json(err);
    }
};
exports.default = verifyAuthToken;
