-- 📂 Estructura de Base de Datos para BionanoAYT (MySQL)
-- Migración desde Supabase

-- La base de datos ya existe: tatian32_bionano
USE tatian32_bionano;

SET FOREIGN_KEY_CHECKS = 0;

-- Borrar vistas y tablas existentes para reconstrucción limpia
DROP VIEW IF EXISTS active_carts_summary;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS blog_post_categories;
DROP TABLE IF EXISTS blog_category_translations;
DROP TABLE IF EXISTS blog_categories;
DROP TABLE IF EXISTS blog_post_translations;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS ecosystem_member_translations;
DROP TABLE IF EXISTS ecosystem_members;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS guests;
DROP TABLE IF EXISTS site_analytics;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS forms;
DROP TABLE IF EXISTS legal_pages;
DROP TABLE IF EXISTS footer_settings;
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS page_contents;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS prices_by_quantity;
DROP TABLE IF EXISTS product_translations;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS translations;
DROP TABLE IF EXISTS category_translations;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Usuarios
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'manager', 'viewer', 'customer') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Roles y Permisos
CREATE TABLE roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
    role_id VARCHAR(50),
    permission_id VARCHAR(100),
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Insertar roles por defecto
INSERT INTO roles (id, name, description) VALUES 
('admin', 'Administrador', 'Acceso total al sistema'),
('editor', 'Editor', 'Gestión de contenidos y blog'),
('manager', 'Gestor ventas', 'Gestión de productos y leads'),
('viewer', 'Visor', 'Solo lectura');

-- 3. Categorías
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    parent_id VARCHAR(36) NULL,
    icon VARCHAR(255),
    `order` INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE category_translations (
    category_id VARCHAR(36),
    language ENUM('es', 'en') NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    PRIMARY KEY (category_id, language),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 4. Productos
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(255),
    status ENUM('active', 'inactive', 'draft') DEFAULT 'draft',
    image VARCHAR(255),
    images JSON, -- Array de strings
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE product_translations (
    product_id VARCHAR(36),
    language ENUM('es', 'en') NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description TEXT,
    features JSON, -- Array de strings
    benefits JSON, -- Array de strings
    technical_specs JSON, -- Objeto clave-valor
    meta_title VARCHAR(255),
    meta_description TEXT,
    PRIMARY KEY (product_id, language),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 5. Precios
CREATE TABLE prices_by_quantity (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36),
    min_quantity INT NOT NULL,
    max_quantity INT NULL,
    price_per_unit DECIMAL(20, 2) NOT NULL,
    currency ENUM('COP', 'USD') DEFAULT 'COP',
    packaging VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 6. Páginas
CREATE TABLE pages (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type ENUM('system', 'custom', 'product') DEFAULT 'custom',
    status ENUM('published', 'draft') DEFAULT 'published',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE page_contents (
    page_id VARCHAR(36),
    language ENUM('es', 'en') NOT NULL,
    sections JSON NOT NULL, -- El array de objetos Section
    PRIMARY KEY (page_id, language),
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);

-- 7. Blog
CREATE TABLE blog_posts (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    author VARCHAR(255),
    cover_image VARCHAR(255),
    status ENUM('draft', 'published') DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    views INT DEFAULT 0,
    type ENUM('article', 'news') DEFAULT 'article',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE blog_post_translations (
    post_id VARCHAR(36),
    language ENUM('es', 'en') NOT NULL,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    PRIMARY KEY (post_id, language),
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
);

CREATE TABLE blog_categories (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    `order` INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE blog_category_translations (
    category_id VARCHAR(36),
    language ENUM('es', 'en') NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    PRIMARY KEY (category_id, language),
    FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE
);

CREATE TABLE blog_post_categories (
    post_id VARCHAR(36),
    category_id VARCHAR(36),
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE
);

-- 8. Configuraciones y Traducciones Generales
CREATE TABLE site_settings (
    id VARCHAR(36) PRIMARY KEY,
    site_name VARCHAR(255),
    site_email VARCHAR(255),
    site_phone VARCHAR(255),
    site_address TEXT,
    social_media JSON,
    seo JSON,
    colors JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE footer_settings (
    id VARCHAR(36) PRIMARY KEY,
    columns JSON,
    contact_info JSON,
    social_media JSON,
    copyright_text_es TEXT,
    copyright_text_en TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE translations (
    id VARCHAR(36) PRIMARY KEY,
    `key` VARCHAR(255) UNIQUE NOT NULL,
    category ENUM('ui', 'messages', 'navigation', 'forms'),
    es TEXT,
    en TEXT
);

-- 9. Legal
CREATE TABLE legal_pages (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title_es VARCHAR(255),
    title_en VARCHAR(255),
    content_es LONGTEXT,
    content_en LONGTEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 10. Carrito y Visitantes
CREATE TABLE guests (
    id VARCHAR(36) PRIMARY KEY,
    user_agent TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    guest_id VARCHAR(36) NULL,
    product_id VARCHAR(36) NOT NULL,
    quantity INT DEFAULT 1,
    packaging VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 11. Ecosistema
CREATE TABLE ecosystem_members (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('active', 'inactive', 'draft') DEFAULT 'draft',
    image VARCHAR(255),
    sector VARCHAR(255),
    social_media JSON,
    youtube_videos JSON,
    short_videos JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ecosystem_member_translations (
    member_id VARCHAR(36),
    language ENUM('es', 'en') NOT NULL,
    name VARCHAR(255),
    description TEXT,
    PRIMARY KEY (member_id, language),
    FOREIGN KEY (member_id) REFERENCES ecosystem_members(id) ON DELETE CASCADE
);

-- 12. Leads y Analytics
CREATE TABLE leads (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    message TEXT,
    lead_type VARCHAR(100), -- 'Contact Form', 'Cart Checkout', etc.
    status ENUM('new', 'contacted', 'qualified', 'customer', 'lost') DEFAULT 'new',
    visitor_id VARCHAR(36),
    user_id VARCHAR(36),
    metadata JSON,
    page_url TEXT,
    referrer TEXT,
    is_anonymous BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE site_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id VARCHAR(36),
    user_id VARCHAR(36),
    event_type VARCHAR(100),
    page_url TEXT,
    session_duration_seconds INT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Notificaciones
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    target_role VARCHAR(100) DEFAULT 'all', -- 'admin', 'user-id', or 'all'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50),
    action_url TEXT,
    read_by JSON, -- Array de IDs de usuario que ya la leyeron
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Formularios Dinámicos
CREATE TABLE forms (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title_es VARCHAR(255),
    title_en VARCHAR(255),
    subtitle_es TEXT,
    subtitle_en TEXT,
    image_url TEXT,
    fields JSON, -- Definición de campos
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 15. Vistas de Utilidad
CREATE VIEW active_carts_summary AS
SELECT 
    COALESCE(user_id, guest_id) as identifier,
    COUNT(*) as total_items,
    MAX(updated_at) as last_activity
FROM cart_items
GROUP BY identifier;
