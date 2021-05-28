"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const verifyAuthToken_1 = __importDefault(require("../middleware/verifyAuthToken"));
const orderModel = new order_1.OrderModel();
const index = async (_req, res) => {
    const orders = await orderModel.index();
    res.json(orders);
};
const currentOrder = async (req, res) => {
    const orders = await orderModel.current(req.body.user_id);
    res.json(orders);
};
const show = async (req, res) => {
    const order = await orderModel.show(req.params.id);
    res.json(order);
};
const create = async (req, res) => {
    const order = {
        user_id: req.body.user_id,
        complete: req.body.complete
    };
    try {
        const newOrder = await orderModel.create(order);
        res.json(newOrder);
    }
    catch (err) {
        res.status(400);
        res.json(err + order);
    }
};
const edit = async (req, res) => {
    const order = {
        user_id: req.body.user_id,
        complete: req.body.complete,
        id: req.body.id
    };
    try {
        const editedOrder = await orderModel.edit(order);
        res.json(editedOrder);
    }
    catch (err) {
        res.status(400);
        res.json(err + order);
    }
};
const destroy = async (req, res) => {
    try {
        const order = await orderModel.delete(req.body.id);
        res.json(order);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const indexOrderProduct = async (req, res) => {
    try {
        const orderProducts = await orderModel.indexOrderProduct(req.body.order_id);
        res.json(orderProducts);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const showOrderProduct = async (req, res) => {
    try {
        const orderProducts = await orderModel.showOrderProduct(req.body.order_id, req.body.product_id);
        res.json(orderProducts);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const addOrderProduct = async (req, res) => {
    const product = {
        quantity: req.body.quantity,
        order_id: req.body.order_id,
        product_id: req.body.product_id
    };
    try {
        const newProduct = await orderModel.addOrderProduct(product);
        res.json(newProduct);
    }
    catch (err) {
        res.status(400);
        res.json(err + product);
    }
};
const editOrderProduct = async (req, res) => {
    const product = {
        id: req.body.id,
        quantity: req.body.quantity,
        order_id: req.body.order_id,
        product_id: req.body.product_id
    };
    try {
        const newProduct = await orderModel.editOrderProduct(product);
        res.json(newProduct);
    }
    catch (err) {
        res.status(400);
        res.json(err + product);
    }
};
const deleteOrderProduct = async (req, res) => {
    try {
        const product = await orderModel.deleteOrderProduct(req.body.order_id, req.body.product_id);
        res.json(product);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const orderRoutes = (app) => {
    app.get('/orders', index);
    app.get('/orders/:id', verifyAuthToken_1.default, show);
    app.get('/orders/current/:id', verifyAuthToken_1.default, currentOrder);
    app.post('/orders', verifyAuthToken_1.default, create);
    app.patch('/orders/:id', verifyAuthToken_1.default, edit);
    app.delete('/orders', verifyAuthToken_1.default, destroy);
    app.post('/orders/:id', verifyAuthToken_1.default, addOrderProduct);
    app.get('/orders/:id/items', verifyAuthToken_1.default, indexOrderProduct);
    app.get('/orders/:id/items/:id', verifyAuthToken_1.default, showOrderProduct);
    app.patch('/orders/:id/items/:id', verifyAuthToken_1.default, editOrderProduct);
    app.delete('/orders/:id', verifyAuthToken_1.default, deleteOrderProduct);
};
exports.default = orderRoutes;
