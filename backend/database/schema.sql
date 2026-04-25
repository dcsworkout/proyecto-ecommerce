-- ============================================
-- SCHEMA: Multi-Shop E-Commerce System
-- ============================================
-- Drop existing tables (careful - this deletes all data!)
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS shops CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: shops
-- Stores information about each family shop
-- ============================================
CREATE TABLE shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    owner_id UUID, -- Will be set after users table is created
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: users
-- Stores family members and employees
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('owner', 'employee')) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key to shops.owner_id
ALTER TABLE shops ADD CONSTRAINT fk_shop_owner 
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================
-- TABLE: products
-- Stores product models/items
-- ============================================
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    modelo VARCHAR(255) NOT NULL,
    tipo VARCHAR(100) NOT NULL, -- Vestido, Blusa, Pantalón, Falda, Accesorios
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    image_urls TEXT[], -- Array of image URLs
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABLE: inventory
-- Stores stock per variant (size/color combination)
-- ============================================
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    talla VARCHAR(10) NOT NULL CHECK (talla IN ('XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'UNICA')),
    color VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    low_stock_alert INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(product_id, talla, color) -- Prevent duplicate variants
);

-- ============================================
-- TABLE: sales
-- Stores transaction history
-- ============================================
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quantity_sold INTEGER NOT NULL DEFAULT 1 CHECK (quantity_sold > 0),
    sale_price DECIMAL(10, 2) NOT NULL CHECK (sale_price >= 0),
    notes TEXT,
    sale_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES for performance
-- ============================================
CREATE INDEX idx_users_shop_id ON users(shop_id);
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_products_tipo ON products(tipo);
CREATE INDEX idx_products_visible ON products(is_visible);

CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_inventory_quantity ON inventory(quantity);

CREATE INDEX idx_sales_shop_id ON sales(shop_id);
CREATE INDEX idx_sales_date ON sales(sale_date);
CREATE INDEX idx_sales_inventory_id ON sales(inventory_id);

-- ============================================
-- TRIGGERS for updated_at timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS for common queries
-- ============================================

-- View: Complete inventory with product details
CREATE OR REPLACE VIEW v_inventory_detail AS
SELECT 
    i.id AS inventory_id,
    i.quantity,
    i.talla,
    i.color,
    i.low_stock_alert,
    p.id AS product_id,
    p.modelo,
    p.tipo,
    p.price,
    p.image_urls,
    s.id AS shop_id,
    s.name AS shop_name,
    s.slug AS shop_slug,
    CASE 
        WHEN i.quantity = 0 THEN 'out_of_stock'
        WHEN i.quantity <= i.low_stock_alert THEN 'low_stock'
        ELSE 'in_stock'
    END AS stock_status
FROM inventory i
JOIN products p ON i.product_id = p.id
JOIN shops s ON p.shop_id = s.id
WHERE p.is_visible = true;

-- View: Sales with details
CREATE OR REPLACE VIEW v_sales_detail AS
SELECT 
    sa.id AS sale_id,
    sa.quantity_sold,
    sa.sale_price,
    sa.notes,
    sa.sale_date,
    p.modelo,
    p.tipo,
    i.talla,
    i.color,
    u.full_name AS seller_name,
    u.role AS seller_role,
    sh.name AS shop_name,
    sh.id AS shop_id
FROM sales sa
JOIN inventory i ON sa.inventory_id = i.id
JOIN products p ON i.product_id = p.id
JOIN users u ON sa.user_id = u.id
JOIN shops sh ON sa.shop_id = sh.id;

-- ============================================
-- SAMPLE QUERY FUNCTIONS (optional, for analytics)
-- ============================================

-- Function to get dashboard metrics for a shop
CREATE OR REPLACE FUNCTION get_dashboard_metrics(p_shop_id UUID, p_date DATE DEFAULT CURRENT_DATE)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'today_sales', (
            SELECT COUNT(*) FROM sales 
            WHERE shop_id = p_shop_id 
            AND DATE(sale_date) = p_date
        ),
        'today_revenue', (
            SELECT COALESCE(SUM(sale_price * quantity_sold), 0) 
            FROM sales 
            WHERE shop_id = p_shop_id 
            AND DATE(sale_date) = p_date
        ),
        'low_stock_items', (
            SELECT COUNT(*) FROM v_inventory_detail
            WHERE shop_id = p_shop_id 
            AND stock_status = 'low_stock'
        ),
        'out_of_stock_items', (
            SELECT COUNT(*) FROM v_inventory_detail
            WHERE shop_id = p_shop_id 
            AND stock_status = 'out_of_stock'
        ),
        'total_products', (
            SELECT COUNT(*) FROM products
            WHERE shop_id = p_shop_id 
            AND is_visible = true
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS for documentation
-- ============================================
COMMENT ON TABLE shops IS 'Stores information about each family member''s shop';
COMMENT ON TABLE users IS 'Family members and employees with role-based access';
COMMENT ON TABLE products IS 'Product models/items for sale';
COMMENT ON TABLE inventory IS 'Stock levels per size/color variant';
COMMENT ON TABLE sales IS 'Transaction history with full audit trail';

COMMENT ON COLUMN inventory.quantity IS 'Current stock level. Must be >= 0 due to CHECK constraint';
COMMENT ON COLUMN inventory.low_stock_alert IS 'Alert threshold. When quantity <= this value, flag as low stock';
COMMENT ON COLUMN products.image_urls IS 'Array of image URLs. Use array_append() to add new images';
COMMENT ON COLUMN sales.sale_price IS 'Price at time of sale. May differ from current product price';

-- ============================================
-- Schema creation complete!
-- ============================================
