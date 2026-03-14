-- ==========================================
-- MIGRACIÓN: Fix RLS policies for translations table
-- Permitir acceso anónimo para operaciones CRUD en translations
-- ==========================================

-- Habilitar RLS si no está habilitado
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Política para permitir leer traducciones a cualquier usuario (autenticado o no)
CREATE POLICY "Allow read access to all users for translations"
    ON translations
    FOR SELECT
    USING (true);

-- Política para permitir insertar traducciones a cualquier usuario (autenticado o no)
CREATE POLICY "Allow all users to insert translations"
    ON translations
    FOR INSERT
    WITH CHECK (true);

-- Política para permitir actualizar traducciones a cualquier usuario (autenticado o no)
CREATE POLICY "Allow all users to update translations"
    ON translations
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Política para permitir eliminar traducciones a cualquier usuario (autenticado o no)
CREATE POLICY "Allow all users to delete translations"
    ON translations
    FOR DELETE
    USING (true);