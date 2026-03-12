-- ==========================================
-- MIGRACIÓN: Creación de tablas para BionanoAYT
-- ==========================================

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'manager', 'viewer', 'customer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'draft')),
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Traducciones de Productos
CREATE TABLE IF NOT EXISTS product_translations (
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('es', 'en')),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
    technical_specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    meta_title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    PRIMARY KEY (product_id, language)
);

-- Tabla de Precios por Cantidad
CREATE TABLE IF NOT EXISTS prices_by_quantity (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    min_quantity INTEGER NOT NULL,
    max_quantity INTEGER,
    price_per_unit NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL CHECK (currency IN ('COP', 'USD')),
    UNIQUE(product_id, min_quantity, max_quantity)
);

-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    parent_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
    icon TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive'))
);

-- Tabla de Traducciones de Categorías
CREATE TABLE IF NOT EXISTS category_translations (
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('es', 'en')),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (category_id, language)
);

-- Tabla de Páginas
CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('system', 'custom', 'product')),
    status TEXT NOT NULL CHECK (status IN ('published', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Contenido de Páginas
CREATE TABLE IF NOT EXISTS page_contents (
    page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('es', 'en')),
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    PRIMARY KEY (page_id, language)
);

-- Tabla de Configuración del Sitio
CREATE TABLE IF NOT EXISTS site_settings (
    id TEXT PRIMARY KEY DEFAULT 'settings-001',
    site_name TEXT NOT NULL,
    site_email TEXT NOT NULL,
    site_phone TEXT NOT NULL,
    site_address TEXT NOT NULL,
    social_media JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo JSONB NOT NULL DEFAULT '{}'::jsonb,
    colors JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Tabla de Traducciones Generales
CREATE TABLE IF NOT EXISTS translations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "key" TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('ui', 'messages', 'navigation', 'forms')),
    es TEXT NOT NULL,
    en TEXT NOT NULL
);

-- ==========================================
-- DATOS DE EJEMPLO
-- ==========================================

