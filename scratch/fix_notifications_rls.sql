-- ========================================================
-- FIX DE RLS PARA NOTIFICACIONES
-- EJECUTAR EN SUPABASE SQL EDITOR
-- ========================================================

-- Borrar la política restrictiva actual
DROP POLICY IF EXISTS "Allow reading targeted notifications" ON public.notifications;

-- Crear una nueva política que permita a los administradores leer TODO
CREATE POLICY "Allow reading targeted notifications"
    ON public.notifications FOR SELECT TO authenticated
    USING (
        target_role = 'all'
        OR target_role = (auth.jwt() -> 'user_metadata' ->> 'role')
        OR target_role = auth.uid()::text
        OR (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin', 'superadmin')
    );
