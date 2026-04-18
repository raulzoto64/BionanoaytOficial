-- ========================================================
-- FIX DE RLS PARA MODO "CUSTOM AUTH"
-- EJECUTAR EN SUPABASE SQL EDITOR
-- ========================================================

-- Ya que estás usando un login manual (public.users) y no Supabase Auth,
-- el backend de Supabase ve todas las peticiones como "anónimas".
-- Debemos relajar el RLS para que el rol anónimo pueda LEER las tablas
-- de notificaciones y analíticas y así el admin panel funcione.

-- 1. Políticas para Notificaciones
DROP POLICY IF EXISTS "Allow reading targeted notifications" ON public.notifications;

CREATE POLICY "Allow reading targeted notifications"
    ON public.notifications FOR SELECT TO anon, authenticated
    USING (true); -- Permitir a la app leer todas las notificaciones (la app filtra por rol localmente)

-- 2. Políticas para Analytics (Motor de Crecimiento)
DROP POLICY IF EXISTS "Allow admin read analytics" ON public.site_analytics;

CREATE POLICY "Allow admin read analytics"
    ON public.site_analytics FOR SELECT TO anon, authenticated
    USING (true); -- Permitir a la app leer la telemetría
