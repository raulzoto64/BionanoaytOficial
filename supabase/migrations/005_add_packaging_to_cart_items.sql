-- Agregar columna packaging a la tabla cart_items
ALTER TABLE cart_items 
ADD COLUMN packaging VARCHAR(255) NULL;

-- Comentario sobre la nueva columna
COMMENT ON COLUMN cart_items.packaging IS 'Tipo de embase del producto (ej: "1L", "5L", "20L", "Galón", "Cilindro 10kg")';