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

const addVariant = async (req, res) => {
  try {
    const { product_id, talla, color, quantity } = req.body;
    const shop_id = req.user.shop_id;
    if (!product_id || !talla || !color || quantity === undefined)
      return res.status(400).json({ error: 'product_id, talla, color y quantity son requeridos' });
    const owns = await pool.query('SELECT id FROM products WHERE id = $1 AND shop_id = $2', [product_id, shop_id]);
    if (owns.rows.length === 0) return res.status(403).json({ error: 'Producto no encontrado' });
    const result = await pool.query(
      `INSERT INTO inventory (product_id, talla, color, quantity)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (product_id, talla, color) DO UPDATE SET quantity = inventory.quantity + $4
       RETURNING *`,
      [product_id, talla, color, parseInt(quantity)]
    );
    res.status(201).json({ success: true, variant: result.rows[0] });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed' }); }
};

const updateVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const shop_id = req.user.shop_id;
    const owns = await pool.query(
      'SELECT i.id FROM inventory i JOIN products p ON i.product_id = p.id WHERE i.id = $1 AND p.shop_id = $2',
      [id, shop_id]
    );
    if (owns.rows.length === 0) return res.status(403).json({ error: 'Variante no encontrada' });
    const result = await pool.query(
      'UPDATE inventory SET quantity = $1 WHERE id = $2 RETURNING *',
      [parseInt(quantity), id]
    );
    res.json({ success: true, variant: result.rows[0] });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
};

const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const shop_id = req.user.shop_id;
    const owns = await pool.query(
      'SELECT i.id FROM inventory i JOIN products p ON i.product_id = p.id WHERE i.id = $1 AND p.shop_id = $2',
      [id, shop_id]
    );
    if (owns.rows.length === 0) return res.status(403).json({ error: 'Variante no encontrada' });
    await pool.query('DELETE FROM inventory WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: 'Failed' }); }
};

module.exports = { getShopInventory, addVariant, updateVariant, deleteVariant };
