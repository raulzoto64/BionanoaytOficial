-- Migration script to update unique constraint on prices_by_quantity table

-- First, drop the existing unique constraint
ALTER TABLE public.prices_by_quantity
DROP CONSTRAINT prices_by_quantity_product_id_min_quantity_max_quantity_key;

-- Then, create a new unique constraint that includes packaging
ALTER TABLE public.prices_by_quantity
ADD CONSTRAINT prices_by_quantity_product_id_packaging_min_quantity_max_quantity_key
UNIQUE (product_id, packaging, min_quantity, max_quantity);