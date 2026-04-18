-- =====================================================
-- FIX: Permitir lectura pública de formularios activos
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. Verificar que RLS esté habilitado en forms
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- 2. Borrar policies anteriores si existen
DROP POLICY IF EXISTS "Forms are publicly readable if active" ON public.forms;
DROP POLICY IF EXISTS "Admins can manage forms" ON public.forms;

-- 3. ✅ POLÍTICA CLAVE: Cualquiera puede leer formularios activos
--    (necesario para que el popup funcione con usuarios anónimos)
CREATE POLICY "Forms are publicly readable if active"
  ON public.forms
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- 4. Solo admins pueden crear/editar/borrar formularios
CREATE POLICY "Admins can manage forms"
  ON public.forms
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin')
  )
  WITH CHECK (
    (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin')
  );
