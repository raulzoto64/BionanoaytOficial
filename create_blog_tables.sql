-- ==========================================
-- Tabla para artículos de blog
-- ==========================================
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  author TEXT NOT NULL,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- Tabla para traducciones de artículos de blog
-- ==========================================
CREATE TABLE blog_post_translations (
  post_id TEXT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('es', 'en')),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  PRIMARY KEY (post_id, language)
);

-- ==========================================
-- Tabla para categorías de blog
-- ==========================================
CREATE TABLE blog_categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- Tabla para traducciones de categorías de blog
-- ==========================================
CREATE TABLE blog_category_translations (
  category_id TEXT NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('es', 'en')),
  name TEXT NOT NULL,
  description TEXT,
  PRIMARY KEY (category_id, language)
);

-- ==========================================
-- Tabla de relación entre posts y categorías (N:N)
-- ==========================================
CREATE TABLE blog_post_categories (
  post_id TEXT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- ==========================================
-- Índices para optimizar consultas
-- ==========================================
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX idx_blog_post_categories_post ON blog_post_categories(post_id);
CREATE INDEX idx_blog_post_categories_category ON blog_post_categories(category_id);
CREATE INDEX idx_blog_categories_status ON blog_categories(status);

-- ==========================================
-- Función para actualizar updated_at automáticamente
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- Triggers para las tablas
-- ==========================================
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Inserción de datos iniciales (ejemplo)
-- ==========================================
INSERT INTO blog_categories (slug, order, status) VALUES 
  ('tecnologia', 1, 'active'),
  ('sostenibilidad', 2, 'active'),
  ('innovacion', 3, 'active');

INSERT INTO blog_category_translations (category_id, language, name, description) 
SELECT id, 'es', 
  CASE slug 
    WHEN 'tecnologia' THEN 'Tecnología'
    WHEN 'sostenibilidad' THEN 'Sostenibilidad'
    WHEN 'innovacion' THEN 'Innovación'
  END,
  CASE slug
    WHEN 'tecnologia' THEN 'Artículos sobre tecnologías de bioseguridad y nanotecnología'
    WHEN 'sostenibilidad' THEN 'Contenido sobre prácticas sostenibles en la industria'
    WHEN 'innovacion' THEN 'Noticias y análisis sobre innovaciones en bioseguridad'
  END
FROM blog_categories;

INSERT INTO blog_category_translations (category_id, language, name, description) 
SELECT id, 'en', 
  CASE slug 
    WHEN 'tecnologia' THEN 'Technology'
    WHEN 'sostenibilidad' THEN 'Sustainability'
    WHEN 'innovacion' THEN 'Innovation'
  END,
  CASE slug
    WHEN 'tecnologia' THEN 'Articles about biosecurity and nanotechnology'
    WHEN 'sostenibilidad' THEN 'Content about sustainable practices in industry'
    WHEN 'innovacion' THEN 'News and analysis about biosecurity innovations'
  END
FROM blog_categories;