const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// POST /api/orders -> create a new order
router.post('/', ordersController.createOrder);

// GET /api/orders -> list orders
router.get('/', ordersController.listOrders);

module.exports = router;
