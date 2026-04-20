-- BIONANO CONTENT FACTORY - PARTE 1 DE 3 (ES/EN)
-- Artículos: 001 (Apple), 002 (Z-BNX), 003 (Food Safety), 004 (Zinc Science)

SET NAMES utf8mb4;

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category_name VARCHAR(255) AFTER type;
ALTER TABLE blog_post_translations MODIFY COLUMN content LONGTEXT;

INSERT INTO blog_posts (id, slug, status, author, cover_image, type, category_name, created_at) VALUES
('blog-001', 'residuos-pesticidas-manzanas', 'published', 'Ana Elisa Casas Botero', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bccb?q=80&w=2000', 'article', 'Industria y Salud', '2026-04-18 10:00:00'),
('blog-002', 'zbnx-guia-maestra-desinfeccion', 'published', 'Ing. Carlos Mendoza', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000', 'article', 'Industria y Salud', '2026-04-03 11:30:00'),
('blog-003', 'seguridad-alimentaria-integral', 'published', 'Dpto. Científico BioNano', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2000', 'article', 'Industria y Salud', '2026-04-05 09:15:00'),
('blog-004', 'nanoparticulas-zinc-ciencia', 'published', 'Dr. Roberto Gomez', 'https://images.unsplash.com/photo-1532187863486-abf9d3445163?q=80&w=2000', 'article', 'Tecnología Nano', '2026-04-07 14:00:00')
ON DUPLICATE KEY UPDATE status = VALUES(status), author = VALUES(author), cover_image = VALUES(cover_image);

-- TRADUCCIONES ARTÍCULO 001 (ES/EN)
INSERT INTO blog_post_translations (post_id, language, title, excerpt, content, meta_title, meta_description) VALUES
('blog-001', 'es', 
 'Crisis de Pesticidas en Manzanas: Una Alerta para el Sector Exportador', 
 'Analizamos por qué el 85% de las manzanas europeas no cumplen los nuevos estándares y cómo BioNano ofrece la salida tecnológica.', 
 '[{"id":"1","type":"rich-text","content":{"html":"<h2>El Escándalo de los Plaguicidas en Europa</h2><p>El reciente informe de <strong>Pesticide Action Network Europe</strong> ha revelado una realidad incómoda: la gran mayoría de las manzanas consumidas en la UE contienen un cóctel de pesticidas nocivos. Para los productores que exportan a este mercado, la noticia es una sentencia de muerte comercial si no se adoptan medidas inmediatas.</p><h3>¿Qué es el efecto cóctel?</h3><p>Google y los reguladores están priorizando el análisis de mezclas químicas. Ya no basta con cumplir un límite por sustancia; ahora se evalúa la toxicidad combinada. BioNano A&T resuelve esto eliminando la necesidad de fungicidas sistémicos tóxicos.</p>"}}]', 
 'Pesticidas en Manzanas | BioNano A&T', 
 'Análisis científico sobre plaguicidas en frutas y soluciones de residuo cero.'),
('blog-001', 'en', 
 'Pesticide Crisis in Apples: A Warning for the Export Sector', 
 'Analyze why 85% of European apples fail new standards and how BioNano offers the technological solution.', 
 '[{"id":"1","type":"rich-text","content":{"html":"<h2>The Pesticide Scandal in Europe</h2><p>The recent report from <strong>Pesticide Action Network Europe</strong> has revealed an uncomfortable reality: the vast majority of apples consumed in the EU contain a cocktail of harmful pesticides. For producers exporting to this market, this news is a commercial death sentence if immediate measures are not taken.</p><h3>What is the cocktail effect?</h3><p>Google and regulators are prioritizing the analysis of chemical mixtures. It is no longer enough to meet a limit per substance; combined toxicity is now evaluated. BioNano A&T resolves this by eliminating the need for toxic systemic fungicides.</p>"}}]', 
 'Apple Pesticide Crisis | BioNano A&T', 
 'Scientific analysis of pesticides in fruits and zero-residue solutions.'),

-- TRADUCCIONES ARTÍCULO 002 (ES/EN)
('blog-002', 'es', 
 'Z-BNX: La Revolución de la Sanidad Industrial con Efecto Residual', 
 'Z-BNX no es un químico volátil. Es una matriz nano-patentada que ofrece bioseguridad permanente en superficies industriales.', 
 '[{"id":"1","type":"rich-text","content":{"html":"<h2>Z-BNX: Más allá de la limpieza convencional</h2><p>El cloro y el alcohol son soluciones del siglo XX. Z-BNX utiliza nanociencia de Zinc para perforar la membrana de bacterias y hongos de forma física, no química.</p><h3>Tabla de Ventajas</h3><p>Efecto residual de días, pH neutro y nula corrosión en equipos de acero inoxidable.</p>"}}]', 
 'Z-BNX Sanidad Industrial | BioNano A&T', 
 'Descubre el poder de Z-BNX, el desinfectante nano de BioNano para control total.'),
('blog-002', 'en', 
 'Z-BNX: The Industrial Sanitization Revolution with Residual Effect', 
 'Z-BNX is not a volatile chemical. It is a nano-patented matrix that offers permanent biosecurity on industrial surfaces.', 
 '[{"id":"1","type":"rich-text","content":{"html":"<h2>Z-BNX: Beyond conventional cleaning</h2><p>Chlorine and alcohol are 20th-century solutions. Z-BNX uses Zinc nanoscience to physically, not chemically, pierce the membrane of bacteria and fungi.</p><h3>Advantage Table</h3><p>Residual effect for days, neutral pH, and zero corrosion on stainless steel equipment.</p>"}}]', 
 'Z-BNX Industrial Sanitization | BioNano A&T', 
 'Discover the power of Z-BNX, BioNano\'s nano-disinfectant for total control.'),

-- TRADUCCIONES ARTÍCULO 003 (ES/EN)
('blog-003', 'es', 'Inocuidad Alimentaria Integral: Estrategias contra la Contaminación Cruzada', 'Garantiza la seguridad de tus productos con protocolos de desinfección continua basados en nanotecnología.', '[{"id":"1","type":"rich-text","content":{"html":"<h2>Blindando la Cadena de Suministro</h2><p>La seguridad alimentaria depende de la prevención. BioNano reduce el riesgo de Listeria y Salmonella mediante capas de protección residual activa.</p>"}}]', 'Inocuidad Alimentaria Nano | BioNano', 'Protocolos de bioseguridad avanzada para la industria alimentaria.'),
('blog-003', 'en', 'Integral Food Safety: Strategies against Cross-Contamination', 'Guarantee the safety of your products with continuous disinfection protocols based on nanotechnology.', '[{"id":"1","type":"rich-text","content":{"html":"<h2>Shielding the Supply Chain</h2><p>Food safety depends on prevention. BioNano reduces the risk of Listeria and Salmonella through layers of active residual protection.</p>"}}]', 'Nano Food Safety | BioNano', 'Advanced biosecurity protocols for the food industry.'),

-- TRADUCCIONES ARTÍCULO 004 (ES/EN)
('blog-004', 'es', 'La Ciencia del Zinc Nano: El Futuro de la Sanidad Biotecnológica', 'Entiende cómo las nanopartículas eliminan patógenos por contacto físico, evitando la resistencia antimicrobiana.', '[{"id":"1","type":"rich-text","content":{"html":"<h2>Lisis Mecánica: La muerte por contacto</h2><p>BioNano utiliza física aplicada para destruir bacterias. Al ser un daño físico, los microorganismos no pueden desarrollar inmunidad.</p>"}}]', 'Ciencia Nano BioNano | BioNano', 'Todo sobre el mecanismo de acción de las nanopartículas de Zinc.'),
('blog-004', 'en', 'The Science of Nano Zinc: The Future of Biotech Sanitization', 'Understand how nanoparticles eliminate pathogens through physical contact, avoiding antimicrobial resistance.', '[{"id":"1","type":"rich-text","content":{"html":"<h2>Mechanical Lysis: Death by Contact</h2><p>BioNano uses applied physics to destroy bacteria. Since it is physical damage, microorganisms cannot develop immunity.</p>"}}]', 'BioNano Science | BioNano', 'All about the mechanism of action of Zinc nanoparticles.')
ON DUPLICATE KEY UPDATE title = VALUES(title), excerpt = VALUES(excerpt), content = VALUES(content);
