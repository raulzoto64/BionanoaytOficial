-- ==========================================
-- MIGRACIÓN: Políticas RLS para la tabla legal_pages
-- ==========================================

-- Habilitar RLS para la tabla legal_pages
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso público a las páginas legales activas
CREATE POLICY "Allow public access to active legal pages"
ON legal_pages
FOR SELECT
USING (is_active = true);

-- Política para permitir acceso público a todas las páginas legales (para administración)
CREATE POLICY "Allow public access to all legal pages"
ON legal_pages
FOR SELECT
USING (true);

-- Política para permitir acceso público a crear páginas legales
CREATE POLICY "Allow public access to create legal pages"
ON legal_pages
FOR INSERT
WITH CHECK (true);

-- Política para permitir acceso público a actualizar páginas legales
CREATE POLICY "Allow public access to update legal pages"
ON legal_pages
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Política para permitir acceso público a eliminar páginas legales
CREATE POLICY "Allow public access to delete legal pages"
ON legal_pages
FOR DELETE
USING (true);

-- Habilitar RLS para la tabla footer_settings
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;

-- Política para permitir acceso público a la configuración del footer
CREATE POLICY "Allow public access to footer settings"
ON footer_settings
FOR SELECT
USING (true);

-- Política para permitir acceso público a actualizar la configuración del footer
CREATE POLICY "Allow public access to update footer settings"
ON footer_settings
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Política para permitir acceso público a crear la configuración del footer
CREATE POLICY "Allow public access to create footer settings"
ON footer_settings
FOR INSERT
WITH CHECK (true);

-- Política para permitir acceso público a eliminar la configuración del footer
CREATE POLICY "Allow public access to delete footer settings"
ON footer_settings
FOR DELETE
USING (true);

-- Comentarios
COMMENT ON POLICY "Allow public access to active legal pages" ON legal_pages IS 'Permite acceso público a las páginas legales activas';
COMMENT ON POLICY "Allow public access to all legal pages" ON legal_pages IS 'Permite acceso público a todas las páginas legales para fines de administración';
COMMENT ON POLICY "Allow public access to create legal pages" ON legal_pages IS 'Permite acceso público a crear nuevas páginas legales';
COMMENT ON POLICY "Allow public access to update legal pages" ON legal_pages IS 'Permite acceso público a actualizar páginas legales';
COMMENT ON POLICY "Allow public access to delete legal pages" ON legal_pages IS 'Permite acceso público a eliminar páginas legales';
COMMENT ON POLICY "Allow public access to footer settings" ON footer_settings IS 'Permite acceso público a la configuración del footer';
COMMENT ON POLICY "Allow public access to update footer settings" ON footer_settings IS 'Permite acceso público a actualizar la configuración del footer';
COMMENT ON POLICY "Allow public access to create footer settings" ON footer_settings IS 'Permite acceso público a crear la configuración del footer';
COMMENT ON POLICY "Allow public access to delete footer settings" ON footer_settings IS 'Permite acceso público a eliminar la configuración del footer';