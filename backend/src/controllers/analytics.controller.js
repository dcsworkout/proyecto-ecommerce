const { pool } = require('../config/database');

const getWeekStats = async (req, res) => {
  try {
    const shop_id = req.user.shop_id;
    const thisWeek = await pool.query(`
      SELECT 
        COUNT(*) as sales_count,
        COALESCE(SUM(sale_price * quantity_sold), 0) as revenue,
        COALESCE(SUM(quantity_sold), 0) as items_sold
      FROM sales
      WHERE shop_id = $1
        AND sale_date >= date_trunc('week', NOW())
        AND sale_date < date_trunc('week', NOW()) + interval '1 week'
    `, [shop_id]);

    const lastWeek = await pool.query(`
      SELECT 
        COUNT(*) as sales_count,
        COALESCE(SUM(sale_price * quantity_sold), 0) as revenue,
        COALESCE(SUM(quantity_sold), 0) as items_sold
      FROM sales
      WHERE shop_id = $1
        AND sale_date >= date_trunc('week', NOW()) - interval '1 week'
        AND sale_date < date_trunc('week', NOW())
    `, [shop_id]);

    const topProducts = await pool.query(`
      SELECT 
        p.modelo, p.tipo,
        COUNT(*) as veces_vendido,
        SUM(s.quantity_sold) as unidades,
        SUM(s.sale_price * s.quantity_sold) as ingresos
      FROM sales s
      JOIN inventory i ON s.inventory_id = i.id
      JOIN products p ON i.product_id = p.id
      WHERE s.shop_id = $1
        AND s.sale_date >= date_trunc('week', NOW()) - interval '1 week'
      GROUP BY p.id, p.modelo, p.tipo
      ORDER BY unidades DESC
      LIMIT 5
    `, [shop_id]);

    const byDayOfWeek = await pool.query(`
      SELECT 
        EXTRACT(DOW FROM sale_date) as dia,
        TO_CHAR(sale_date, 'Day') as nombre_dia,
        COUNT(*) as ventas,
        COALESCE(SUM(sale_price * quantity_sold), 0) as ingresos
      FROM sales
      WHERE shop_id = $1
        AND sale_date >= NOW() - interval '4 weeks'
      GROUP BY EXTRACT(DOW FROM sale_date), TO_CHAR(sale_date, 'Day')
      ORDER BY ventas DESC
    `, [shop_id]);

    res.json({
      this_week: thisWeek.rows[0],
      last_week: lastWeek.rows[0],
      top_products: topProducts.rows,
      by_day: byDayOfWeek.rows
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};

const getCosts = async (req, res) => {
  try {
    const shop_id = req.user.shop_id;
    const result = await pool.query(`
      SELECT pc.*, p.modelo, p.tipo, p.price as precio_venta
      FROM product_costs pc
      JOIN products p ON pc.product_id = p.id
      WHERE pc.shop_id = $1
    `, [shop_id]);
    const products = await pool.query(
      'SELECT id, modelo, tipo, price FROM products WHERE shop_id = $1 AND is_visible = true ORDER BY modelo',
      [shop_id]
    );
    res.json({ costs: result.rows, products: products.rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
};

const upsertCost = async (req, res) => {
  try {
    const shop_id = req.user.shop_id;
    const { product_id, costo_compra, costos_operativos } = req.body;
    await pool.query(`
      INSERT INTO product_costs (product_id, shop_id, costo_compra, costos_operativos)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (product_id) DO UPDATE SET
        costo_compra = $3,
        costos_operativos = $4,
        updated_at = NOW()
    `, [product_id, shop_id, costo_compra || 0, costos_operativos || 0]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
};

module.exports = { getWeekStats, getCosts, upsertCost };
