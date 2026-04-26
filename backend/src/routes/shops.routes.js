const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, slug FROM shops WHERE is_active = true ORDER BY name'
    );
    res.json({ shops: result.rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

module.exports = router;
