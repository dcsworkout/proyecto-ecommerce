const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import database to test connection
require('./src/config/database');

// Import routes
const authRoutes = require('./src/routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging (dev mode)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: '🏪 E-Commerce Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register (owner only)',
        me: 'GET /api/auth/me (authenticated)',
        changePassword: 'POST /api/auth/change-password (authenticated)'
      },
      shops: '/api/shops (coming soon)',
      products: '/api/products (coming soon)',
      inventory: '/api/inventory (coming soon)',
      sales: '/api/sales (coming soon)',
      analytics: '/api/analytics (coming soon)'
    }
  });
});

// Mount routes
app.use('/api/auth', authRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  const status = err.status || err.statusCode || 500;
  
  res.status(status).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ============================================');
  console.log('🚀 E-Commerce Backend Server');
  console.log('🚀 ============================================');
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🚀 API available at: http://localhost:${PORT}/api`);
  console.log(`🚀 Health check: http://localhost:${PORT}/health`);
  console.log('🚀 ============================================');
  console.log('');
  console.log('🔐 Auth endpoints ready:');
  console.log('   POST /api/auth/login');
  console.log('   GET  /api/auth/me');
  console.log('   POST /api/auth/register (owner only)');
  console.log('   POST /api/auth/change-password');
  console.log('');
});

module.exports = app;
