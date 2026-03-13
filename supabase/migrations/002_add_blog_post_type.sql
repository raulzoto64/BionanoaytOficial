-- ==========================================
-- MIGRACIÓN: Agregar campo 'type' a la tabla blog_posts
-- ==========================================

-- Agregar campo 'type' a la tabla blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'article';

-- Crear índice para mejorar consultas por tipo
CREATE INDEX IF NOT EXISTS idx_blog_posts_type ON blog_posts(type);

-- Actualizar registros existentes para asegurar que tengan un valor válido
UPDATE blog_posts 
SET type = 'article' 
WHERE type NOT IN ('article', 'news');