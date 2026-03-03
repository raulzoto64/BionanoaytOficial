-- Add featured column to products table
ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT false;

-- Set initial featured products
UPDATE products SET featured = true WHERE id IN ('prod-001', 'prod-002', 'prod-003');

-- Verify the changes
SELECT id, name, featured FROM products;