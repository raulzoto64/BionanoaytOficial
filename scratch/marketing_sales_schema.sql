-- SQL corregido para Marketing y Ventas (Versión con Tooltip de Productos)
DO $$ 
BEGIN
    -- Asegurar que la tabla leads tenga campos de contacto pro
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'phone') THEN
        ALTER TABLE leads ADD COLUMN phone TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'country') THEN
        ALTER TABLE leads ADD COLUMN country TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'city') THEN
        ALTER TABLE leads ADD COLUMN city TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'district') THEN
        ALTER TABLE leads ADD COLUMN district TEXT;
    END IF;

    -- Campo para saber si es un lead de 'carrito abandonado' o 'checkout'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'status') THEN
        ALTER TABLE leads ADD COLUMN status TEXT DEFAULT 'new';
    END IF;
END $$;

-- Vista mejorada (Incluye lista de productos en JSON para Tooltips)
CREATE OR REPLACE VIEW active_carts_summary AS
SELECT 
    COALESCE(ci.user_id::text, ci.guest_id::text) as identifier,
    ci.user_id,
    ci.guest_id,
    COUNT(*) as total_items,
    SUM(ci.quantity) as total_quantity,
    MAX(ci.updated_at) as last_activity,
    jsonb_agg(jsonb_build_object(
        'name', COALESCE(p.slug, 'Producto desconocido'),
        'quantity', ci.quantity,
        'packaging', ci.packaging
    )) as items_list
FROM cart_items ci
LEFT JOIN products p ON ci.product_id = p.id
GROUP BY ci.user_id, ci.guest_id;
