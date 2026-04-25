const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

/**
 * POST /api/auth/login
 * Login with email and password
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user with shop info
    const result = await pool.query(
      `SELECT 
        u.id, u.email, u.password_hash, u.full_name, u.role, u.shop_id, u.is_active,
        s.name as shop_name, s.slug as shop_slug, s.whatsapp_number
       FROM users u
       JOIN shops s ON u.shop_id = s.id
       WHERE u.email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect' 
      });
    }

    const user = result.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ 
        error: 'Account inactive',
        message: 'Your account has been deactivated. Contact your shop owner.' 
      });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Email or password is incorrect' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role,
        shopId: user.shop_id 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Return user info (without password) and token
    res.json({
      success: true,
      message: `¡Bienvenido(a), ${user.full_name}!`,
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        shop: {
          id: user.shop_id,
          name: user.shop_name,
          slug: user.shop_slug,
          whatsapp_number: user.whatsapp_number
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      message: 'An error occurred during login' 
    });
  }
};

/**
 * POST /api/auth/register
 * Register a new user (employee)
 * Only owners can register new users for their shop
 */
const register = async (req, res) => {
  try {
    const { email, password, full_name, role = 'employee' } = req.body;
    const owner = req.user; // From authMiddleware

    // Validate input
    if (!email || !password || !full_name) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'email, password, and full_name are required' 
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'Password too short',
        message: 'Password must be at least 8 characters' 
      });
    }

    // Validate role
    if (!['owner', 'employee'].includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role',
        message: 'Role must be either "owner" or "employee"' 
      });
    }

    // Check if email already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Email already registered',
        message: 'A user with this email already exists' 
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create user (in the same shop as the owner)
    const result = await pool.query(
      `INSERT INTO users (shop_id, email, password_hash, full_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       RETURNING id, email, full_name, role, shop_id, created_at`,
      [owner.shop_id, email.toLowerCase(), password_hash, full_name, role]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      success: true,
      message: `Usuario ${full_name} creado exitosamente`,
      user: newUser
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      message: 'An error occurred during registration' 
    });
  }
};

/**
 * GET /api/auth/me
 * Get current authenticated user info
 */
const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        full_name: req.user.full_name,
        role: req.user.role,
        shop: {
          id: req.user.shop_id,
          name: req.user.shop_name,
          slug: req.user.shop_slug,
          whatsapp_number: req.user.whatsapp_number
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
};

/**
 * POST /api/auth/change-password
 * Change current user's password
 */
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const userId = req.user.id;

    if (!current_password || !new_password) {
      return res.status(400).json({ 
        error: 'Both current and new passwords are required' 
      });
    }

    if (new_password.length < 8) {
      return res.status(400).json({ 
        error: 'New password must be at least 8 characters' 
      });
    }

    // Get current password hash
    const result = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    // Verify current password
    const passwordMatch = await bcrypt.compare(
      current_password, 
      result.rows[0].password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({ 
        error: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const new_password_hash = await bcrypt.hash(new_password, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [new_password_hash, userId]
    );

    res.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

module.exports = {
  login,
  register,
  getCurrentUser,
  changePassword
};
