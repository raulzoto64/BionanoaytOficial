-- Esta es una migracion para añadir la columna visitor_id a la tabla leads
-- SOLO si la columna no existe ya.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'leads'
        AND column_name = 'visitor_id'
    ) THEN
        ALTER TABLE leads
        ADD COLUMN visitor_id VARCHAR(36);
    END IF;
END
$$;

-- Añadir indice para busquedas rapidas
CREATE INDEX IF NOT EXISTS leads_visitor_id_idx ON leads(visitor_id);

-- Opcional: Si quieres actualizar los leads existentes con un visitor_id por defecto
-- UPDATE leads SET visitor_id = gen_random_uuid()::text WHERE visitor_id IS NULL;

-- Opcional: Actualizar politicas RLS si es necesario para la nueva columna
-- Por ejemplo, si quieres que los administradores puedan verla:
-- DROP POLICY IF EXISTS "Administradores pueden ver todos los leads" ON leads;
-- CREATE POLICY "Administradores pueden ver todos los leads" ON leads FOR SELECT TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Si la columna ya existe, esto no hara nada y no causara error.
