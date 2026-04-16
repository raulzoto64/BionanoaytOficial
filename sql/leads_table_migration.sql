-- ==================================================
-- TABLA DE LEADS PARA CAPTACION DE CLIENTES
-- ==================================================
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  message TEXT,
  lead_type VARCHAR(20) NOT NULL,
  page_url VARCHAR(500) NOT NULL,
  referrer VARCHAR(500),
  user_agent TEXT,
  status VARCHAR(20) DEFAULT 'new',
  assigned_to VARCHAR(100),
  notes TEXT,
  ip_address VARCHAR(45),
  is_anonymous BOOLEAN DEFAULT true,
  user_id UUID REFERENCES auth.users(id),
  visitor_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==================================================
-- INDICES PARA BUSQUEDAS RAPIDAS
-- ==================================================
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_lead_type_idx ON leads(lead_type);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_visitor_id_idx ON leads(visitor_id);

-- ==================================================
-- DATOS DE PRUEBA
-- ==================================================
INSERT INTO leads (name, last_name, email, phone, message, lead_type, page_url, status) VALUES
('Juan', 'Perez', 'juan.perez@email.com', '987654321', 'Me interesa conocer mas sobre los productos para proteccion de agua', 'exit-intent', '/productos', 'new'),
('Maria', 'Lopez', 'maria.lopez@email.com', '987654322', 'Solicito cotizacion para 50 unidades del BNX-100', 'quote', '/productos/bnx-100', 'contacted'),
('Carlos', 'Mendoza', 'carlos.mendoza@email.com', '987654323', 'Necesito asesoria para un proyecto industrial', 'contact', '/contacto', 'in_progress');

-- ==================================================
-- POLITICAS RLS PARA SUPABASE
-- ==================================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Solo administradores pueden ver los leads
CREATE POLICY "Administradores pueden ver todos los leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Cualquiera puede crear un lead (visitantes anonimos)
CREATE POLICY "Todos pueden crear leads"
  ON leads
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Administradores pueden actualizar leads
CREATE POLICY "Administradores pueden actualizar leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');