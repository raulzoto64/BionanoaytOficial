-- Bionano A&T CRM - Lost Leads SQL View
-- This view acts as a dedicated table for filtering leads that have been marked as 'lost' (Perdidos).
-- It allows the marketing/sales teams to run isolated retargeting campaigns without cluttering the main active tables.

CREATE OR REPLACE VIEW marketing_lost_leads AS
SELECT 
    id,
    name,
    last_name,
    email,
    phone,
    lead_type,
    page_url,
    metadata,
    notes,
    created_at,
    updated_at
FROM 
    leads 
WHERE 
    status = 'lost'
ORDER BY 
    updated_at DESC;

-- Optional: Add a comment describing the view in the database schema
COMMENT ON VIEW marketing_lost_leads IS 'Vista aislada que contiene unicamente los leads que fueron cerrados como "Perdido", ordenados por la fecha de actualización más reciente para esfuerzos de remarketing a largo plazo.';
