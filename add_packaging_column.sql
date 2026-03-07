-- Migration script to add packaging column to prices_by_quantity table

-- Add packaging column (text)
ALTER TABLE public.prices_by_quantity
ADD COLUMN packaging text NOT NULL DEFAULT 'Botella pequeña';

-- Create index for faster queries by packaging type
CREATE INDEX idx_prices_by_quantity_packaging ON public.prices_by_quantity(packaging);

-- Create composite index for packaging and quantity ranges
CREATE INDEX idx_prices_by_quantity_product_packaging ON public.prices_by_quantity(product_id, packaging);

-- Note: You should run this SQL directly in your Supabase dashboard SQL editor
-- or using the supabase CLI