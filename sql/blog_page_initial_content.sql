-- ================================================================
-- RESTAURACIÓN COMPLETA PÁGINA BLOG
-- Ejecutar directamente en el SQL Editor de Supabase
-- ================================================================

-- Limpiar contenido anterior
DELETE FROM page_contents WHERE page_id = 'page-blog';

-- ================================================================
-- CONTENIDO ESPAÑOL
-- ================================================================
INSERT INTO page_contents (page_id, language, sections)
VALUES (
  'page-blog',
  'es',
  '[
    {
      "id": "blog-hero-section",
      "type": "hero-blog",
      "order": 100,
      "visible": true,
      "content": {
        "badge": "Blog",
        "title": "Actualidad y Ciencia",
        "subtitle": "Explora las últimas innovaciones en bioseguridad, nanotecnología y desarrollo sostenible.",
        "backgroundImage": "https://sb-jzmdfoptxmqywihyhoty.supabase.co/storage/v1/object/public/site_assets/blog-hero-bg.jpg"
      }
    },
    {
      "id": "blog-posts-section",
      "type": "blog-posts",
      "order": 1000,
      "visible": true,
      "content": {}
    }
  ]'
);

-- ================================================================
-- CONTENIDO INGLÉS
-- ================================================================
INSERT INTO page_contents (page_id, language, sections)
VALUES (
  'page-blog',
  'en',
  '[
    {
      "id": "blog-hero-section",
      "type": "hero-blog",
      "order": 100,
      "visible": true,
      "content": {
        "badge": "Blog",
        "title": "News & Science",
        "subtitle": "Explore the latest innovations in biosecurity, nanotechnology, and sustainable development.",
        "backgroundImage": "https://sb-jzmdfoptxmqywihyhoty.supabase.co/storage/v1/object/public/site_assets/blog-hero-bg.jpg"
      }
    },
    {
      "id": "blog-posts-section",
      "type": "blog-posts",
      "order": 1000,
      "visible": true,
      "content": {}
    }
  ]'
);
