const { pool } = require('../config/database');

/**
 * GET /api/products - Public, with filters
 */
const getAllProducts = async (req, res) => {
  try {
    const { tipo, talla, color, shop_slug, search } = req.query;

    let query = `
      SELECT 
        p.id, p.modelo, p.tipo, p.description, p.price, p.image_urls,
        p.shop_id, p.created_at,
        s.name as shop_name, 
        s.slug as shop_slug, 
        s.whatsapp_number
      FROM products p
      JOIN shops s ON p.shop_id = s.id
      WHERE p.is_visible = true AND s.is_active = true
    `;

    const params = [];
    let paramCount = 0;

    if (tipo) {
      paramCount++;
      query += ` AND p.tipo = $${paramCount}`;
      params.push(tipo);
    }

    if (shop_slug) {
      paramCount++;
      query += ` AND s.slug = $${paramCount}`;
      params.push(shop_slug);
    }

    if (search) {
      paramCount++;
      query += ` AND (p.modelo ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (talla) {
      paramCount++;
      query += ` AND EXISTS (
        SELECT 1 FROM inventory i 
        WHERE i.product_id = p.id AND i.talla = $${paramCount} AND i.quantity > 0
      )`;
      params.push(talla);
    }

    if (color) {
      paramCount++;
      query += ` AND EXISTS (
        SELECT 1 FROM inventory i 
        WHERE i.product_id = p.id AND i.color ILIKE $${paramCount} AND i.quantity > 0
      )`;
      params.push(`%${color}%`);
    }

    query += ` ORDER BY p.created_at DESC`;

    const products = await pool.query(query, params);

    // Get available variants for each product (separate query)
    for (let product of products.rows) {
      const variants = await pool.query(
        `SELECT DISTINCT talla, color 
         FROM inventory 
         WHERE product_id = $1 AND quantity > 0`,
        [product.id]
      );
      
      product.available_tallas = [...new Set(variants.rows.map(v => v.talla))];
      product.available_colors = [...new Set(variants.rows.map(v => v.color))];
      
      const stockResult = await pool.query(
        'SELECT COALESCE(SUM(quantity), 0) as total FROM inventory WHERE product_id = $1',
        [product.id]
      );
      product.total_stock = parseInt(stockResult.rows[0].total);
    }

    res.json({
      success: true,
      count: products.rows.length,
      filters: { tipo, talla, color, shop_slug, search },
      products: products.rows
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products',
      details: error.message 
    });
  }
};

/**
 * GET /api/products/:id - Public, with all variants
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const productResult = await pool.query(
      `SELECT 
        p.*,
        s.name as shop_name, s.slug as shop_slug, s.whatsapp_number
       FROM products p
       JOIN shops s ON p.shop_id = s.id
       WHERE p.id = $1 AND p.is_visible = true`,
      [id]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = productResult.rows[0];

    const variantsResult = await pool.query(
      `SELECT id, talla, color, quantity,
        CASE 
          WHEN quantity = 0 THEN 'out_of_stock'
          WHEN quantity <= low_stock_alert THEN 'low_stock'
          ELSE 'in_stock'
        END as stock_status
       FROM inventory
       WHERE product_id = $1
       ORDER BY talla, color`,
      [id]
    );

    res.json({
      success: true,
      product: {
        ...product,
        variants: variantsResult.rows,
        total_stock: variantsResult.rows.reduce((sum, v) => sum + v.quantity, 0)
      }
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  }
};

/**
 * GET /api/products/my-shop/all - Protected
 */
const getMyShopProducts = async (req, res) => {
  try {
    const shop_id = req.user.shop_id;

    const result = await pool.query(
      `SELECT 
        p.*,
        (SELECT COALESCE(SUM(i.quantity), 0) FROM inventory i WHERE i.product_id = p.id) as total_stock,
        (SELECT COUNT(*) FROM inventory i WHERE i.product_id = p.id) as variant_count
       FROM products p
       WHERE p.shop_id = $1
       ORDER BY p.created_at DESC`,
      [shop_id]
    );

    res.json({
      success: true,
      count: result.rows.length,
      products: result.rows
    });

  } catch (error) {
    console.error('Get my shop products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

/**
 * POST /api/products - Owner only
 */
const createProduct = async (req, res) => {
  try {
    const { modelo, tipo, description, price, image_urls, is_visible = true } = req.body;
    const shop_id = req.user.shop_id;

    if (!modelo || !tipo || price === undefined) {
      return res.status(400).json({ error: 'modelo, tipo, and price are required' });
    }

    if (price < 0) {
      return res.status(400).json({ error: 'Price must be positive' });
    }

    const result = await pool.query(
      `INSERT INTO products (shop_id, modelo, tipo, description, price, image_urls, is_visible)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [shop_id, modelo, tipo, description || null, price, image_urls || [], is_visible]
    );

    res.status(201).json({
      success: true,
      message: `Producto "${modelo}" creado exitosamente`,
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

/**
 * PUT /api/products/:id - Owner only
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { modelo, tipo, description, price, image_urls, is_visible } = req.body;
    const shop_id = req.user.shop_id;

    const existing = await pool.query(
      'SELECT id FROM products WHERE id = $1 AND shop_id = $2',
      [id, shop_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found or not yours' });
    }

    const updates = [];
    const values = [];
    let paramCount = 0;

    if (modelo !== undefined) { paramCount++; updates.push(`modelo = $${paramCount}`); values.push(modelo); }
    if (tipo !== undefined) { paramCount++; updates.push(`tipo = $${paramCount}`); values.push(tipo); }
    if (description !== undefined) { paramCount++; updates.push(`description = $${paramCount}`); values.push(description); }
    if (price !== undefined) { 
      if (price < 0) return res.status(400).json({ error: 'Price must be positive' });
      paramCount++; updates.push(`price = $${paramCount}`); values.push(price); 
    }
    if (image_urls !== undefined) { paramCount++; updates.push(`image_urls = $${paramCount}`); values.push(image_urls); }
    if (is_visible !== undefined) { paramCount++; updates.push(`is_visible = $${paramCount}`); values.push(is_visible); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    paramCount++;
    values.push(id);

    const result = await pool.query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      product: result.rows[0]
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

/**
 * DELETE /api/products/:id - Owner only
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const shop_id = req.user.shop_id;

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 AND shop_id = $2 RETURNING modelo',
      [id, shop_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found or not yours' });
    }

    res.json({
      success: true,
      message: `Producto "${result.rows[0].modelo}" eliminado`
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

/**
 * GET /api/products/categories/list - Public
 */
const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT tipo, COUNT(*) as count
       FROM products
       WHERE is_visible = true
       GROUP BY tipo
       ORDER BY tipo`
    );

    res.json({
      success: true,
      categories: result.rows
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getMyShopProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
};
