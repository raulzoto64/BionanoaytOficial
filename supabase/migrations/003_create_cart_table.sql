-- Tabla para almacenar items del carrito de compras
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Relaciones
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    -- Índices para mejorar el rendimiento
    UNIQUE(user_id, product_id),
    INDEX idx_cart_items_user_id (user_id),
    INDEX idx_cart_items_product_id (product_id)
);

-- Función para actualizar la columna updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en cart_items
CREATE TRIGGER trigger_cart_items_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Comentarios
COMMENT ON TABLE cart_items IS 'Tabla para almacenar los items del carrito de compras de los usuarios';
COMMENT ON COLUMN cart_items.id IS 'Identificador único del item del carrito';
COMMENT ON COLUMN cart_items.user_id IS 'Identificador del usuario que posee el carrito';
COMMENT ON COLUMN cart_items.product_id IS 'Identificador del producto en el carrito';
COMMENT ON COLUMN cart_items.quantity IS 'Cantidad del producto en el carrito';
COMMENT ON COLUMN cart_items.created_at IS 'Fecha de creación del item';
COMMENT ON COLUMN cart_items.updated_at IS 'Fecha de última actualización del item';