-- ==========================================
-- MIGRACIÓN: CORREGIR SECCIONES DE STORE PARA QUE COINCIDAN EDITOR Y FRONTEND
-- ==========================================

-- Poner TODAS LAS SECCIONES CORRECTAS EN EL ORDEN EXACTO QUE RENDERIZA EL FRONTEND
-- ✅ Ya no hay secciones que no existan
-- ✅ Orden: hero -> flipcards -> category-filter -> products -> trust -> cta

-- CONTENIDO EN ESPAÑOL
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
    "id": "store-flipcards",
    "type": "flipcards",
    "order": 2,
    "visible": true,
    "content": {
      "items": [
        { "icon": "Shield", "title": "Certificado", "description": "Todos los productos estan certificados y aprobados por el SENASA" },
        { "icon": "Truck", "title": "Envio Rapido", "description": "Envios nacionales en menos de 48 horas a todo el país" },
        { "icon": "CheckCircle", "title": "Garantia", "description": "Garantia total de 30 dias en todos nuestros productos" },
        { "icon": "Users", "title": "Asesoría", "description": "Asesoría técnica personalizada por profesionales expertos" },
        { "icon": "Package", "title": "Stock", "description": "Stock permanente disponible para entrega inmediata" },
        { "icon": "Award", "title": "Calidad", "description": "Calidad premium garantizada en cada uno de nuestros productos" }
      ]
    }
  },
  {
    "id": "store-category-filter",
    "type": "category-filter",
    "order": 3,
    "visible": true,
    "content": {}
  },
  {
    "id": "store-products",
    "type": "products",
    "order": 4,
    "visible": true,
    "content": {}
  },
  {
    "id": "store-clientes",
    "type": "clientes",
    "order": 5,
    "visible": true,
    "content": {
      "title": "Nuestros Clientes Confian en Nosotros",
      "subtitle": "Empresas y agricultores de todo el Perú ya usan nuestros productos",
      "selectedMemberIds": ["eco-004", "eco-003", "eco-001", "eco-002"]
    }
  },
  {
    "id": "store-cta",
    "type": "cta",
    "order": 6,
    "visible": true,
    "content": {
      "icon": "ShoppingCart",
      "title": "¿Necesitas Ayuda?",
      "subtitle": "Nuestro equipo de expertos esta listo para asesorarte y ayudarte a elegir el producto ideal para tus necesidades.",
      "ctaText": "Contactar Ahora",
      "secondaryCtaText": "WhatsApp"
    }
  }
]'::jsonb)
ON CONFLICT (page_id, language) DO UPDATE SET
  sections = EXCLUDED.sections;


-- CONTENIDO EN INGLÉS
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
    "id": "store-flipcards",
    "type": "flipcards",
    "order": 2,
    "visible": true,
    "content": {
      "items": [
        { "icon": "Shield", "title": "Certified", "description": "All products are certified and approved by SENASA" },
        { "icon": "Truck", "title": "Fast Shipping", "description": "National shipments in less than 48 hours throughout the country" },
        { "icon": "CheckCircle", "title": "Warranty", "description": "30-day full warranty on all our products" },
        { "icon": "Users", "title": "Advisory", "description": "Personalized technical advice by expert professionals" },
        { "icon": "Package", "title": "Stock", "description": "Permanent stock available for immediate delivery" },
        { "icon": "Award", "title": "Quality", "description": "Guaranteed premium quality in each of our products" }
      ]
    }
  },
  {
    "id": "store-category-filter",
    "type": "category-filter",
    "order": 3,
    "visible": true,
    "content": {}
  },
  {
    "id": "store-products",
    "type": "products",
    "order": 4,
    "visible": true,
    "content": {}
  },
  {
    "id": "store-clientes",
    "type": "clientes",
    "order": 5,
    "visible": true,
    "content": {
      "title": "Our Customers Trust Us",
      "subtitle": "Companies and farmers from all over Peru already use our products",
      "selectedMemberIds": ["eco-004", "eco-003", "eco-001", "eco-002"]
    }
  },
  {
    "id": "store-cta",
    "type": "cta",
    "order": 6,
    "visible": true,
    "content": {
      "icon": "ShoppingCart",
      "title": "Need Help?",
      "subtitle": "Our team of experts is ready to advise you and help you choose the ideal product for your needs.",
      "ctaText": "Contact Now",
      "secondaryCtaText": "WhatsApp"
    }
  }
]'::jsonb)
ON CONFLICT (page_id, language) DO UPDATE SET
  sections = EXCLUDED.sections;
