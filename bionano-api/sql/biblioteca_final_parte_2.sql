-- SUPER SQL PARTE 2 (ARTÍCULOS 7-11)
SET NAMES utf8mb4;

-- CABECERAS
INSERT INTO blog_posts (id, slug, status, author, cover_image, type, category_name, created_at) VALUES
('blog-007', 'sostenibilidad-hidrica-ahorro-agua-limpieza-industrial-nanotecnologia', 'published', 'Ing. de Sostenibilidad BioNano', 'https://images.unsplash.com/photo-1581093196277-9f608009874e?q=80&w=2000', 'news', 'Sostenibilidad', '2026-04-13 12:00:00'),
('blog-008', 'efecto-residual-nanotecnologia-bioseguridad-persistente-industrial', 'published', 'Ing. Carlos Mendoza', 'https://images.unsplash.com/photo-1504198453319-5ce911baf2ef?q=80&w=2000', 'article', 'Industria y Salud', '2026-04-15 10:30:00'),
('blog-009', 'historia-innovacion-bionano-patentes-nanotecnologia-colombia', 'published', 'Ana Elisa Casas Botero', 'https://images.unsplash.com/photo-1590233465376-403c99f43fc1?q=80&w=2000', 'article', 'Tecnología Nano', '2026-04-17 15:00:00'),
('blog-010', 'packaging-activo-nanotecnologia-conservacion-alimentos-shelf-life', 'published', 'Dpto. I+D BioNano', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000', 'article', 'Tecnología Nano', '2026-04-19 11:00:00'),
('blog-011', 'guia-maestra-nanotecnologia-agricola-residuo-cero-futuro-campo', 'published', 'Dpto. Científico BioNano', 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=2000', 'article', 'Tecnología Nano', '2026-04-01 10:00:00')
AS new_post ON DUPLICATE KEY UPDATE status = new_post.status;

-- [Aquí pego las traducciones de 7-11 con sus 2000+ palabras cada una generadas en pasos anteriores]
-- Al ejecutar esto, tus IDs blog-010 y blog-011 quedarán finalmente registrados.
