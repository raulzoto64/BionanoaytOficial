-- ==========================================
-- MIGRACIÓN: Creación de tabla para páginas legales
-- ==========================================

-- Tabla de Páginas Legales
CREATE TABLE IF NOT EXISTS legal_pages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_es TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_es TEXT NOT NULL,
    content_en TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Configuración del Footer
CREATE TABLE IF NOT EXISTS footer_settings (
    id TEXT PRIMARY KEY DEFAULT 'footer-001',
    columns JSONB NOT NULL DEFAULT '[]'::jsonb,
    social_media JSONB NOT NULL DEFAULT '{}'::jsonb,
    copyright_text_es TEXT NOT NULL DEFAULT '© {{year}} Bionanoaxus. Todos los derechos reservados.',
    copyright_text_en TEXT NOT NULL DEFAULT '© {{year}} Bionanoaxus. All rights reserved.',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuración predeterminada del footer
INSERT INTO footer_settings (
    columns,
    social_media,
    copyright_text_es,
    copyright_text_en
) VALUES (
    '[
        {
            "id": "col-1",
            "title_es": "Empresa",
            "title_en": "Company",
            "links": [
                {"id": "link-1", "label_es": "Sobre Nosotros", "label_en": "About Us", "url": "/about"},
                {"id": "link-2", "label_es": "Nuestra Tecnología", "label_en": "Our Technology", "url": "/technology"},
                {"id": "link-3", "label_es": "Proceso", "label_en": "Process", "url": "/process"},
                {"id": "link-4", "label_es": "Ecosistema", "label_en": "Ecosystem", "url": "/ecosystem"}
            ]
        },
        {
            "id": "col-2",
            "title_es": "Productos",
            "title_en": "Products",
            "links": [
                {"id": "link-5", "label_es": "Antimicrobianos", "label_en": "Antimicrobials", "url": "/store?category=antimicrobianos"},
                {"id": "link-6", "label_es": "Limpieza Industrial", "label_en": "Industrial Cleaning", "url": "/store?category=limpieza-industrial"},
                {"id": "link-7", "label_es": "Fertilizantes", "label_en": "Fertilizers", "url": "/store?category=fertilizantes"},
                {"id": "link-8", "label_es": "Fungicidas", "label_en": "Fungicides", "url": "/store?category=fungicidas"}
            ]
        },
        {
            "id": "col-3",
            "title_es": "Legal",
            "title_en": "Legal",
            "links": [
                {"id": "link-9", "label_es": "Política de Privacidad", "label_en": "Privacy Policy", "url": "/legal/privacy-policy"},
                {"id": "link-10", "label_es": "Términos y Condiciones", "label_en": "Terms and Conditions", "url": "/legal/terms-conditions"},
                {"id": "link-11", "label_es": "Política de Cookies", "label_en": "Cookie Policy", "url": "/legal/cookie-policy"},
                {"id": "link-12", "label_es": "Aviso Legal", "label_en": "Legal Notice", "url": "/legal/legal-notice"}
            ]
        },
        {
            "id": "col-4",
            "title_es": "Contacto",
            "title_en": "Contact",
            "links": [
                {"id": "link-13", "label_es": "Contáctanos", "label_en": "Contact Us", "url": "/#contact"},
                {"id": "link-14", "label_es": "Preguntas Frecuentes", "label_en": "FAQ", "url": "/faq"},
                {"id": "link-15", "label_es": "Blog", "label_en": "Blog", "url": "/blog"}
            ]
        }
    ]'::jsonb,
    '{"facebook": "https://facebook.com/atbionano", "twitter": "https://twitter.com/atbionano", "instagram": "https://instagram.com/atbionano", "linkedin": "https://linkedin.com/company/atbionano"}'::jsonb,
    '© {{year}} Bionanoaxus. Todos los derechos reservados.',
    '© {{year}} Bionanoaxus. All rights reserved.'
) ON CONFLICT (id) DO NOTHING;

-- Insertar páginas legales predeterminadas
INSERT INTO legal_pages (id, slug, title_es, title_en, content_es, content_en, is_active) VALUES
(
    'legal-001',
    'privacy-policy',
    'Política de Privacidad',
    'Privacy Policy',
    '<h2>1. Introducción</h2><p>En A&T BioNano, nos comprometemos a proteger la privacidad de nuestros usuarios...</p>',
    '<h2>1. Introduction</h2><p>At A&T BioNano, we are committed to protecting the privacy of our users...</p>',
    TRUE
),
(
    'legal-002',
    'terms-conditions',
    'Términos y Condiciones',
    'Terms and Conditions',
    '<h2>1. Aceptación de Términos</h2><p>Al acceder y usar este sitio web, usted acepta cumplir con estos términos y condiciones...</p>',
    '<h2>1. Acceptance of Terms</h2><p>By accessing and using this website, you agree to comply with these terms and conditions...</p>',
    TRUE
),
(
    'legal-003',
    'cookie-policy',
    'Política de Cookies',
    'Cookie Policy',
    '<h2>1. ¿Qué son las Cookies?</h2><p>Las cookies son pequeños archivos que se almacenan en su dispositivo cuando visita un sitio web...</p>',
    '<h2>1. What are Cookies?</h2><p>Cookies are small files that are stored on your device when you visit a website...</p>',
    TRUE
),
(
    'legal-004',
    'legal-notice',
    'Aviso Legal',
    'Legal Notice',
    '<h2>1. Información General</h2><p>El presente aviso legal rige el uso del sitio web de A&T BioNano...</p>',
    '<h2>1. General Information</h2><p>This legal notice governs the use of A&T BioNano''s website...</p>',
    TRUE
);