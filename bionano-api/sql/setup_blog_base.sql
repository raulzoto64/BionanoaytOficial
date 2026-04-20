-- BIONANO - SCRIPT DE CONFIGURACIÓN BASE (BLOG)
-- Crea categorías, traducciones y prepara la estructura de la tabla

SET NAMES utf8mb4;

-- 1. CREACIÓN DE CATEGORÍAS BASE
INSERT IGNORE INTO blog_categories (id, slug, status, `order`) VALUES 
('cat-tec', 'nanotecnologia-aplicada', 'active', 1),
('cat-ind', 'industria-y-salud', 'active', 2),
('cat-sus', 'sostenibilidad', 'active', 3);

-- 2. TRADUCCIONES DE CATEGORÍAS (ES/EN)
INSERT IGNORE INTO blog_category_translations (category_id, language, name) VALUES 
('cat-tec', 'es', 'Tecnología Nano'),
('cat-tec', 'en', 'Nano Technology'),
('cat-ind', 'es', 'Industria y Salud'),
('cat-ind', 'en', 'Industry & Health'),
('cat-sus', 'es', 'Sostenibilidad'),
('cat-sus', 'en', 'Sustainability');

-- 3. PROCEDIMIENTO SEGURO PARA AÑADIR COLUMNA (Evita el Error #1064)
DROP PROCEDURE IF EXISTS AddBlogColumns;
DELIMITER //
CREATE PROCEDURE AddBlogColumns()
BEGIN
    -- Verificar si existe la columna category_name
    IF NOT EXISTS (
        SELECT * FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'blog_posts' 
        AND COLUMN_NAME = 'category_name'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN category_name VARCHAR(255) AFTER type;
    END IF;

    -- Asegurar que las traducciones soporten textos largos
    ALTER TABLE blog_post_translations MODIFY COLUMN content LONGTEXT;
END //
DELIMITER ;

-- Ejecutar el procedimiento y luego borrarlo
CALL AddBlogColumns();
DROP PROCEDURE IF EXISTS AddBlogColumns;

SELECT 'Configuración base completada con éxito' AS Info;
