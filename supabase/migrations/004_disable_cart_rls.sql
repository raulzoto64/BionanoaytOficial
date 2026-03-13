-- ==========================================
-- MIGRACIÓN: Desactivar RLS para la tabla cart_items
-- ==========================================

-- Desactivar RLS para la tabla cart_items
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- Comentario
COMMENT ON TABLE cart_items IS 'Tabla para almacenar los items del carrito de compras de los usuarios (RLS desactivado)';