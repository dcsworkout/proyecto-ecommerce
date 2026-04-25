const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware, ownerOnly } = require('../middleware/auth');

/**
 * Public Routes (no authentication required)
 */

// POST /api/auth/login - Login user
router.post('/login', authController.login);

/**
 * Protected Routes (authentication required)
 */

// GET /api/auth/me - Get current user info
router.get('/me', authMiddleware, authController.getCurrentUser);

// POST /api/auth/change-password - Change own password
router.post('/change-password', authMiddleware, authController.changePassword);

/**
 * Owner-only Routes
 */

// POST /api/auth/register - Register new user (only owners can do this)
router.post('/register', authMiddleware, ownerOnly, authController.register);

module.exports = router;
