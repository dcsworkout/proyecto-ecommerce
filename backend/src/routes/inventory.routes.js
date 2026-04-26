const express = require('express');
const router = express.Router();
const { getShopInventory, addVariant, updateVariant, deleteVariant } = require('../controllers/inventory.controller');
const { authMiddleware, ownerOnly } = require('../middleware/auth');
router.get('/shop/:shopId', authMiddleware, getShopInventory);
router.post('/', authMiddleware, ownerOnly, addVariant);
router.put('/:id', authMiddleware, ownerOnly, updateVariant);
router.delete('/:id', authMiddleware, ownerOnly, deleteVariant);
module.exports = router;
