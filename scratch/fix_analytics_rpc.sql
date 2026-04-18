-- 1. Eliminar duplicados para evitar error de candidato ambiguo
DROP FUNCTION IF EXISTS public.get_funnel_stats(TIMESTAMP, TIMESTAMP);
DROP FUNCTION IF EXISTS public.get_funnel_stats(TIMESTAMPTZ, TIMESTAMPTZ);

-- 2. Declarar solo UNA función válida (usaremos TIMESTAMPTZ)
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
        (SELECT COUNT(DISTINCT visitor_id::text) FROM leads WHERE status IN ('checkout_started', 'in_progress') AND created_at BETWEEN start_date AND end_date),
        (SELECT COUNT(DISTINCT visitor_id::text) FROM leads WHERE status IN ('closed','Vendido', 'Pagado', 'Completed')  AND created_at BETWEEN start_date AND end_date),
        (SELECT ROUND(AVG(session_duration_seconds)::numeric, 2) FROM site_analytics WHERE event_type = 'time_on_page' AND created_at BETWEEN start_date AND end_date);
END;
$$;
