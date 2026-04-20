-- ============================================================
-- BIBLIOTECA MAESTRA BIONANO A&T - COLECCIÓN COMPLETA (11 POSTS)
-- ESTADO: PUBLICADOS | IDIOMAS: ES/EN | SINTAXIS: MYSQL 8.0+
-- ============================================================

SET NAMES utf8mb4;

-- 1. LIMPIEZA PREVIA (Opcional, para asegurar IDs limpios si lo deseas)
-- DELETE FROM blog_post_translations WHERE post_id LIKE 'blog-0%';
-- DELETE FROM blog_posts WHERE id LIKE 'blog-0%';

-- 2. INSERCIÓN DE POSTS (Cabeceras)
INSERT INTO blog_posts (id, slug, status, author, cover_image, type, category_name, created_at) VALUES
('blog-001', 'crisis-pesticidas-manzanas-europa-guia-residuo-cero', 'published', 'Ana Elisa Casas Botero', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb?q=80&w=2000', 'article', 'Industria y Salud', '2026-04-18 10:00:00'),
('blog-002', 'zbnx-guia-tecnica-definitiva-bioseguridad-nano', 'published', 'Ing. Carlos Mendoza', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000', 'article', 'Industria y Salud', '2026-04-03 11:30:00'),
('blog-003', 'seguridad-alimentaria-inocuidad-control-recontaminacion-industrial', 'published', 'Ana Elisa Casas Botero', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2000', 'news', 'Industria y Salud', '2026-04-05 09:15:00'),
('blog-004', 'ciencia-nanoparticulas-zinc-mecanismo-lisis-mecanica', 'published', 'Dr. Roberto Gomez', 'https://images.unsplash.com/photo-1532187863486-abf9d3445163?q=80&w=2000', 'article', 'Tecnología Nano', '2026-04-07 14:00:00'),
('blog-005', 'estrategia-exportacion-union-europea-residuo-cero-globalgap', 'published', 'Consultoría de Calidad BioNano', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000', 'article', 'Sostenibilidad', '2026-04-09 16:45:00'),
('blog-006', 'bioseguridad-hospitalaria-prevencion-infecciones-nosocomiales-nanotecnologia', 'published', 'Dr. Roberto Gomez', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000', 'article', 'Industria y Salud', '2026-04-11 08:00:00'),
('blog-007', 'sostenibilidad-hidrica-ahorro-agua-limpieza-industrial-nanotecnologia', 'published', 'Ing. de Sostenibilidad BioNano', 'https://images.unsplash.com/photo-1581093196277-9f608009874e?q=80&w=2000', 'news', 'Sostenibilidad', '2026-04-13 12:00:00'),
('blog-008', 'efecto-residual-nanotecnologia-bioseguridad-persistente-industrial', 'published', 'Ing. Carlos Mendoza', 'https://images.unsplash.com/photo-1504198453319-5ce911baf2ef?q=80&w=2000', 'article', 'Industria y Salud', '2026-04-15 10:30:00'),
('blog-009', 'historia-innovacion-bionano-patentes-nanotecnologia-colombia', 'published', 'Ana Elisa Casas Botero', 'https://images.unsplash.com/photo-1590233465376-403c99f43fc1?q=80&w=2000', 'article', 'Tecnología Nano', '2026-04-17 15:00:00'),
('blog-010', 'packaging-activo-nanotecnologia-conservacion-alimentos-shelf-life', 'published', 'Dpto. I+D BioNano', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000', 'article', 'Tecnología Nano', '2026-04-19 11:00:00'),
('blog-011', 'guia-maestra-nanotecnologia-agricola-residuo-cero-futuro-campo', 'published', 'Dpto. Científico BioNano', 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=2000', 'article', 'Tecnología Nano', '2026-04-01 10:00:00')
AS new_post
ON DUPLICATE KEY UPDATE 
    status = new_post.status, type = new_post.type, category_name = new_post.category_name;

-- 3. TRADUCCIONES (Aquí se incluye el contenido masivo generado en las respuestas anteriores)
-- Nota: Para ahorrar espacio aquí, asumo que ya tienes los SQL de traducciones. 
-- Si necesitas que los pegue todos aquí me dices, pero por ahora asegúrate de importar 
-- los archivos individuales del 1 al 11 que te pasé.
