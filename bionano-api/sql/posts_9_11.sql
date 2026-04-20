-- BIONANO MEGA-AUTHORITY CONTENT - PARTE 3 DE 3 (ES/EN)
-- Artículos: 009 (History), 010 (Packaging), 011 (Agri Master Guide)

SET NAMES utf8mb4;

INSERT INTO blog_posts (id, slug, status, author, cover_image, type, category_name, created_at) VALUES
('blog-009', 'historia-innovacion-bionano-patentes', 'published', 'Ana Elisa Casas Botero', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000', 'article', 'Tecnología Nano', '2026-04-17 15:00:00'),
('blog-010', 'packaging-activo-inteligente-alimentos', 'published', 'Dpto. I+D BioNano', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000', 'article', 'Tecnología Nano', '2026-04-19 11:00:00'),
('blog-011', 'macro-guia-nanotecnologia-agricola-residuo-cero', 'published', 'Dpto. Científico BioNano', 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=2000', 'article', 'Tecnología Nano', '2026-04-01 10:00:00')
ON DUPLICATE KEY UPDATE status = VALUES(status), author = VALUES(author), cover_image = VALUES(cover_image), category_name = VALUES(category_name);

-- TRADUCCIONES DETALLADAS 009-011
INSERT INTO blog_post_translations (post_id, language, title, excerpt, content, meta_title, meta_description) VALUES
('blog-009', 'es', 'Trayectoria BioNano: Innovación Científica con Patentes Propias', 'Conoce el origen de BioNano y cómo nuestras patentes están transformando la industria mundial.', '[{"id":"1","type":"rich-text","content":{"html":"<h2>Ciencia que trasciende</h2><p>BioNano no solo fabrica productos; crea patentes. Nuestra tecnología es el resultado de años de investigación regional para resolver problemas globales de bioseguridad.</p>"}}]', 'Historia BioNano | BioNano', 'Conoce el respaldo científico y patentes de BioNano A&T.'),
('blog-009', 'en', 'BioNano History: Scientific Innovation with Private Patents', 'Learn about the origin of BioNano and how our patents are transforming the world industry.', '[{"id":"1","type":"rich-text","content":{"html":"<h2>Science that transcends</h2><p>BioNano not only manufactures products; it creates patents. Our technology is the result of years of regional research to solve global biosecurity problems.</p>"}}]', 'BioNano History | BioNano', 'Learn about the scientific background and patents of BioNano A&T.'),

('blog-010', 'es', 'Packaging Activo: El Futuro de la Conservación Alimentaria', 'Cómo extender la vida del producto integrando nanopartículas biocidas en el empaque.', '[{"id":"1","type":"rich-text","content":{"html":"<h2>Empaques que protegen</h2><p>El packaging activo de BioNano previene mohos y deterioros microbiológicos dentro del envase plástico, extendiendo la vida útil del alimento de forma segura.</p>"}}]', 'Packaging Activo Nano | BioNano', 'Revoluciona tus envases con tecnología BioNano.'),
('blog-010', 'en', 'Active Packaging: The Future of Food Conservation', 'How to extend product life by integrating biocidal nanoparticles into the packaging.', '[{"id":"1","type":"rich-text","content":{"html":"<h2>Protective Packaging</h2><p>BioNano active packaging prevents mold and microbiological deterioration within the plastic container, safely extending the food\'s shelf life.</p>"}}]', 'Nano Active Packaging | BioNano', 'Revolutionize your packaging with BioNano technology.'),

('blog-011', 'es', 'Macro-Guía: Nanotecnología para una Agricultura de Residuo Cero', 'El manual estratégico para dominar la lisis mecánica y los beneficios de exportación.', '[{"id":"1","type":"rich-text","content":{"html":"<h2>Guía Maestra</h2><p>Desde el mecanismo de acción de los iones de Zinc hasta el cumplimiento de normativas UE, esta guía es la brújula definitiva para el agricultor tecnificado.</p>"}}]', 'Guía Agrícola Nano | BioNano', 'Domina la agricultura de residuo cero con BioNano.'),
('blog-011', 'en', 'Macro-Guide: Nanotechnology for Zero Residue Agriculture', 'The strategic manual to master mechanical lysis and export benefits.', '[{"id":"1","type":"rich-text","content":{"html":"<h2>Master Guide</h2><p>From the mechanism of action of Zinc ions to compliance with EU regulations, this guide is the definitive compass for the technical farmer.</p>"}}]', 'Nano Agricultural Guide | BioNano', 'Master zero-residue agriculture with BioNano.')
ON DUPLICATE KEY UPDATE title = VALUES(title), excerpt = VALUES(excerpt), content = VALUES(content);
