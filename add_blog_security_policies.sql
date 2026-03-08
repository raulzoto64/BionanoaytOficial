-- ==========================================
-- POLÍTICAS DE SEGURIDAD PARA TABLAS DE BLOG
-- Permiten acceso anónimo para lectura y escritura
-- ==========================================

-- Política para blog_posts
CREATE POLICY "Allow anonymous read access to blog posts"
ON blog_posts
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow anonymous write access to blog posts"
ON blog_posts
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to blog posts"
ON blog_posts
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to blog posts"
ON blog_posts
FOR DELETE
TO public
USING (true);

-- Política para blog_post_translations
CREATE POLICY "Allow anonymous read access to blog post translations"
ON blog_post_translations
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow anonymous write access to blog post translations"
ON blog_post_translations
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to blog post translations"
ON blog_post_translations
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to blog post translations"
ON blog_post_translations
FOR DELETE
TO public
USING (true);

-- Política para blog_categories
CREATE POLICY "Allow anonymous read access to blog categories"
ON blog_categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow anonymous write access to blog categories"
ON blog_categories
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to blog categories"
ON blog_categories
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to blog categories"
ON blog_categories
FOR DELETE
TO public
USING (true);

-- Política para blog_category_translations
CREATE POLICY "Allow anonymous read access to blog category translations"
ON blog_category_translations
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow anonymous write access to blog category translations"
ON blog_category_translations
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to blog category translations"
ON blog_category_translations
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to blog category translations"
ON blog_category_translations
FOR DELETE
TO public
USING (true);

-- Política para blog_post_categories
CREATE POLICY "Allow anonymous read access to blog post categories"
ON blog_post_categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow anonymous write access to blog post categories"
ON blog_post_categories
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to blog post categories"
ON blog_post_categories
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access to blog post categories"
ON blog_post_categories
FOR DELETE
TO public
USING (true);

-- Habilitar RLS (Row Level Security) para las tablas de blog
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;

-- Mostrar las políticas creadas
SELECT 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check 
FROM pg_policies 
WHERE tablename LIKE 'blog%' 
ORDER BY tablename, policyname;