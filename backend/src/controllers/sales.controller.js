const { pool } = require('../config/database');

/**
 * POST /api/sales
 * Register a new sale - WITH DATABASE TRANSACTION
 * This is the magic: decrements inventory atomically
 */
const registerSale = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { inventory_id, quantity_sold = 1, sale_price, notes, free_mode = false, free_nombre, free_categoria } = req.body;
    const user_id = req.user.id;
    const shop_id = req.user.shop_id;

    if (!inventory_id) {
      return res.status(400).json({ error: 'inventory_id is required' });
    }

    if (quantity_sold <= 0) {
      return res.status(400).json({ error: 'quantity_sold must be positive' });
    }

    // START TRANSACTION
    await client.query('BEGIN');

    // 1. Get inventory and LOCK the row (prevents race conditions!)
    const inventoryResult = await client.query(
      `SELECT 
        i.id, i.quantity, i.talla, i.color, i.product_id,
        p.modelo, p.tipo, p.price as default_price, p.shop_id
       FROM inventory i
       JOIN products p ON i.product_id = p.id
       WHERE i.id = $1
       FOR UPDATE`,  // ← This is the magic: row-level lock
      [inventory_id]
    );

    if (inventoryResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    const inventory = inventoryResult.rows[0];

    // 2. Verify product belongs to user's shop (multi-tenant security)
    if (inventory.shop_id !== shop_id) {
      await client.query('ROLLBACK');
      return res.status(403).json({ 
        error: 'You can only register sales for your own shop' 
      });
    }

    // 3. Check sufficient stock
    if (inventory.quantity < quantity_sold) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: 'Insufficient stock',
        available: inventory.quantity,
        requested: quantity_sold,
        message: `Only ${inventory.quantity} units available for ${inventory.modelo} (${inventory.talla} - ${inventory.color})`
      });
    }

    // 4. Decrement inventory (skip if free_mode)
    if (!free_mode) {
    await client.query(
      `UPDATE inventory 
       SET quantity = quantity - $1
       WHERE id = $2`,
      [quantity_sold, inventory_id]
    );
    }

    // 5. Create sale record
    const finalPrice = sale_price !== undefined ? sale_price : inventory.default_price;
    
    const saleResult = await client.query(
      `INSERT INTO sales (
        shop_id, inventory_id, user_id, 
        quantity_sold, sale_price, notes
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [shop_id, inventory_id, user_id, quantity_sold, finalPrice, free_mode ? (free_nombre + (free_categoria ? " | " + free_categoria : "")) : (notes || null)]
    );

    // COMMIT TRANSACTION
    await client.query('COMMIT');

    const newQuantity = inventory.quantity - quantity_sold;
    const isLowStock = newQuantity <= 3;
    const isOutOfStock = newQuantity === 0;

    res.status(201).json({
      success: true,
      message: free_mode ? `✅ Venta registrada: ${free_nombre}` : `✅ Venta registrada: ${inventory.modelo} (${inventory.talla} - ${inventory.color})`,
      sale: saleResult.rows[0],
      product: {
        modelo: inventory.modelo,
        talla: inventory.talla,
        color: inventory.color
      },
      inventory: {
        previous_quantity: inventory.quantity,
        new_quantity: newQuantity,
        is_low_stock: isLowStock,
        is_out_of_stock: isOutOfStock
      },
      total_amount: parseFloat(finalPrice) * quantity_sold
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Register sale error:', error);
    res.status(500).json({ 
      error: 'Failed to register sale',
      details: error.message 
    });
  } finally {
    client.release();  // Always release the client back to the pool
  }
};

/**
 * GET /api/sales
 * Get sales history for current user's shop
 */
const getSalesHistory = async (req, res) => {
  try {
    const shop_id = req.user.shop_id;
    const { 
      page = 1, 
      limit = 50, 
      start_date, 
      end_date,
      user_id 
    } = req.query;
    
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        s.id, s.quantity_sold, s.sale_price, s.notes, s.sale_date,
        s.inventory_id,
        p.modelo, p.tipo,
        i.talla, i.color,
        u.full_name as seller_name,
        u.role as seller_role,
        (s.sale_price * s.quantity_sold) as total_amount
      FROM sales s
      JOIN inventory i ON s.inventory_id = i.id
      JOIN products p ON i.product_id = p.id
      JOIN users u ON s.user_id = u.id
      WHERE s.shop_id = $1
    `;
    
    const params = [shop_id];
    let paramCount = 1;

    if (start_date) {
      paramCount++;
      query += ` AND s.sale_date >= $${paramCount}`;
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      query += ` AND s.sale_date <= $${paramCount}`;
      params.push(end_date);
    }

    if (user_id) {
      paramCount++;
      query += ` AND s.user_id = $${paramCount}`;
      params.push(user_id);
    }

    query += ` ORDER BY s.sale_date DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count and total revenue
    const summaryResult = await pool.query(
      `SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(sale_price * quantity_sold), 0) as total_revenue
       FROM sales WHERE shop_id = $1`,
      [shop_id]
    );

    res.json({
      success: true,
      sales: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(summaryResult.rows[0].total_sales)
      },
      summary: {
        total_sales: parseInt(summaryResult.rows[0].total_sales),
        total_revenue: parseFloat(summaryResult.rows[0].total_revenue)
      }
    });

  } catch (error) {
    console.error('Get sales history error:', error);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
};

/**
 * DELETE /api/sales/:id
 * Delete a sale (owner only) - RESTORES INVENTORY
 */
const deleteSale = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const shop_id = req.user.shop_id;

    await client.query('BEGIN');

    // Get sale details with row lock
    const saleResult = await client.query(
      `SELECT s.*, p.modelo, i.talla, i.color
       FROM sales s
       JOIN inventory i ON s.inventory_id = i.id
       JOIN products p ON i.product_id = p.id
       WHERE s.id = $1 AND s.shop_id = $2
       FOR UPDATE`,
      [id, shop_id]
    );

    if (saleResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Sale not found' });
    }

    const sale = saleResult.rows[0];

    // Restore inventory
    await client.query(
      `UPDATE inventory 
       SET quantity = quantity + $1
       WHERE id = $2`,
      [sale.quantity_sold, sale.inventory_id]
    );

    // Delete sale
    await client.query('DELETE FROM sales WHERE id = $1', [id]);

    await client.query('COMMIT');

    res.json({ 
      success: true, 
      message: `✅ Venta cancelada: ${sale.modelo} (${sale.talla} - ${sale.color}). Inventario restaurado.`,
      restored: {
        modelo: sale.modelo,
        talla: sale.talla,
        color: sale.color,
        quantity: sale.quantity_sold
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete sale error:', error);
    res.status(500).json({ error: 'Failed to delete sale' });
  } finally {
    client.release();
  }
};

/**
 * GET /api/sales/today
 * Quick endpoint - Get today's sales summary
 */
const getTodaySales = async (req, res) => {
  try {
    const shop_id = req.user.shop_id;

    const result = await pool.query(
      `SELECT 
        COUNT(*) as count,
        COALESCE(SUM(sale_price * quantity_sold), 0) as revenue,
        COALESCE(SUM(quantity_sold), 0) as items_sold
       FROM sales
       WHERE shop_id = $1 AND DATE(sale_date) = CURRENT_DATE`,
      [shop_id]
    );

    res.json({
      success: true,
      today: {
        date: new Date().toISOString().split('T')[0],
        sales_count: parseInt(result.rows[0].count),
        items_sold: parseInt(result.rows[0].items_sold),
        revenue: parseFloat(result.rows[0].revenue)
      }
    });

  } catch (error) {
    console.error('Get today sales error:', error);
    res.status(500).json({ error: 'Failed to fetch today sales' });
  }
};

module.exports = {
  registerSale,
  getSalesHistory,
  deleteSale,
  getTodaySales
};
