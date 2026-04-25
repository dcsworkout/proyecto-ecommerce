const express = require('express');
const router = express.Router();
const { getShopInventory } = require('../controllers/inventory.controller');
const { authMiddleware } = require('../middleware/auth');
router.get('/shop/:shopId', authMiddleware, getShopInventory);
module.exports = router;
