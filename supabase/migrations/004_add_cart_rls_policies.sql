-- ==========================================
-- MIGRACIÓN: Políticas RLS para la tabla cart_items
-- ==========================================

-- Habilitar RLS para la tabla cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Política para permitir a los usuarios autenticados ver sus propios items del carrito
CREATE POLICY "Allow authenticated users to view their own cart items"
ON cart_items
FOR SELECT
USING (auth.uid()::text = user_id);

-- Política para permitir a los usuarios autenticados agregar items al carrito
CREATE POLICY "Allow authenticated users to add cart items"
ON cart_items
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Política para permitir a los usuarios autenticados actualizar sus propios items del carrito
CREATE POLICY "Allow authenticated users to update their own cart items"
ON cart_items
FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Política para permitir a los usuarios autenticados eliminar sus propios items del carrito
CREATE POLICY "Allow authenticated users to delete their own cart items"
ON cart_items
FOR DELETE
USING (auth.uid()::text = user_id);

-- Comentarios
COMMENT ON POLICY "Allow authenticated users to view their own cart items" ON cart_items IS 'Permite a los usuarios autenticados ver solo sus propios items del carrito';
COMMENT ON POLICY "Allow authenticated users to add cart items" ON cart_items IS 'Permite a los usuarios autenticados agregar items al carrito';
COMMENT ON POLICY "Allow authenticated users to update their own cart items" ON cart_items IS 'Permite a los usuarios autenticados actualizar solo sus propios items del carrito';
COMMENT ON POLICY "Allow authenticated users to delete their own cart items" ON cart_items IS 'Permite a los usuarios autenticados eliminar solo sus propios items del carrito';