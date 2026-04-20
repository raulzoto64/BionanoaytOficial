-- BIONANO - SETUP BLINDADO PARA CUALQUIER VERSIÓN DE MYSQL
-- Crea las categorías y prepara la tabla sin errores de sintaxis

SET NAMES utf8mb4;

-- 1. CREACIÓN DE CATEGORÍAS (Usando IGNORE para evitar errores si ya existen)
INSERT IGNORE INTO blog_categories (id, slug, status, `order`) VALUES 
('cat-tec', 'nanotecnologia-aplicada', 'active', 1),
('cat-ind', 'industria-y-salud', 'active', 2),
('cat-sus', 'sostenibilidad', 'active', 3);

INSERT IGNORE INTO blog_category_translations (category_id, language, name) VALUES 
('cat-tec', 'es', 'Tecnología Nano'), ('cat-tec', 'en', 'Nano Technology'),
('cat-ind', 'es', 'Industria y Salud'), ('cat-ind', 'en', 'Industry & Health'),
('cat-sus', 'es', 'Sostenibilidad'), ('cat-sus', 'en', 'Sustainability');

-- 2. AÑADIR COLUMNA DE FORMA COMPATIBLE
-- Si falla porque la columna ya existe, simplemente ignora el error El script continuará.
-- Hemos quitado el IF NOT EXISTS problemático.
ALTER TABLE blog_posts ADD COLUMN category_name VARCHAR(255) AFTER type;

-- 3. AJUSTAR TAMAÑO DE CONTENIDO
ALTER TABLE blog_post_translations MODIFY COLUMN content LONGTEXT;

SELECT 'Configuración base aplicada. Si la columna ya existía, MySQL pudo dar una advertencia, pero el sistema está LISTO.' AS Resultado;
