const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const { authMiddleware, ownerOnly } = require('../middleware/auth');

// Public routes (no auth required)
router.get('/', productsController.getAllProducts);
router.get('/categories/list', productsController.getCategories);

// Protected routes (auth required) - put BEFORE /:id to avoid conflict
router.get('/my-shop/all', authMiddleware, productsController.getMyShopProducts);

// Public route (must be after specific routes)
router.get('/:id', productsController.getProductById);

// Owner-only routes
router.post('/', authMiddleware, ownerOnly, productsController.createProduct);
router.put('/:id', authMiddleware, ownerOnly, productsController.updateProduct);
router.delete('/:id', authMiddleware, ownerOnly, productsController.deleteProduct);

module.exports = router;
