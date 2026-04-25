const { pool } = require('../config/database');
const getShopInventory = async (req, res) => {
  try {
    const { shopId } = req.params;
    if (shopId !== req.user.shop_id) return res.status(403).json({ error: 'Forbidden' });
    const result = await pool.query(
      `SELECT i.*, p.modelo, p.tipo, p.price, p.shop_id as product_shop_id
       FROM inventory i JOIN products p ON i.product_id = p.id
       WHERE p.shop_id = $1 ORDER BY p.modelo, i.talla, i.color`,
      [shopId]
    );
    res.json({ success: true, inventory: result.rows });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
};
module.exports = { getShopInventory };
