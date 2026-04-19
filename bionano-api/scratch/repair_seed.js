import fs from 'fs';
const path = 'sql/seed.sql';
let content = fs.readFileSync(path, 'utf8');

// Identificar el bloque central corrupto
const startKey = "('tr-048', 'admin.content',          'ui',         'Contenido',           'Content'),";
const endKey = "INSERT IGNORE INTO page_contents";

const startIndex = content.indexOf(startKey) + startKey.length;
const endIndex = content.indexOf(endKey);

if (startIndex > startKey.length && endIndex > startIndex) {
    const newMiddle = `
('tr-049', 'admin.categories',       'ui',         'Categorías',          'Categories'),
('tr-050', 'admin.settings',         'ui',         'Configuración',       'Settings');

-- ─────────────────────────────────────────────────────────────
-- 4. CATEGORIES
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO categories (id, slug, parent_id, icon, \`order\`, status) VALUES
('cat-agro',   'agroindustrial', NULL, '🌾', 1, 'active'),
('cat-post',   'postcosecha',    NULL, '📦', 2, 'active'),
('cat-ind',    'industrial',     NULL, '🏭', 3, 'active'),
('cat-flores', 'flores',         NULL, '🌸', 4, 'active');

INSERT IGNORE INTO category_translations (category_id, language, name, description) VALUES
('cat-agro',   'es', 'Agroindustrial',  'Soluciones para cultivos de banano, plátano, cítricos y aguacate'),
('cat-agro',   'en', 'Agroindustrial',  'Solutions for banana, plantain, citrus and avocado crops'),
('cat-post',   'es', 'Postcosecha',     'Protección durante almacenamiento y transporte de frutas'),
('cat-post',   'en', 'Post-harvest',    'Protection during storage and transport of fruits'),
('cat-ind',    'es', 'Industrial',       'Aditivos para pinturas, construcción y empaques'),
('cat-ind',    'en', 'Industrial',       'Additives for paints, construction and packaging'),
('cat-flores', 'es', 'Flores',           'Control de Botrytis y optimización de hidratación'),
('cat-flores', 'en', 'Flowers',          'Botrytis control and hydration optimization');

-- ─────────────────────────────────────────────────────────────
-- 5. PRODUCTS
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO products (id, slug, category, status, image, images, featured) VALUES 
('prod-bnx-001',   'bionanoaxus', 'cat-post',   'active', '/images/bionanoaxus.jpg', '[]', TRUE),
('prod-zflower-01', 'z-flower',     'cat-flores', 'active', 'https://images.unsplash.com/photo-1591954840040-755c91645397?auto=format&fit=crop&q=80&w=800', '[]', FALSE),
('prod-zklean-01',  'z-klean',      'cat-ind',    'active', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', '[]', FALSE),
('prod-zbnx-01',    'z-bnx',        'cat-ind',    'active', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800', '[]', FALSE);

-- ─────────────────────────────────────────────────────────────
-- 6. PRODUCT TRANSLATIONS
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO product_translations (product_id, language, name, description, short_description, features, benefits, technical_specs, meta_title, meta_description) VALUES
-- BIONANOAXUS
('prod-bnx-001', 'es',
  'BIONANOAXUS®',
  'Bionanoaxus es un aditivo inhibidor de hongos y bacterias fitopatógenas que causan degradación en frutas y verduras otorgando un efecto protector a superficies dónde es aplicado. Su tecnología nano patentada permite obtener resultados con concentraciones menores de aplicación sin generar residualidad química.',
  'Biocida de ruta verde con 99.9% de eficiencia en la remoción de hongos y bacterias, sin residuos químicos.',
  '["Inhibidor Fungicida/Bactericida","Eficacia probada en Bacillus subtilis, E. coli, Botrytis, Fusarium","99.9% de eficiencia de remoción microbiana","Residuo cero: cumple normas LMR EU, Asia y USA","Ideal para postcosecha y tránsitos prolongados"]',
  '["Acceso a mercados premium","Preserva firmeza y turgencia","Producto de fácil manejo","No corrosivo y sin olores agresivos"]',
  '{"Tipo":"Inhibidor Fungicida/Bactericida","Ingrediente Activo":"Nanopartículas metálicas (< 10ppm)","pH":"7.0","Densidad":"0.997 g/mL","Dosis":"1%-5%"}',
  'BIONANOAXUS® | Biocida de Ruta Verde - A&T BioNano',
  'Biocida fungicida-bactericida con 99.9% de eficiencia. Sin residuos químicos. Ideal para exportación agroindustrial.'
),
('prod-bnx-001', 'en',
  'BIONANOAXUS®',
  'Bionanoaxus is an inhibitor additive for phytopathogenic fungi and bacteria that cause degradation in fruits and vegetables, providing a protective effect to surfaces where it is applied. Its patented nano technology allows for results with lower application concentrations without generating chemical residue.',
  'Green route biocide with 99.9% efficiency in removing fungi and bacteria, without chemical residues.',
  '["Fungicide/Bactericide Inhibitor","Tested efficiency on Bacillus subtilis, E. coli, Botrytis, Fusarium","99.9% microbial removal efficiency","Zero residue: complies with EU, Asia and USA MRL standards","Ideal for post-harvest and long transits"]',
  '["Access to premium markets","Preserves firmness and turgidity","Easy to handle product","Non-corrosive and no aggressive odors"]',
  '{"Type":"Fungicide/Bactericide Inhibitor","Active Ingredient":"Metallic nanoparticles","Composition":"Nanopartículas < 10ppm, surfactants (1%)","pH":"7.0","Density":"0.997 g/mL","Dosage":"1%-5%"}',
  'BIONANOAXUS® | Green Route Biocide - A&T BioNano',
  'Fungicide-bactericide biocide with 99.9% efficiency. No chemical residues. Ideal for agro-industrial export.'
),

-- Z-FLOWER
('prod-zflower-01', 'es',
  'Z-Flower',
  'Z-Flower es un hidratante líquido de base biotecnológica desarrollado para conservar la frescura de las flores cortadas recién cosechadas y para rehidratarlas. Su composición permite una acción profunda en los tallos, mejorando la absorción de agua y prolongando la vida comercial.',
  'Hidratante biotecnológico que prolonga la vida útil y frescura de flores cortadas.',
  '["Acción antibacterial profunda en tallos","Limpia y desobstruye conductos internos","Eficacia probada en Pseudomonas, Botrytis, Fusarium","Dosis: 2 mL por 1 litro de agua","Vida útil: 2 años"]',
  '["Prolonga vida útil de flores cortadas","Reduce podredumbre de tallos","Disminuye malos olores del agua","Alternativa sustentable y segura"]',
  '{"Tipo":"Antibacterial / Hidratante","Activo":"Dispersión coloidal de Zinc","pH":"6.8","Densidad":"0.998 g/cm³","Solubilidad":"100% miscible","Dosis":"2 mL/L"}',
  'Z-Flower | Hidratante Biotecnológico para Flores - A&T BioNano',
  'Conserva la frescura y vitalidad de tus flores por más tiempo con Z-Flower. Tecnología de zinc residuo cero.'
),
('prod-zflower-01', 'en',
  'Z-Flower',
  'Z-Flower is a biotechnology-based liquid moisturizer developed to preserve the freshness of freshly harvested cut flowers and to rehydrate them. Its composition allows for deep action in the stems, improving water absorption and extending commercial life.',
  'Biotechnology moisturizer that extends the shelf life and freshness of cut flowers.',
  '["Deep antibacterial action in stems","Cleans and unclogs internal ducts","Proven efficiency on Pseudomonas, Botrytis, Fusarium","Dosage: 2 mL per 1 liter of water","Shelf life: 2 years"]',
  '["Extends cut flowers shelf life","Reduces stem rot","Decreases water bad odors","Sustainable and safe alternative"]',
  '{"Type":"Antibacterial / Moisturizer","Active":"Zinc colloidal dispersion","pH":"6.8","Density":"0.998 g/cm³","Dosage":"2 mL/L"}',
  'Z-Flower | Biotechnology Flower Moisturizer - A&T BioNano',
  'Keep your flowers fresh and vibrant for longer with Z-Flower. Zero-residue zinc technology.'
),

-- Z-KLEAN
('prod-zklean-01', 'es',
  'Z-Klean',
  'Z-Klean es un biocida natural diseñado para inhibir hongos y bacterias sobre superficies, utensilios y equipos ayudando a prevenir la contaminación y promoviendo una higiene segura. Su tecnología patentada permite una desinfección eficaz con bajas dosis.',
  'Biocida natural para desinfección de superficies y equipos. Registro INVIMA.',
  '["Registro INVIMA NSOH03763-25CO","No requiere dilución","Uso en industrias farmacéuticas, alimentos y hospitalario","Eficacia en S. aureus, E. coli, Botrytis","No corrosivo ni irritante"]',
  '["Eficacia prolongada en textiles y superficies","No genera resistencia bacteriana","Compatible con la piel","Efecto antiinflamatorio y regenerativo"]',
  '{"Tipo":"Antibacterial / Desinfectante","Activo":"Dispersión coloidal de Zinc (< 5ppm)","pH":"6.8","Densidad":"0.997 g/mL","Registro":"INVIMA NSOH03763-25CO"}',
  'Z-Klean | Desinfectante Natural Biotecnológico - A&T BioNano',
  'Higiene segura y natural para superficies y equipos con Z-Klean. Registro INVIMA y tecnología residuo cero.'
),
('prod-zklean-01', 'en',
  'Z-Klean',
  'Z-Klean is a natural biocide designed to inhibit fungi and bacteria on surfaces, utensils and equipment helping to prevent contamination and promoting safe hygiene. Its patented technology allows for effective disinfection with low dosages.',
  'Natural biocide for surface and equipment disinfection. INVIMA registration.',
  '["INVIMA Reg. NSOH03763-25CO","No dilution required","Use in pharmaceutical, food and hospital industries","Effective on S. aureus, E. coli, Botrytis","Non-corrosive and non-irritating"]',
  '["Long-lasting efficacy on textiles and surfaces","No bacterial resistance","Skin compatible","Anti-inflammatory and regenerative effect"]',
  '{"Type":"Antibacterial / Disinfectant","Active":"Zinc colloidal dispersion (< 5ppm)","pH":"6.8","Density":"0.997 g/mL","Registry":"INVIMA NSOH03763-25CO"}',
  'Z-Klean | Natural Biotechnology Disinfectant - A&T BioNano',
  'Safe and natural hygiene for surfaces and equipment with Z-Klean. INVIMA registered and zero-residue technology.'
),

-- Z-BNX
('prod-zbnx-01', 'es',
  'Z-BNX',
  'Z-BNX es fungicida bactericida de alto espectro para el control de hongos y bacterias otorgando un efecto protector a superficies dónde es aplicado. Su tecnología nano patentada permite obtener resultados rápidos y prolongados sin generar residualidad química.',
  'Fungicida y bactericida de alto espectro para superficies industriales.',
  '["Partículas minerales (220 ppm)","Eficacia en Gram positivas y Gram negativas","Bloquea la respiración y nutrición del patógeno","Dosis recomentada: 1-5%","Vida útil: 2 años"]',
  '["Resultados rápidos y prolongados","Libre de químicos nocivos","Alternativa sustentable","Segura para el operario y ambiente"]',
  '{"Tipo":"Antibacterial / Antifúngico","Activo":"Dispersión coloidal de Zinc (220 ppm)","pH":"6.3","Densidad":"1.02","Conductividad":"0.245 µS/cm"}',
  'Z-BNX | Biocida Industrial de Alto Espectro - A&T BioNano',
  'Control total de patógenos industriales con Z-BNX. Alta eficacia y tecnología nano patentada.'
),
('prod-zbnx-01', 'en',
  'Z-BNX',
  'Z-BNX is a high-spectrum fungicide bactericide for the control of fungi and bacteria, providing a protective effect to surfaces where it is applied. Its patented nano technology allows for fast and prolonged results without generating chemical residues.',
  'High-spectrum fungicide and bactericide for industrial surfaces.',
  '["Mineral particles (220 ppm)","Effective on Gram positive and Gram negative","Blocks pathogen respiration and nutrition","Recommended dosage: 1-5%","Shelf life: 2 years"]',
  '["Fast and prolonged results","Free from harmful chemicals","Sustainable alternative","Safe for operator and environment"]',
  '{"Type":"Antibacterial / Antifungal","Active":"Zinc colloidal dispersion (220 ppm)","pH":"6.3","Density":"1.02","Conductivity":"0.245 µS/cm"}',
  'Z-BNX | High Spectrum Industrial Biocide - A&T BioNano',
  'Total industrial pathogen control with Z-BNX. High efficacy and patented nano technology.'
);

-- ─────────────────────────────────────────────────────────────
-- 7. PRICES BY QUANTITY
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO prices_by_quantity (id, product_id, min_quantity, max_quantity, price_per_unit, currency, packaging) VALUES
('price-bnx-1', 'prod-bnx-001', 1,  9,    100000.00, 'COP', 'Litro'),
('price-bnx-2', 'prod-bnx-001', 10, 49,    90000.00, 'COP', 'Litro'),
('price-bnx-3', 'prod-bnx-001', 50, NULL,  80000.00, 'COP', 'Litro'),
('price-zfl-1', 'prod-zflower-01', 1,  9,    80000.00, 'COP', 'Litro'),
('price-zfl-2', 'prod-zflower-01', 10, 49,   70000.00, 'COP', 'Litro'),
('price-zfl-3', 'prod-zflower-01', 50, NULL,  60000.00, 'COP', 'Litro'),
('price-zkl-1', 'prod-zklean-01', 1,  9,    60000.00, 'COP', 'Litro'),
('price-zkl-2', 'prod-zklean-01', 10, 49,   55000.00, 'COP', 'Litro'),
('price-zkl-3', 'prod-zklean-01', 50, NULL,  45000.00, 'COP', 'Litro'),
('price-zbx-1', 'prod-zbnx-01',   1,  9,    120000.00, 'COP', 'Litro'),
('price-zbx-2', 'prod-zbnx-01',   10, 49,   110000.00, 'COP', 'Litro'),
('price-zbx-3', 'prod-zbnx-01',   50, NULL,  95000.00, 'COP', 'Litro');

-- ─────────────────────────────────────────────────────────────
-- 8. PAGES: Definición de páginas
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO pages (id, slug, type, status) VALUES
('page-home',       'page-home',       'system', 'published'),
('page-about',      'page-about',      'system', 'published'),
('page-ecosystem',  'page-ecosystem',  'system', 'published'),
('page-technology', 'page-technology', 'system', 'published'),
('page-store',      'page-store',      'system', 'published'),
('page-blog',       'page-blog',       'system', 'published');

`;
    const finalContent = content.substring(0, startIndex) + newMiddle + content.substring(endIndex);
    fs.writeFileSync(path, finalContent, 'utf8');
    console.log("Seed.sql reparado y actualizado con nuevos productos!");
} else {
    console.error("No se encontraron las marcas de inicio/fin en el archivo.");
    console.log("startIndex:", startIndex);
    console.log("endIndex:", endIndex);
}