-- Insertar configuración predeterminada
INSERT INTO site_settings (
    site_name, site_email, site_phone, site_address, social_media, seo, colors
) VALUES (
    'A&T BioNano',
    'contacto@atbionano.com',
    '+57 300 123 4567',
    'Calle 123 #45-67, Bogotá, Colombia',
    '{"facebook": "https://facebook.com/atbionano", "twitter": "https://twitter.com/atbionano", "instagram": "https://instagram.com/atbionano", "linkedin": "https://linkedin.com/company/atbionano"}'::jsonb,
    '{"defaultTitle": "A&T BioNano - Innovación en Bionanotecnología", "defaultDescription": "Desarrollamos soluciones antimicrobianas y fungicidas sostenibles con nanotecnología avanzada", "defaultKeywords": "bionanotecnología, antimicrobianos, fungicidas, nanotecnología, sostenibilidad"}'::jsonb,
    '{"primary": "#1C5D15", "secondary": "#629960", "accent": "#19FF00", "background": "#F7F9CE"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Insertar categorías predeterminadas
INSERT INTO categories (id, slug, parent_id, icon, "order", status) VALUES
('cat-001', 'antimicrobianos', null, 'Shield', 1, 'active'),
('cat-002', 'limpieza-industrial', null, 'Sparkles', 2, 'active'),
('cat-003', 'fertilizantes', null, 'Leaf', 3, 'active'),
('cat-004', 'fungicidas', null, 'Bug', 4, 'active');

-- Insertar traducciones de categorías
INSERT INTO category_translations (category_id, language, name, description) VALUES
('cat-001', 'es', 'Antimicrobianos', 'Productos antimicrobianos de amplio espectro'),
('cat-001', 'en', 'Antimicrobials', 'Broad-spectrum antimicrobial products'),
('cat-002', 'es', 'Limpieza Industrial', 'Limpiadores de alto rendimiento'),
('cat-002', 'en', 'Industrial Cleaning', 'High-performance cleaners'),
('cat-003', 'es', 'Fertilizantes', 'Fertilizantes nanotecnológicos'),
('cat-003', 'en', 'Fertilizers', 'Nanotechnological fertilizers'),
('cat-004', 'es', 'Fungicidas', 'Soluciones contra hongos'),
('cat-004', 'en', 'Fungicides', 'Solutions against fungi');

-- Insertar productos predeterminados
INSERT INTO products (id, slug, category, status, image) VALUES
('prod-001', 'bionanoaxus-bnx', 'cat-001', 'active', 'https://images.unsplash.com/photo-1576834976341-53b1b975c6f9?w=800'),
('prod-002', 'z-klean-limpiador', 'cat-002', 'active', 'https://images.unsplash.com/photo-1580053234218-74eb4ae03a44?w=800'),
('prod-003', 'nanofert-plus', 'cat-003', 'active', 'https://images.unsplash.com/photo-1601839215170-6ce5854968d6?w=800'),
('prod-004', 'bioshield-spray', 'cat-001', 'active', 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800');

-- Insertar traducciones de productos
INSERT INTO product_translations (product_id, language, name, description, short_description, features, benefits, technical_specs, meta_title, meta_description) VALUES
(
    'prod-001',
    'es',
    'Bionanoaxus (BNX)',
    'Bionanoaxus es nuestro producto estrella, un antimicrobiano revolucionario que utiliza nanotecnología de última generación para eliminar bacterias, virus y hongos. Su fórmula única ofrece protección duradera y es completamente segura para el medio ambiente.',
    'Antimicrobiano de amplio espectro con nanotecnología avanzada',
    '["Tecnología de nanopartículas de plata", "Eficacia 99.9% contra microorganismos", "Biodegradable y eco-friendly", "Sin residuos tóxicos", "Protección de larga duración"]'::jsonb,
    '["Reduce enfermedades transmitidas por microorganismos", "Seguro para uso en contacto con alimentos", "No genera resistencia microbiana", "Aplicación versátil en múltiples superficies", "Contribuye a la sostenibilidad ambiental"]'::jsonb,
    '{"Composición": "Nanopartículas de plata coloidal", "Concentración": "20-50 ppm", "pH": "6.5 - 7.5", "Densidad": "1.01 g/ml", "Vida útil": "24 meses", "Almacenamiento": "Temperatura ambiente, protegido de luz directa"}'::jsonb,
    'Bionanoaxus - Antimicrobiano Nanotecnológico | A&T BioNano',
    'Descubre Bionanoaxus, el antimicrobiano más avanzado con nanotecnología. Eficacia 99.9%, biodegradable y seguro.'
),
(
    'prod-001',
    'en',
    'Bionanoaxus (BNX)',
    'Bionanoaxus is our flagship product, a revolutionary antimicrobial that uses state-of-the-art nanotechnology to eliminate bacteria, viruses, and fungi. Its unique formula offers long-lasting protection and is completely safe for the environment.',
    'Broad-spectrum antimicrobial with advanced nanotechnology',
    '["Silver nanoparticle technology", "99.9% efficacy against microorganisms", "Biodegradable and eco-friendly", "No toxic residues", "Long-lasting protection"]'::jsonb,
    '["Reduces microorganism-transmitted diseases", "Safe for food contact use", "Does not generate microbial resistance", "Versatile application on multiple surfaces", "Contributes to environmental sustainability"]'::jsonb,
    '{"Composition": "Colloidal silver nanoparticles", "Concentration": "20-50 ppm", "pH": "6.5 - 7.5", "Density": "1.01 g/ml", "Shelf life": "24 months", "Storage": "Room temperature, protected from direct light"}'::jsonb,
    'Bionanoaxus - Nanotechnological Antimicrobial | A&T BioNano',
    'Discover Bionanoaxus, the most advanced antimicrobial with nanotechnology. 99.9% efficacy, biodegradable and safe.'
),
(
    'prod-002',
    'es',
    'Z-Klean Limpiador Industrial',
    'Z-Klean es un limpiador industrial revolucionario que combina el poder de la nanotecnología con ingredientes biodegradables para ofrecer una limpieza profunda y efectiva sin dañar el medio ambiente.',
    'Limpiador de alto rendimiento con nanotecnología',
    '["Formulación con nanotecnología", "Desengrasante de alta potencia", "Biodegradable 100%", "No corrosivo", "Libre de fosfatos"]'::jsonb,
    '["Limpieza profunda en superficies industriales", "Reduce tiempo de limpieza en 40%", "Seguro para operarios", "Versatilidad en múltiples aplicaciones", "Reduce costos operativos"]'::jsonb,
    '{"Tipo": "Limpiador alcalino", "pH": "11.5 - 12.5", "Dilución": "1:10 a 1:50", "Temperatura aplicación": "20-40°C", "Vida útil": "18 meses", "Presentación": "1L, 5L, 20L"}'::jsonb,
    'Z-Klean - Limpiador Industrial Nanotecnológico | A&T BioNano',
    'Z-Klean, limpiador industrial con nanotecnología. Biodegradable, alta potencia y seguro.'
),
(
    'prod-002',
    'en',
    'Z-Klean Industrial Cleaner',
    'Z-Klean is a revolutionary industrial cleaner that combines the power of nanotechnology with biodegradable ingredients to offer deep and effective cleaning without harming the environment.',
    'High-performance cleaner with nanotechnology',
    '["Nanotechnology formulation", "High-power degreaser", "100% biodegradable", "Non-corrosive", "Phosphate-free"]'::jsonb,
    '["Deep cleaning on industrial surfaces", "Reduces cleaning time by 40%", "Safe for operators", "Versatility in multiple applications", "Reduces operating costs"]'::jsonb,
    '{"Type": "Alkaline cleaner", "pH": "11.5 - 12.5", "Dilution": "1:10 to 1:50", "Application temperature": "20-40°C", "Shelf life": "18 months", "Presentation": "1L, 5L, 20L"}'::jsonb,
    'Z-Klean - Nanotechnological Industrial Cleaner | A&T BioNano',
    'Z-Klean, industrial cleaner with nanotechnology. Biodegradable, high power and safe.'
),
(
    'prod-003',
    'es',
    'NanoFert Plus',
    'NanoFert Plus es un fertilizante de nueva generación que utiliza nanotecnología para optimizar la absorción de nutrientes por las plantas. Su sistema de liberación controlada garantiza un suministro constante y eficiente.',
    'Fertilizante nanométrico de liberación controlada',
    '["Nanoencapsulación de nutrientes", "Liberación controlada", "Mayor absorción foliar", "Mejora la salud del suelo", "Compatible con agricultura orgánica"]'::jsonb,
    '["Aumenta rendimiento de cultivos hasta 35%", "Reduce consumo de fertilizantes en 50%", "Mejora calidad de frutos", "Menor impacto ambiental", "Resultados visibles en 7 días"]'::jsonb,
    '{"NPK": "12-10-8 + Micronutrientes", "Tamaño partícula": "20-100 nm", "Solubilidad": "Alta", "Aplicación": "Foliar o radicular", "Dosis": "2-5 ml/L", "Compatibilidad": "pH 5.5-7.5"}'::jsonb,
    'NanoFert Plus - Fertilizante Nanotecnológico | A&T BioNano',
    'NanoFert Plus, fertilizante con nanotecnología de liberación controlada. Aumenta rendimiento hasta 35%.'
),
(
    'prod-003',
    'en',
    'NanoFert Plus',
    'NanoFert Plus is a next-generation fertilizer that uses nanotechnology to optimize nutrient absorption by plants. Its controlled release system ensures a constant and efficient supply.',
    'Controlled-release nanometric fertilizer',
    '["Nutrient nanoencapsulation", "Controlled release", "Enhanced foliar absorption", "Improves soil health", "Compatible with organic farming"]'::jsonb,
    '["Increases crop yield up to 35%", "Reduces fertilizer consumption by 50%", "Improves fruit quality", "Lower environmental impact", "Visible results in 7 days"]'::jsonb,
    '{"NPK": "12-10-8 + Micronutrients", "Particle size": "20-100 nm", "Solubility": "High", "Application": "Foliar or root", "Dosage": "2-5 ml/L", "Compatibility": "pH 5.5-7.5"}'::jsonb,
    'NanoFert Plus - Nanotechnological Fertilizer | A&T BioNano',
    'NanoFert Plus, fertilizer with controlled-release nanotechnology. Increases yield up to 35%.'
),
(
    'prod-004',
    'es',
    'BioShield Spray',
    'BioShield Spray es la solución perfecta para protección inmediata contra microorganismos. Su formato en spray permite aplicación rápida y uniforme en cualquier superficie.',
    'Protección antimicrobiana en aerosol',
    '["Aplicación en aerosol", "Secado rápido", "Sin olor residual", "Efecto antimicrobiano inmediato", "Portátil y práctico"]'::jsonb,
    '["Ideal para uso doméstico y profesional", "Protege superficies de alto contacto", "Fácil aplicación", "No mancha ni deja residuos", "Seguro para toda la familia"]'::jsonb,
    '{"Volumen": "250 ml, 500 ml", "Tiempo de acción": "30 segundos", "Cobertura": "2 m² por segundo", "Durabilidad": "Hasta 24 horas", "Ingrediente activo": "Nanopartículas de plata", "Tipo": "Aerosol no inflamable"}'::jsonb,
    'BioShield Spray - Protección Antimicrobiana Rápida | A&T BioNano',
    'BioShield Spray, protección antimicrobiana instantánea en formato aerosol. Seguro y efectivo.'
),
(
    'prod-004',
    'en',
    'BioShield Spray',
    'BioShield Spray is the perfect solution for immediate protection against microorganisms. Its spray format allows quick and uniform application on any surface.',
    'Antimicrobial protection spray',
    '["Spray application", "Fast drying", "No residual odor", "Immediate antimicrobial effect", "Portable and practical"]'::jsonb,
    '["Ideal for domestic and professional use", "Protects high-touch surfaces", "Easy application", "Does not stain or leave residues", "Safe for the whole family"]'::jsonb,
    '{"Volume": "250 ml, 500 ml", "Action time": "30 seconds", "Coverage": "2 m² per second", "Durability": "Up to 24 hours", "Active ingredient": "Silver nanoparticles", "Type": "Non-flammable aerosol"}'::jsonb,
    'BioShield Spray - Fast Antimicrobial Protection | A&T BioNano',
    'BioShield Spray, instant antimicrobial protection in aerosol format. Safe and effective.'
);

-- Insertar precios por cantidad
INSERT INTO prices_by_quantity (id, product_id, min_quantity, max_quantity, price_per_unit, currency) VALUES
('price-001', 'prod-001', 1, 5, 45000, 'COP'),
('price-002', 'prod-001', 6, 20, 40000, 'COP'),
('price-003', 'prod-001', 21, 50, 35000, 'COP'),
('price-004', 'prod-001', 51, null, 30000, 'COP'),
('price-005', 'prod-002', 1, 10, 35000, 'COP'),
('price-006', 'prod-002', 11, 30, 32000, 'COP'),
('price-007', 'prod-002', 31, null, 28000, 'COP'),
('price-008', 'prod-003', 1, 10, 55000, 'COP'),
('price-009', 'prod-003', 11, 25, 50000, 'COP'),
('price-010', 'prod-003', 26, null, 45000, 'COP'),
('price-011', 'prod-004', 1, 12, 25000, 'COP'),
('price-012', 'prod-004', 13, 50, 22000, 'COP'),
('price-013', 'prod-004', 51, null, 18000, 'COP');

-- Insertar traducciones generales
INSERT INTO translations ("key", category, es, en) VALUES
('nav.home', 'navigation', 'Inicio', 'Home'),
('nav.technology', 'navigation', 'Tecnología', 'Technology'),
('nav.process', 'navigation', 'Proceso', 'Process'),
('nav.store', 'navigation', 'Tienda', 'Store'),
('nav.contact', 'navigation', 'Contacto', 'Contact'),
('ui.search', 'ui', 'Buscar', 'Search'),
('ui.filter', 'ui', 'Filtrar', 'Filter'),
('ui.addToCart', 'ui', 'Agregar al carrito', 'Add to cart'),
('ui.viewDetails', 'ui', 'Ver detalles', 'View details'),
('ui.learnMore', 'ui', 'Conocer más', 'Learn more'),
('msg.success', 'messages', '¡Operación exitosa!', 'Operation successful!'),
('msg.error', 'messages', 'Ha ocurrido un error', 'An error occurred'),
('form.name', 'forms', 'Nombre', 'Name'),
('form.email', 'forms', 'Correo electrónico', 'Email'),
('form.password', 'forms', 'Contraseña', 'Password'),
('form.submit', 'forms', 'Enviar', 'Submit');

-- Insertar páginas predeterminadas
INSERT INTO pages (id, slug, type, status) VALUES
('page-home', 'home', 'system', 'published'),
('page-technology', 'technology', 'system', 'published'),
('page-process', 'process', 'system', 'published');

-- Insertar contenido de páginas
INSERT INTO page_contents (page_id, language, sections) VALUES
(
    'page-home',
    'es',
    '[{"id": "sec-hero", "type": "hero", "order": 1, "visible": true, "content": {"title": "Innovación en Bionanotecnología", "subtitle": "Desarrollamos soluciones antimicrobianas y fungicidas sostenibles", "ctaText": "Conocer más", "ctaLink": "#purpose", "backgroundImage": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1920"}}, {"id": "sec-purpose", "type": "features", "order": 3, "visible": true, "content": {"title": "Nuestro Propósito", "items": [{"icon": "Users", "title": "Innovación", "description": "Desarrollamos tecnología de punta"}, {"icon": "Target", "title": "Sostenibilidad", "description": "Comprometidos con el medio ambiente"}, {"icon": "Lightbulb", "title": "Excelencia", "description": "Calidad en cada producto"}]}}]'::jsonb
),
(
    'page-home',
    'en',
    '[{"id": "sec-hero", "type": "hero", "order": 1, "visible": true, "content": {"title": "Innovation in Bionanotechnology", "subtitle": "We develop sustainable antimicrobial and fungicidal solutions", "ctaText": "Learn more", "ctaLink": "#purpose", "backgroundImage": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1920"}}, {"id": "sec-purpose", "type": "features", "order": 3, "visible": true, "content": {"title": "Our Purpose", "items": [{"icon": "Users", "title": "Innovation", "description": "We develop cutting-edge technology"}, {"icon": "Target", "title": "Sustainability", "description": "Committed to the environment"}, {"icon": "Lightbulb", "title": "Excellence", "description": "Quality in every product"}]}}]'::jsonb
);

-- Tabla de Miembros del Ecosistema
CREATE TABLE IF NOT EXISTS ecosystem_members (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'draft')),
    image TEXT NOT NULL,
    sector TEXT NOT NULL,
    social_media JSONB NOT NULL DEFAULT '{}'::jsonb,
    youtube_videos JSONB NOT NULL DEFAULT '[]'::jsonb,
    short_videos JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Traducciones de Miembros del Ecosistema
CREATE TABLE IF NOT EXISTS ecosystem_member_translations (
    member_id TEXT NOT NULL REFERENCES ecosystem_members(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('es', 'en')),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (member_id, language)
);

-- Insertar usuario administrador predeterminado
INSERT INTO users (id, email, password, name, role) VALUES
('user-001', 'admin@atbionano.com', 'admin123', 'Administrador', 'admin');
