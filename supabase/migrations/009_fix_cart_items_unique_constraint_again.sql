-- Fix the unique constraint on cart_items to properly include packaging
-- This ensures that the same product with different packaging types can be stored as separate items

-- First, check if the old constraint still exists and remove it
ALTER TABLE cart_items 
DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

-- Also check if there's any other similar constraint that might be causing issues
ALTER TABLE cart_items 
DROP CONSTRAINT IF EXISTS cart_items_unique_key;

-- Add the correct unique constraint that includes all three fields
ALTER TABLE cart_items 
ADD CONSTRAINT cart_items_unique_key UNIQUE(user_id, product_id, packaging);

-- Verify and comment the new constraint
COMMENT ON CONSTRAINT cart_items_unique_key ON cart_items IS 'Unique constraint to allow same product with different packaging in cart';