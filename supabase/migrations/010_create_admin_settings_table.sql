-- ==========================================
-- MIGRACIÓN: Creación de tabla admin_settings
-- ==========================================

-- Tabla de Configuración del Admin
CREATE TABLE IF NOT EXISTS admin_settings (
    id TEXT PRIMARY KEY DEFAULT 'admin-001',
    dashboard_stats JSONB NOT NULL DEFAULT '{}'::jsonb,
    sidebar_menu JSONB NOT NULL DEFAULT '[]'::jsonb,
    user_roles JSONB NOT NULL DEFAULT '{}'::jsonb,
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    notifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    email_templates JSONB NOT NULL DEFAULT '{}'::jsonb,
    social_media JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo JSONB NOT NULL DEFAULT '{}'::jsonb,
    colors JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuración predeterminada del admin
INSERT INTO admin_settings (
    dashboard_stats,
    sidebar_menu,
    user_roles,
    permissions,
    notifications,
    email_templates,
    social_media,
    seo,
    colors
) VALUES (
    '{"total_users": 0, "total_products": 0, "total_orders": 0, "total_revenue": 0}'::jsonb,
    '[{"id": "dashboard", "name": "Dashboard", "icon": "Dashboard", "url": "/admin", "visible": true}, {"id": "products", "name": "Productos", "icon": "Package", "url": "/admin/products", "visible": true}, {"id": "categories", "name": "Categorías", "icon": "Layers", "url": "/admin/categories", "visible": true}, {"id": "orders", "name": "Pedidos", "icon": "ShoppingCart", "url": "/admin/orders", "visible": true}, {"id": "users", "name": "Usuarios", "icon": "Users", "url": "/admin/users", "visible": true}, {"id": "settings", "name": "Configuración", "icon": "Settings", "url": "/admin/settings", "visible": true}]'::jsonb,
    '{"admin": {"name": "Administrador", "permissions": ["all"], "color": "#FF0000"}, "editor": {"name": "Editor", "permissions": ["products", "categories", "content"], "color": "#00FF00"}, "viewer": {"name": "Visualizador", "permissions": ["view"], "color": "#0000FF"}}'::jsonb,
    '{"products": {"create": true, "read": true, "update": true, "delete": true}, "categories": {"create": true, "read": true, "update": true, "delete": true}, "content": {"create": true, "read": true, "update": true, "delete": true}, "orders": {"read": true, "update": true}, "users": {"read": true, "update": true}}'::jsonb,
    '{"email_notifications": true, "push_notifications": true, "sms_notifications": false}'::jsonb,
    '{"welcome_email": {"subject": "Bienvenido a BionanoAyt", "template": "default"}, "order_confirmation": {"subject": "Confirmación de Pedido", "template": "default"}, "password_reset": {"subject": "Restablecer Contraseña", "template": "default"}}'::jsonb,
    '{"facebook": "https://facebook.com/bionanoayt", "twitter": "https://twitter.com/bionanoayt", "instagram": "https://instagram.com/bionanoayt", "linkedin": "https://linkedin.com/company/bionanoayt"}'::jsonb,
    '{"defaultTitle": "BionanoAyt - Admin Dashboard", "defaultDescription": "Panel de administración de BionanoAyt", "defaultKeywords": "bionanoayt, admin, dashboard"}'::jsonb,
    '{"primary": "#1C5D15", "secondary": "#629960", "accent": "#19FF00", "background": "#F7F9CE"}'::jsonb
) ON CONFLICT (id) DO NOTHING;