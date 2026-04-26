const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { authMiddleware, ownerOnly } = require('../middleware/auth');

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

router.put('/my-shop', authMiddleware, ownerOnly, async (req, res) => {
  try {
    const shop_id = req.user.shop_id;
    const { name, whatsapp_number } = req.body;
    const updates = [];
    const values = [];
    let count = 0;
    if (name) { count++; updates.push(`name = $${count}`); values.push(name); }
    if (whatsapp_number) { count++; updates.push(`whatsapp_number = $${count}`); values.push(whatsapp_number); }
    if (updates.length === 0) return res.status(400).json({ error: 'Nothing to update' });
    count++;
    values.push(shop_id);
    const result = await pool.query(
      `UPDATE shops SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${count} RETURNING name, whatsapp_number, slug`,
      values
    );
    res.json({ success: true, shop: result.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update shop' });
  }
});

module.exports = router;
