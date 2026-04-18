-- SQL para actualizar la tabla de formularios a multi-idioma
-- Ejecutar en el editor SQL de Supabase

DO $$ 
BEGIN
    -- Renombrar columnas existentes si existen
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forms' AND column_name = 'title') THEN
        ALTER TABLE forms RENAME COLUMN title TO title_es;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forms' AND column_name = 'subtitle') THEN
        ALTER TABLE forms RENAME COLUMN subtitle TO subtitle_es;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forms' AND column_name = 'description') THEN
        ALTER TABLE forms RENAME COLUMN description TO description_es;
    END IF;

    -- Agregar nuevas columnas para inglés
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forms' AND column_name = 'title_en') THEN
        ALTER TABLE forms ADD COLUMN title_en TEXT DEFAULT 'Request Information';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forms' AND column_name = 'subtitle_en') THEN
        ALTER TABLE forms ADD COLUMN subtitle_en TEXT DEFAULT 'Please fill out the form below';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forms' AND column_name = 'description_en') THEN
        ALTER TABLE forms ADD COLUMN description_en TEXT;
    END IF;

    -- Actualizar tabla de LEADS para soportar metadatos adicionales
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'metadata') THEN
        ALTER TABLE leads ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    END IF;

END $$;

-- Nota: Los campos (fields) se guardan en formato JSONB dentro de la columna 'fields',
-- por lo que no requieren cambios en el esquema de la tabla, solo en la estructura del objeto JSON.
