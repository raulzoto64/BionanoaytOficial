-- Fix the unique constraint on cart_items to include packaging
-- This allows the same product with different packaging types to be stored as separate items

-- Remove the old unique constraint
ALTER TABLE cart_items 
DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

-- Add new unique constraint that includes packaging
ALTER TABLE cart_items 
ADD CONSTRAINT cart_items_unique_key UNIQUE(user_id, product_id, packaging);

-- Comment on the new constraint
COMMENT ON CONSTRAINT cart_items_unique_key ON cart_items IS 'Unique constraint to allow same product with different packaging in cart';