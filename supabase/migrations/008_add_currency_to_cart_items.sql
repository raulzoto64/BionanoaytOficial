-- Add currency column to cart_items table
-- This allows storing the currency for each cart item

ALTER TABLE cart_items 
ADD COLUMN currency VARCHAR(3) DEFAULT 'COP';

-- Add price_per_unit and total_price columns if they don't exist
ALTER TABLE cart_items 
ADD COLUMN price_per_unit NUMERIC(10, 2) DEFAULT 0;

ALTER TABLE cart_items 
ADD COLUMN total_price NUMERIC(10, 2) DEFAULT 0;

-- Comment on the new columns
COMMENT ON COLUMN cart_items.currency IS 'Moneda del producto en el carrito (ej: "COP", "USD")';
COMMENT ON COLUMN cart_items.price_per_unit IS 'Precio por unidad del producto en el carrito';
COMMENT ON COLUMN cart_items.total_price IS 'Precio total del producto en el carrito (cantidad * precio por unidad)';