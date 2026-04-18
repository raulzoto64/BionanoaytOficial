-- ========================================================
-- BIONANO A&T - ANALYTICS & NOTIFICATIONS SCHEMA v2
-- ⚠️  Ejecutar COMPLETO en el SQL Editor de Supabase
-- ========================================================

-- ─── 1. TABLA DE TELEMETRÍA DEL SITIO ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visitor_id TEXT NOT NULL,           -- guest_id from localStorage (TEXT, not UUID, for flexibility)
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('page_view','add_to_cart','time_on_page','checkout_step')),
    page_url TEXT NOT NULL,
    session_duration_seconds INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_created_at  ON public.site_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_visitor      ON public.site_analytics(visitor_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type  ON public.site_analytics(event_type);

-- ─── 2. TABLA DE NOTIFICACIONES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    target_role TEXT NOT NULL,          -- 'admin','sales','marketing','all' o un user_id específico
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL,    -- 'lead_alert','new_sale','system'
    read_by TEXT[] DEFAULT ARRAY[]::TEXT[],  -- Array de user UUIDs que ya leyeron (TEXT[] para operadores nativos)
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_role       ON public.notifications(target_role);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

-- ─── 3. RLS — ANALYTICS ─────────────────────────────────────────────────────
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede insertar eventos (visitantes anónimos incluidos)
DROP POLICY IF EXISTS "Allow public insert to analytics" ON public.site_analytics;
CREATE POLICY "Allow public insert to analytics"
    ON public.site_analytics FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Solo roles admin/marketing pueden leer
DROP POLICY IF EXISTS "Allow admin read analytics" ON public.site_analytics;
CREATE POLICY "Allow admin read analytics"
    ON public.site_analytics FOR SELECT TO authenticated
    USING (
        (auth.jwt() ->> 'role') IN ('admin','superadmin','marketing')
        OR (auth.jwt() -> 'user_metadata' ->> 'role') IN ('admin','superadmin','marketing')
    );

-- ─── 4. RLS — NOTIFICATIONS ─────────────────────────────────────────────────
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ✅ CLAVE: Cualquier usuario autenticado puede insertar notificaciones
--    (el backend/carrito está autenticado como usuario real de la tienda)
DROP POLICY IF EXISTS "Allow authenticated to insert notifications" ON public.notifications;
CREATE POLICY "Allow authenticated to insert notifications"
    ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- ✅ También la función SECURITY DEFINER puede insertar (para llamadas anónimas)
DROP POLICY IF EXISTS "Allow anon insert notifications via function" ON public.notifications;
CREATE POLICY "Allow anon insert notifications via function"
    ON public.notifications FOR INSERT TO anon WITH CHECK (true);

-- Leer solo las notificaciones que te corresponden
DROP POLICY IF EXISTS "Allow reading targeted notifications" ON public.notifications;
CREATE POLICY "Allow reading targeted notifications"
    ON public.notifications FOR SELECT TO authenticated
    USING (
        target_role = 'all'
        OR target_role = (auth.jwt() -> 'user_metadata' ->> 'role')
        OR target_role = auth.uid()::text
    );

-- Cualquier autenticado puede actualizar read_by (para marcar como leído)
DROP POLICY IF EXISTS "Allow users to update read_by" ON public.notifications;
CREATE POLICY "Allow users to update read_by"
    ON public.notifications FOR UPDATE TO authenticated USING (true);

-- ─── 5. FUNCIÓN DE FUNNEL STATS ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_funnel_stats(start_date TIMESTAMPTZ, end_date TIMESTAMPTZ)
RETURNS TABLE (
    total_unique_visitors BIGINT,
    total_page_views      BIGINT,
    total_cart_additions  BIGINT,
    total_checkouts_started BIGINT,
    total_sales_closed    BIGINT,
    avg_session_duration  NUMERIC
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(DISTINCT visitor_id)  FROM site_analytics WHERE created_at BETWEEN start_date AND end_date),
        (SELECT COUNT(*)                    FROM site_analytics WHERE event_type = 'page_view'    AND created_at BETWEEN start_date AND end_date),
        (SELECT COUNT(*)                    FROM site_analytics WHERE event_type = 'add_to_cart'  AND created_at BETWEEN start_date AND end_date),
        (SELECT COUNT(DISTINCT visitor_id::text) FROM leads WHERE status = 'checkout_started'     AND created_at BETWEEN start_date AND end_date),
        (SELECT COUNT(DISTINCT visitor_id::text) FROM leads WHERE status IN ('closed','Vendido')  AND created_at BETWEEN start_date AND end_date),
        (SELECT ROUND(AVG(session_duration_seconds)::numeric, 2) FROM site_analytics WHERE event_type = 'time_on_page' AND created_at BETWEEN start_date AND end_date);
END;
$$;

-- ─── 6. FUNCIÓN PÚBLICA PARA INSERTAR NOTIFICACIONES (desde contexto anónimo)
-- Esta función usa SECURITY DEFINER para saltarse RLS si es necesario
CREATE OR REPLACE FUNCTION insert_notification(
    p_target_role TEXT,
    p_title TEXT,
    p_message TEXT,
    p_notification_type TEXT,
    p_action_url TEXT DEFAULT NULL
)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO public.notifications (target_role, title, message, notification_type, action_url)
    VALUES (p_target_role, p_title, p_message, p_notification_type, p_action_url);
END;
$$;

-- Permitir que cualquiera (anon, authenticated) llame a la función
GRANT EXECUTE ON FUNCTION insert_notification TO anon, authenticated;
