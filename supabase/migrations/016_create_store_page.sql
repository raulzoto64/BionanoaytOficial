-- ==========================================
-- MIGRACIÓN: Contenido inicial de la página Tienda
-- ==========================================

-- Insertar o actualizar la página de tienda
INSERT INTO pages (id, slug, type, status) VALUES
('page-store', 'page-store', 'system', 'published')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  type = EXCLUDED.type,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Insertar o actualizar contenido en español para la tienda
INSERT INTO page_contents (page_id, language, sections) VALUES
('page-store', 'es', '[
  {
    "id": "store-hero",
    "type": "hero",
    "order": 1,
    "visible": true,
    "content": {
      "badge": "Tienda Bionano AYT",
      "title": "¡Compra Ahora!",
      "subtitle": "Soluciones biotecnológicas de alta calidad para tus cultivos. Productos certificados y envío garantizado.",
      "backgroundImage": "/images/store-hero.jpg",
      "ctaText": "Ver Productos",
      "secondaryCtaText": "Contáctanos",
      "seo": {
        "metaTitle": "Tienda Bionano AYT - Compra Productos Biotecnológicos",
        "metaDescription": "Compra ahora productos biotecnológicos para agricultura. Fertilizantes orgánicos, soluciones especializadas y equipos agrícolas. Envío rápido y garantizado.",
        "metaKeywords": "comprar agricultura, productos biotecnológicos, fertilizantes orgánicos, tienda online, bionano ayt"
      }
    }
  },
  {
    "id": "store-filter",
    "type": "filter",
    "order": 2,
    "visible": true,
    "content": {}
  },
  {
    "id": "store-products",
    "type": "products",
    "order": 3,
    "visible": true,
    "content": {}
  }
]'::jsonb)
ON CONFLICT (page_id, language) DO UPDATE SET
  sections = EXCLUDED.sections;

-- Insertar o actualizar contenido en inglés para la tienda
INSERT INTO page_contents (page_id, language, sections) VALUES
('page-store', 'en', '[
  {
    "id": "store-hero",
    "type": "hero",
    "order": 1,
    "visible": true,
    "content": {
      "badge": "Bionano AYT Store",
      "title": "Shop Now!",
      "subtitle": "High-quality biotechnological solutions for your crops. Certified products and guaranteed shipping.",
      "backgroundImage": "/images/store-hero.jpg",
      "ctaText": "View Products",
      "secondaryCtaText": "Contact Us",
      "seo": {
        "metaTitle": "Bionano AYT Store - Buy Biotechnological Products",
        "metaDescription": "Shop now for biotechnological agricultural products. Organic fertilizers, specialized solutions and agricultural equipment. Fast and guaranteed shipping.",
        "metaKeywords": "buy agriculture, biotechnological products, organic fertilizers, online store, bionano ayt"
      }
    }
  },
  {
    "id": "store-filter",
    "type": "filter",
    "order": 2,
    "visible": true,
    "content": {}
  },
  {
    "id": "store-products",
    "type": "products",
    "order": 3,
    "visible": true,
    "content": {}
  }
]'::jsonb)
ON CONFLICT (page_id, language) DO UPDATE SET
  sections = EXCLUDED.sections;