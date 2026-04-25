const express = require('express');
const router = express.Router();
const salesController = require('../controllers/sales.controller');
const { authMiddleware, ownerOnly } = require('../middleware/auth');

// All sales routes require authentication
router.use(authMiddleware);

// Both owners and employees can register sales
router.post('/', salesController.registerSale);

// Both can see sales history
router.get('/', salesController.getSalesHistory);
router.get('/today', salesController.getTodaySales);

// Only owners can cancel/delete sales
router.delete('/:id', ownerOnly, salesController.deleteSale);

module.exports = router;
