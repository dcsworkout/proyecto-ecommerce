const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

/**
 * Auth Middleware - Verifies JWT token and attaches user to request
 * Use this on protected routes
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'Please include Authorization: Bearer <token> header' 
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database (with shop info)
    const result = await pool.query(
      `SELECT 
        u.id, u.email, u.full_name, u.role, u.shop_id, u.is_active,
        s.name as shop_name, s.slug as shop_slug, s.whatsapp_number
       FROM users u 
       JOIN shops s ON u.shop_id = s.id 
       WHERE u.id = $1 AND u.is_active = true`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'User not found or inactive' 
      });
    }

    // Attach user to request for use in controllers
    req.user = result.rows[0];
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please login again' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Owner-only Middleware - Requires user to be a shop owner
 * Use AFTER authMiddleware: router.delete('/...', authMiddleware, ownerOnly, ...)
 */
const ownerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'owner') {
    return res.status(403).json({ 
      error: 'Owner access required',
      message: 'Only shop owners can perform this action' 
    });
  }
  
  next();
};

module.exports = { 
  authMiddleware, 
  ownerOnly 
};
