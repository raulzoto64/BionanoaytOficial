-- ==========================================
-- MIGRACIÓN: Agregar políticas RLS para tabla translations
-- ==========================================

-- Habilitar RLS si no está habilitado
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Política para permitir leer traducciones a cualquier usuario (autenticado o no)
CREATE POLICY "Allow read access to all users for translations"
    ON translations
    FOR SELECT
    USING (true);

-- Política para permitir insertar traducciones a usuarios autenticados
CREATE POLICY "Allow authenticated users to insert translations"
    ON translations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Política para permitir actualizar traducciones a usuarios autenticados
CREATE POLICY "Allow authenticated users to update translations"
    ON translations
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Política para permitir eliminar traducciones a usuarios autenticados
CREATE POLICY "Allow authenticated users to delete translations"
    ON translations
    FOR DELETE
    TO authenticated
    USING (true);

-- Si quieres permitir acceso anónimo también para insert, update y delete (opcional)
-- CREATE POLICY "Allow anonymous users to insert translations"
--     ON translations
--     FOR INSERT
--     TO anon
--     WITH CHECK (true);

-- CREATE POLICY "Allow anonymous users to update translations"
--     ON translations
--     FOR UPDATE
--     TO anon
--     USING (true)
--     WITH CHECK (true);

-- CREATE POLICY "Allow anonymous users to delete translations"
--     ON translations
--     FOR DELETE
--     TO anon
--     USING (true);