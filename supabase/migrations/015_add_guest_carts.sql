-- Allow NULL values for user_id in cart_items to support anonymous carts
ALTER TABLE cart_items
ALTER COLUMN user_id DROP NOT NULL;

-- Add a new column guest_id to link cart items to anonymous sessions
ALTER TABLE cart_items
ADD COLUMN guest_id UUID NULL;

-- Ensure that either user_id or guest_id is present, but not both
-- And ensure that at least one of them is present.
ALTER TABLE cart_items
ADD CONSTRAINT chk_user_or_guest_id
CHECK (
    (user_id IS NOT NULL AND guest_id IS NULL) OR
    (user_id IS NULL AND guest_id IS NOT NULL)
);

-- Drop the existing unique constraint if it exists
ALTER TABLE cart_items
DROP CONSTRAINT IF EXISTS cart_items_unique_key;

-- Add a partial unique index for authenticated users
CREATE UNIQUE INDEX idx_unique_user_cart_item
ON cart_items (user_id, product_id, packaging)
WHERE user_id IS NOT NULL;

-- Add a partial unique index for guest users
CREATE UNIQUE INDEX idx_unique_guest_cart_item
ON cart_items (guest_id, product_id, packaging)
WHERE guest_id IS NOT NULL;

-- Add comments for the new column and constraint
COMMENT ON COLUMN cart_items.guest_id IS 'Identificador de sesión para usuarios no autenticados';
COMMENT ON CONSTRAINT chk_user_or_guest_id ON cart_items IS 'Asegura que un item de carrito está asociado a un user_id o a un guest_id, pero no a ambos, y siempre a uno.';
