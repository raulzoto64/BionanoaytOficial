-- ========================================================
-- FIX FINAL: RLS PARA "UPDATE" EN NOTIFICACIONES
-- EJECUTAR EN SUPABASE SQL EDITOR
-- ========================================================

-- Como el sistema de Auth nativo de Supabase está desactivado (Custom Auth),
-- debemos permitir que "anon" pueda ACTUALIZAR (marcar como leído, es decir, escribir en read_by).

DROP POLICY IF EXISTS "Allow users to update read_by" ON public.notifications;

CREATE POLICY "Allow users to update read_by"
    ON public.notifications FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);
