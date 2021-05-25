"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const verifyAuthToken_1 = __importDefault(require("../middleware/verifyAuthToken"));
const productModel = new product_1.ProductModel();
const index = async (_req, res) => {
    const products = await productModel.index();
    res.json(products);
};
const show = async (req, res) => {
    const product = await productModel.show(req.params.id);
    res.json(product);
};
const create = async (req, res) => {
    const product = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    };
    try {
        const newProduct = await productModel.create(product);
        res.json(newProduct);
    }
    catch (err) {
        res.status(400);
        res.json(err + product);
    }
};
const edit = async (req, res) => {
    const product = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        id: req.body.id
    };
    try {
        const editedProduct = await productModel.edit(product);
        res.json(editedProduct);
    }
    catch (err) {
        res.status(400);
        res.json(err + product);
    }
};
const destroy = async (req, res) => {
    const product = await productModel.delete(req.body.id);
    res.json(product);
};
const productRoutes = (app) => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products', verifyAuthToken_1.default, create);
    app.patch('/products/:id', verifyAuthToken_1.default, edit);
    app.delete('/products', verifyAuthToken_1.default, destroy);
};
exports.default = productRoutes;
