-- Add packaging column to prices_by_quantity table
-- This allows defining different price ranges for the same product with different packaging types

-- Add packaging column
ALTER TABLE prices_by_quantity 
ADD COLUMN packaging VARCHAR(255) NULL;

-- Remove old unique constraint that doesn't include packaging
ALTER TABLE prices_by_quantity 
DROP CONSTRAINT IF EXISTS prices_by_quantity_product_id_min_quantity_max_quantity_key;

-- Add new unique constraint that includes packaging
ALTER TABLE prices_by_quantity 
ADD CONSTRAINT prices_by_quantity_unique_key UNIQUE(product_id, min_quantity, max_quantity, packaging);

-- Comment on the new column
COMMENT ON COLUMN prices_by_quantity.packaging IS 'Tipo de embase del producto (ej: "Botella 1L", "Galón 4L", "Cilindro 10kg")';

-- Comment on the new constraint
COMMENT ON CONSTRAINT prices_by_quantity_unique_key ON prices_by_quantity IS 'Unique constraint to allow same quantity range with different packaging';