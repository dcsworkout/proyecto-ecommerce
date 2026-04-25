-- ============================================
-- SEED DATA: Sample shops, users, products, inventory, and sales
-- Password for all users: "password123"
-- ============================================

-- ============================================
-- 1. CREATE SHOPS
-- ============================================
INSERT INTO shops (id, name, slug, whatsapp_number, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Tienda de María', 'maria', '+529991234567', true),
('22222222-2222-2222-2222-222222222222', 'Tienda de Juan', 'juan', '+529997654321', true);

-- ============================================
-- 2. CREATE USERS
-- Password hash for "password123"
-- ============================================
INSERT INTO users (id, shop_id, email, password_hash, full_name, role, is_active) VALUES
-- María's shop
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 
 'maria@tienda.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
 'María González', 'owner', true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 
 'ana@tienda.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
 'Ana López (Empleada)', 'employee', true),

-- Juan's shop  
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 
 'juan@tienda.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
 'Juan Pérez', 'owner', true);

-- Update shops with owner IDs
UPDATE shops SET owner_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE shops SET owner_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc' WHERE id = '22222222-2222-2222-2222-222222222222';

-- ============================================
-- 3. CREATE PRODUCTS (María's shop)
-- ============================================
INSERT INTO products (id, shop_id, modelo, tipo, description, price, image_urls, is_visible) VALUES
-- Vestidos
('a0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 
 'Vestido Flores', 'Vestido', 
 'Hermoso vestido con estampado de flores, perfecto para ocasiones especiales. Tela ligera y cómoda.',
 650.00, ARRAY['https://placeholder.com/vestido-flores-1.jpg'], true),

('a0000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 
 'Vestido Noche Elegante', 'Vestido', 
 'Vestido de noche largo, ideal para eventos formales. Color negro con detalles brillantes.',
 1200.00, ARRAY['https://placeholder.com/vestido-noche.jpg'], true),

-- Blusas
('a0000001-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 
 'Blusa Casual Blanca', 'Blusa', 
 'Blusa casual de algodón, perfecta para el día a día. Corte clásico.',
 320.00, ARRAY['https://placeholder.com/blusa-blanca.jpg'], true),

-- Pantalones
('a0000001-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 
 'Pantalón Mezclilla Clásico', 'Pantalón', 
 'Pantalón de mezclilla de corte recto. Tela resistente y cómoda.',
 750.00, ARRAY['https://placeholder.com/pantalon-mezclilla.jpg'], true),

-- Faldas
('a0000001-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 
 'Falda Plisada Rosa', 'Falda', 
 'Falda plisada de tela suave, perfecta para primavera.',
 520.00, ARRAY['https://placeholder.com/falda-plisada.jpg'], true);

-- ============================================
-- 4. CREATE PRODUCTS (Juan's shop)
-- ============================================
INSERT INTO products (id, shop_id, modelo, tipo, description, price, image_urls, is_visible) VALUES
-- Vestidos
('b0000001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 
 'Vestido Casual Rayas', 'Vestido', 
 'Vestido casual con rayas horizontales. Ideal para uso diario.',
 580.00, ARRAY['https://placeholder.com/vestido-rayas.jpg'], true),

-- Blusas
('b0000001-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 
 'Blusa Encaje Negra', 'Blusa', 
 'Blusa elegante con detalles de encaje. Perfecta para ocasiones especiales.',
 480.00, ARRAY['https://placeholder.com/blusa-encaje.jpg'], true),

('b0000001-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 
 'Blusa Estampada Flores', 'Blusa', 
 'Blusa ligera con estampado floral. Colores vivos.',
 420.00, ARRAY['https://placeholder.com/blusa-flores.jpg'], true),

-- Pantalones
('b0000001-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 
 'Pantalón Negro Formal', 'Pantalón', 
 'Pantalón de vestir negro. Corte formal y elegante.',
 680.00, ARRAY['https://placeholder.com/pantalon-formal.jpg'], true),

-- Accesorios
('b0000001-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 
 'Bolsa Mano Café', 'Accesorio', 
 'Bolsa de mano elegante color café. Varios compartimentos.',
 890.00, ARRAY['https://placeholder.com/bolsa-cafe.jpg'], true);

-- ============================================
-- 5. CREATE INVENTORY (María's shop)
-- ============================================
-- Vestido Flores
INSERT INTO inventory (product_id, talla, color, quantity, low_stock_alert) VALUES
('a0000001-0000-0000-0000-000000000001', 'S', 'Rosa', 5, 2),
('a0000001-0000-0000-0000-000000000001', 'S', 'Azul', 3, 2),
('a0000001-0000-0000-0000-000000000001', 'M', 'Rosa', 8, 2),
('a0000001-0000-0000-0000-000000000001', 'M', 'Azul', 4, 2),
('a0000001-0000-0000-0000-000000000001', 'M', 'Blanco', 6, 2),
('a0000001-0000-0000-0000-000000000001', 'L', 'Rosa', 2, 2),
('a0000001-0000-0000-0000-000000000001', 'L', 'Azul', 1, 2);

-- Vestido Noche
INSERT INTO inventory (product_id, talla, color, quantity, low_stock_alert) VALUES
('a0000001-0000-0000-0000-000000000002', 'S', 'Negro', 3, 1),
('a0000001-0000-0000-0000-000000000002', 'M', 'Negro', 5, 1),
('a0000001-0000-0000-0000-000000000002', 'L', 'Negro', 2, 1);

-- Blusa Casual
INSERT INTO inventory (product_id, talla, color, quantity, low_stock_alert) VALUES
('a0000001-0000-0000-0000-000000000003', 'XS', 'Blanco', 10, 3),
('a0000001-0000-0000-0000-000000000003', 'S', 'Blanco', 12, 3),
('a0000001-0000-0000-0000-000000000003', 'M', 'Blanco', 15, 3),
('a0000001-0000-0000-0000-000000000003', 'L', 'Blanco', 8, 3);

-- Pantalón Mezclilla
INSERT INTO inventory (product_id, talla, color, quantity, low_stock_alert) VALUES
('a0000001-0000-0000-0000-000000000004', 'S', 'Azul Oscuro', 4, 2),
('a0000001-0000-0000-0000-000000000004', 'M', 'Azul Oscuro', 7, 2),
('a0000001-0000-0000-0000-000000000004', 'M', 'Negro', 5, 2),
('a0000001-0000-0000-0000-000000000004', 'L', 'Azul Oscuro', 3, 2),
('a0000001-0000-0000-0000-000000000004', 'L', 'Negro', 2, 2);

-- Falda Plisada
INSERT INTO inventory (product_id, talla, color, quantity, low_stock_alert) VALUES
('a0000001-0000-0000-0000-000000000005', 'S', 'Rosa', 6, 2),
('a0000001-0000-0000-0000-000000000005', 'M', 'Rosa', 4, 2),
('a0000001-0000-0000-0000-000000000005', 'M', 'Amarillo', 5, 2),
('a0000001-0000-0000-0000-000000000005', 'L', 'Rosa', 3, 2);

-- ============================================
-- 6. CREATE INVENTORY (Juan's shop)
-- ============================================
-- Vestido Rayas
INSERT INTO inventory (product_id, talla, color, quantity, low_stock_alert) VALUES
('b0000001-0000-0000-0000-000000000001', 'S', 'Azul/Blanco', 7, 2),
('b0000001-0000-0000-0000-000000000001', 'M', 'Azul/Blanco', 9, 2),
('b0000001-0000-0000-0000-000000000001', 'M', 'Negro/Blanco', 4, 2),
('b0000001-0000-0000-0000-000000000001', 'L', 'Azul/Blanco', 5, 2);

-- Blusa Encaje
INSERT INTO inventory (product_id, talla, color, quantity, low_stock_alert) VALUES
('b0000001-0000-0000-0000-000000000002', 'S', 'Negro', 8, 3),
('b0000001-0000-0000-0000-000000000002', 'M', 'Negro', 10, 3),
('b0000001-0000-0000-0000-000000000002', 'M', 'Blanco', 6, 3),
('b0000001-0000-0000-0000-000000000002', 'L', 'Negro', 4, 3);

-- Blusa Flores
INSERT INTO inventory (product_id, talla, color, quantity, low_stock_alert) VALUES
('b0000001-0000-0000-0000-000000000003', 'S', 'Multicolor', 12, 3),
('b0000001-0000-0000-0000-000000000003', 'M', 'Multicolor', 15, 3),
('b0000001-0000-0000-0000-000000000003', 'L', 'Multicolor', 8, 3);

-- Pantalón Formal
INSERT INTO inventory (product_id, talla, color, quantity, low_stock_alert) VALUES
('b0000001-0000-0000-0000-000000000004', 'S', 'Negro', 5, 2),
('b0000001-0000-0000-0000-000000000004', 'M', 'Negro', 8, 2),
('b0000001-0000-0000-0000-000000000004', 'L', 'Negro', 6, 2),
('b0000001-0000-0000-0000-000000000004', 'XL', 'Negro', 3, 2);

-- Bolsa (talla única)
INSERT INTO inventory (product_id, talla, color, quantity, low_stock_alert) VALUES
('b0000001-0000-0000-0000-000000000005', 'UNICA', 'Café', 10, 2),
('b0000001-0000-0000-0000-000000000005', 'UNICA', 'Negro', 8, 2);

-- ============================================
-- 7. CREATE SAMPLE SALES (last 7 days)
-- ============================================
-- María's shop sales
INSERT INTO sales (shop_id, inventory_id, user_id, quantity_sold, sale_price, notes, sale_date) 
SELECT 
    '11111111-1111-1111-1111-111111111111',
    i.id,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    1,
    p.price,
    'Venta normal',
    NOW() - INTERVAL '2 days'
FROM inventory i
JOIN products p ON i.product_id = p.id
WHERE i.product_id = 'a0000001-0000-0000-0000-000000000001' AND i.talla = 'M' AND i.color = 'Rosa'
LIMIT 1;

INSERT INTO sales (shop_id, inventory_id, user_id, quantity_sold, sale_price, notes, sale_date) 
SELECT 
    '11111111-1111-1111-1111-111111111111',
    i.id,
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    1,
    p.price,
    'Cliente regular',
    NOW() - INTERVAL '1 day'
FROM inventory i
JOIN products p ON i.product_id = p.id
WHERE i.product_id = 'a0000001-0000-0000-0000-000000000003' AND i.talla = 'M' AND i.color = 'Blanco'
LIMIT 1;

INSERT INTO sales (shop_id, inventory_id, user_id, quantity_sold, sale_price, notes, sale_date) 
SELECT 
    '11111111-1111-1111-1111-111111111111',
    i.id,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    1,
    p.price,
    'Venta del día',
    NOW()
FROM inventory i
JOIN products p ON i.product_id = p.id
WHERE i.product_id = 'a0000001-0000-0000-0000-000000000005' AND i.talla = 'M' AND i.color = 'Rosa'
LIMIT 1;

-- Juan's shop sales
INSERT INTO sales (shop_id, inventory_id, user_id, quantity_sold, sale_price, notes, sale_date) 
SELECT 
    '22222222-2222-2222-2222-222222222222',
    i.id,
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    1,
    p.price,
    'Primera venta del día',
    NOW() - INTERVAL '3 days'
FROM inventory i
JOIN products p ON i.product_id = p.id
WHERE i.product_id = 'b0000001-0000-0000-0000-000000000002' AND i.talla = 'M' AND i.color = 'Negro'
LIMIT 1;

INSERT INTO sales (shop_id, inventory_id, user_id, quantity_sold, sale_price, notes, sale_date) 
SELECT 
    '22222222-2222-2222-2222-222222222222',
    i.id,
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    1,
    p.price,
    'Cliente satisfecho',
    NOW()
FROM inventory i
JOIN products p ON i.product_id = p.id
WHERE i.product_id = 'b0000001-0000-0000-0000-000000000005' AND i.talla = 'UNICA' AND i.color = 'Café'
LIMIT 1;

-- ============================================
-- SEED DATA COMPLETE!
-- ============================================
