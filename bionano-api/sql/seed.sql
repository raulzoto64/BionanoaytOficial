-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
-- SEED DATA: A&T BioNano - Contenido real completo
-- Ejecutar DESPUES de init.sql en phpMyAdmin
-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

USE tatian32_bionano;

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 1. SITE SETTINGS
-- INSERT IGNORE = si el ID ya existe, no falla
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO site_settings (id, site_name, site_email, site_phone, site_address, social_media, seo, colors) VALUES (
  'site-001',
  'A&T BioNano',
  'aytbionano@gmail.com',
  '+57 (604) 000-0000',
  'Sabaneta, Antioquia, Colombia',
  '{"linkedin":"https://www.linkedin.com/company/aytbionano/about/","facebook":"","instagram":"","twitter":""}',
  '{"metaTitle":"A&T BioNano - Bionanotecnologia para la Industria","metaDescription":"Aditivos bionanotecnologicos de ruta verde con 99.9% de eficiencia antimicrobiana. Soluciones para agro, postcosecha, pinturas y empaques."}',
  '{"primary":"#1C5D15","accent":"#19FF00","secondary":"#629960","background":"#F7F9CE"}'
);

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 2. FOOTER SETTINGS
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO footer_settings (id, columns, contact_info, social_media, copyright_text_es, copyright_text_en) VALUES (
  'footer-001',
  '[{"id":"col-1","title_es":"Empresa","title_en":"Company","links":[{"id":"lnk-1","label_es":"QuiÃ©nes Somos","label_en":"About Us","url":"/about","type":"internal"},{"id":"lnk-2","label_es":"TecnologÃ­a","label_en":"Technology","url":"/technology","type":"internal"},{"id":"lnk-3","label_es":"Blog","label_en":"Blog","url":"/blog","type":"internal"}]},{"id":"col-2","title_es":"Productos","title_en":"Products","links":[{"id":"lnk-4","label_es":"BIONANOAXUSÂ®","label_en":"BIONANOAXUSÂ®","url":"/store/bionanoaxus","type":"internal"},{"id":"lnk-5","label_es":"CatÃ¡logo","label_en":"Catalog","url":"/store","type":"internal"}]},{"id":"col-3","title_es":"Sectores","title_en":"Sectors","links":[{"id":"lnk-6","label_es":"Agroindustrial","label_en":"Agroindustrial","url":"/store","type":"internal"},{"id":"lnk-7","label_es":"Flores","label_en":"Flowers","url":"/store","type":"internal"},{"id":"lnk-8","label_es":"Pinturas y Empaques","label_en":"Paints & Packaging","url":"/store","type":"internal"}]},{"id":"col-4","title_es":"Legal","title_en":"Legal","links":[{"id":"lnk-9","label_es":"Privacidad","label_en":"Privacy","url":"/legal/privacidad","type":"internal"},{"id":"lnk-10","label_es":"TÃ©rminos","label_en":"Terms","url":"/legal/terminos","type":"internal"}]}]',
  '{"phone":"+57 (604) 000-0000","email":"aytbionano@gmail.com","address":"Sabaneta, Antioquia, Colombia"}',
  '{"linkedin":"https://www.linkedin.com/company/aytbionano/about/","facebook":"","instagram":"","twitter":""}',
  'Â© {{year}} A&T BioNano SAS. Todos los derechos reservados.',
  'Â© {{year}} A&T BioNano SAS. All rights reserved.'
);

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 3. TRANSLATIONS (UI keys)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO translations (id, `key`, category, es, en) VALUES
('tr-001', 'nav.about',              'navigation', 'ConÃ³cenos',           'About Us'),
('tr-002', 'nav.technology',         'navigation', 'TecnologÃ­a',          'Technology'),
('tr-003', 'nav.products',           'navigation', 'Productos',           'Products'),
('tr-004', 'nav.store',              'navigation', 'Tienda',              'Store'),
('tr-005', 'nav.blog',               'navigation', 'Blog',                'Blog'),
('tr-006', 'nav.cart',               'navigation', 'Carrito',             'Cart'),
('tr-007', 'nav.login',              'navigation', 'Ingresar',            'Login'),
('tr-008', 'nav.products_catalog',   'navigation', 'CatÃ¡logo de productos','Products Catalog'),
('tr-009', 'btn.learn_more',         'ui',         'Conocer mÃ¡s',         'Learn more'),
('tr-010', 'btn.contact',            'ui',         'Contactar',           'Contact'),
('tr-011', 'btn.buy',                'ui',         'Comprar',             'Buy'),
('tr-012', 'btn.add_to_cart',        'ui',         'Agregar al carrito',  'Add to cart'),
('tr-013', 'btn.quote',              'ui',         'Solicitar cotizaciÃ³n', 'Request quote'),
('tr-014', 'btn.view_details',       'ui',         'Ver detalles',        'View details'),
('tr-015', 'btn.view_details_prices','ui',         'Ver detalles y precios','View details and prices'),
('tr-016', 'btn.view_full_catalog',  'ui',         'Ver CatÃ¡logo Completo','View Full Catalog'),
('tr-017', 'btn.send_message',       'ui',         'Enviar Mensaje',      'Send Message'),
('tr-018', 'footer.contact',         'ui',         'ContÃ¡ctanos',         'Contact Us'),
('tr-019', 'footer.email',           'ui',         'Correo electrÃ³nico',  'Email'),
('tr-020', 'footer.phone',           'ui',         'TelÃ©fono',            'Phone'),
('tr-021', 'footer.address',         'ui',         'DirecciÃ³n',           'Address'),
('tr-022', 'footer.information',     'ui',         'InformaciÃ³n de Contacto','Contact Information'),
('tr-023', 'form.name',              'forms',      'Tu nombre',           'Your name'),
('tr-024', 'form.email',             'forms',      'Tu email',            'Your email'),
('tr-025', 'form.message',           'forms',      'Tu mensaje',          'Your message'),
('tr-026', 'form.submit',            'forms',      'Enviar',              'Submit'),
('tr-027', 'products.title',         'ui',         'Nuestros Productos',  'Our Products'),
('tr-028', 'products.featured',      'ui',         'Producto Estrella',   'Featured Product'),
('tr-029', 'products.category',      'ui',         'CategorÃ­a',           'Category'),
('tr-030', 'products.quantity',      'ui',         'Cantidad',            'Quantity'),
('tr-031', 'products.price',         'ui',         'Precio',              'Price'),
('tr-032', 'products.features',      'ui',         'CaracterÃ­sticas',     'Features'),
('tr-033', 'products.benefits',      'ui',         'Beneficios',          'Benefits'),
('tr-034', 'products.specs',         'ui',         'Especificaciones TÃ©cnicas','Technical Specifications'),
('tr-035', 'products.catalog',       'ui',         'CatÃ¡logo',            'Catalog'),
('tr-036', 'products.most_popular',  'ui',         'MÃ¡s Popular',         'Most Popular'),
('tr-037', 'price.from',             'ui',         'Desde',               'From'),
('tr-038', 'price.volume_pricing',   'ui',         'Precios por volumen', 'Volume pricing'),
('tr-039', 'price.unit',             'ui',         'unidad',              'unit'),
('tr-040', 'price.or_more',          'ui',         'o mÃ¡s',               'or more'),
('tr-041', 'timeline.title',         'ui',         'Nuestra Historia',    'Our Journey'),
('tr-042', 'ecosystem.title',        'ui',         'Ecosistema de Aliados','Our Allies'),
('tr-043', 'leadership.title',       'ui',         'Liderazgo Femenino',  'Female Leadership'),
('tr-044', 'trustbar.title',         'ui',         'Respaldados por',     'Backed by'),
('tr-045', 'admin.dashboard',        'ui',         'Panel de Control',    'Dashboard'),
('tr-046', 'admin.products',         'ui',         'Productos',           'Products'),
('tr-047', 'admin.prices',           'ui',         'Precios',             'Prices'),
('tr-048', 'admin.content',          'ui',         'Contenido',           'Content'),
('tr-049', 'admin.categories',       'ui',         'Categorías',          'Categories'),
('tr-050', 'admin.settings',         'ui',         'Configuración',       'Settings');

-- ─────────────────────────────────────────────────────────────
-- 4. CATEGORIES
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO categories (id, slug, parent_id, icon, `order`, status) VALUES
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

INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES
('page-home', 'es', '[
  {
    "id": "home-hero",
    "type": "hero",
    "order": 0,
    "content": {
      "seo": {
        "metaTitle": "Bionano A&T | Soluciones Bionanotecnológicas",
        "metaKeywords": "bionanotecnología, BNX, antimicrobiano, fungicida, sostenible, nanotecnología",
        "metaDescription": "Bionanoaxus (BNX): Innovación en bionanotecnología para protección antimicrobiana y fungicida sostenible."
      },
      "title": "Bionanoaxus (BNX)",
      "ctaLink": "/store",
      "ctaText": "Explorar Catálogo",
      "subtitle": "La revolución bionanotecnológica que cuida su industria y el planeta. Soluciones antimicrobianas y fungicidas de origen orgánico con precisión atómica.",
      "backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1775964807642_edly1hf8t.webp?v=1775964811213",
      "secondaryCtaLink": "/technology",
      "secondaryCtaText": "Nuestra Tecnología"
    },
    "visible": true
  },
  {
    "id": "home-trust",
    "type": "trust",
    "order": 10,
    "content": {
      "partners": [
        {
          "link": "https://www.agrosavia.co",
          "name": "AGROSAVIA",
          "image": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&h=200&fit=crop",
          "details": [
            "Investigación aplicada en campo",
            "Validación de productos BNX",
            "Certificación agrícola nacional"
          ],
          "description": "Corporación colombiana de investigación agropecuaria. Aliado estratégico en validación de soluciones para el sector agrícola.",
          "placeholder": "Investigación Agrícola"
        },
        {
          "link": "https://www.procolombia.co",
          "name": "ProColombia",
          "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop",
          "details": [
            "Apoyo en mercados internacionales",
            "Red de distribución global",
            "Certificación de exportación"
          ],
          "description": "Entidad gubernamental que promueve el turismo, la inversión y las exportaciones de Colombia al mundo.",
          "placeholder": "Promoción Internacional"
        },
        {
          "link": "https://minciencias.gov.co",
          "name": "MinCiencias",
          "image": "https://ik.imagekit.io/wfm4vebzr/perfiles/avatares/avatar_user_default_1775966374482_895o48o2e.webp?v=1775966377623",
          "details": [
            "Financiación I+D+i",
            "Reconocimiento tecnológico",
            "Respaldo institucional"
          ],
          "description": "Ministerio de Ciencias que respalda la innovación tecnológica nacional, avalando la investigación de Bionano A&T.",
          "placeholder": "Ciencia & Innovación"
        },
        {
          "name": "BioTrade",
          "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&h=200&fit=crop",
          "details": [
            "Certificación de comercio justo",
            "Red de distribución orgánica",
            "Mercados premium"
          ],
          "description": "Red de comercio sostenible que certifica productos de origen biológico para mercados internacionales.",
          "placeholder": "Comercio Verde"
        },
        {
          "name": "AgroNet",
          "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=400&h=200&fit=crop",
          "details": [
            "Conectividad rural",
            "Difusión tecnológica",
            "Capacitación de productores"
          ],
          "description": "Plataforma integral de conexión agrícola que facilita el acceso de productores a tecnologías innovadoras.",
          "placeholder": "Red Agrícola"
        },
        {
          "name": "EcoInvest",
          "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop",
          "details": [
            "Capital semilla",
            "Mentoría empresarial",
            "Acceso a mercados"
          ],
          "description": "Fondo de inversión especializado en startups de biotecnología y economía circular.",
          "placeholder": "Inversión Verde"
        }
      ]
    },
    "visible": true
  },
  {
    "id": "home-purpose",
    "type": "features",
    "order": 20,
    "content": {
      "items": [
        {
          "icon": "Users",
          "title": "Misión",
          "description": "<p>Desarrollar soluciones bionanotecnológicas orgánicas que protejan cultivos, industrias y espacios, eliminando patógenos sin dañar el ecosistema ni la salud humana.</p>"
        },
        {
          "icon": "Target",
          "title": "Visión",
          "description": "Ser líderes globales en biotecnología sostenible para 2030, presentes en más de 50 países con productos certificados internacionalmente."
        },
        {
          "icon": "Lightbulb",
          "title": "Innovación",
          "description": "Combinamos nanotecnología de vanguardia con principios activos orgánicos para crear soluciones que la industria convencional no puede igualar."
        }
      ]
    },
    "visible": true
  },
  {
    "id": "home-featured",
    "type": "featured",
    "order": 30,
    "content": {
      "title": "Producto Estrella",
      "ctaLink": "/store",
      "ctaText": "Ver Detalles y Precios",
      "features": [
        {
          "icon": "Shield",
          "title": "Eficacia Comprobada",
          "description": "Elimina el 99.99% de bacterias, hongos y virus con una sola aplicación, avalado por estudios de laboratorio internacionales."
        },
        {
          "icon": "Leaf",
          "title": "100% Orgánico",
          "description": "Formulado con extractos naturales y nanopartículas biodegradables. No deja residuos tóxicos ni afecta la cadena alimentaria."
        },
        {
          "icon": "Droplets",
          "title": "Múltiples Aplicaciones",
          "description": "Válido para agricultura, industria alimentaria, hospitales, acuicultura y espacios públicos. Un producto, infinitas soluciones."
        }
      ],
      "productName": "Bionanoaxus (BNX)",
      "productImage": "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&fit=crop",
      "productDescription": "<p>Nuestra solución insignia de desinfección y protección antimicrobiana de última generación. Formulado con nanopartículas de plata orgánica y extractos botánicos activos, BNX ofrece una eficacia sin precedentes contra bacterias, hongos, virus y esporas, con impacto mínimo sobre el ecosistema.</p>"
    },
    "visible": true
  },
  {
    "id": "home-products",
    "type": "products",
    "order": 40,
    "content": {
      "title": "Soluciones para Cada Industria",
      "ctaLink": "/store",
      "ctaText": "Ver Catalogo completo",
      "subtitle": "Descubre nuestra gama completa de productos bionanotecnológicos, diseñados para satisfacer las necesidades específicas de cada sector productivo.",
      "selectedProductIds": [
        "prod-003",
        "prod-001",
        "prod-002"
      ]
    },
    "visible": true
  },
  {
    "id": "home-timeline",
    "type": "timeline",
    "order": 50,
    "content": {
      "title": "Nuestra Historia",
      "subtitle": "Una trayectoria de innovación constante",
      "milestones": [
        {
          "icon": "Lightbulb",
          "year": "2015",
          "title": "Fundación en Colombia",
          "description": "Nace Bionano A&T con la misión de democratizar la biotecnología sostenible en Latinoamérica."
        },
        {
          "icon": "FileCheck",
          "year": "2017",
          "title": "Primera Patente BNX",
          "description": "Registro de la primera patente de la fórmula Bionanoaxus ante la Superintendencia de Industria y Comercio."
        },
        {
          "icon": "TrendingUp",
          "year": "2019",
          "title": "Expansión Regional",
          "description": "Entrada a mercados de México, Perú y Ecuador, consolidando nuestra presencia en América Latina."
        },
        {
          "icon": "FileCheck",
          "year": "2021",
          "title": "Certificación Internacional",
          "description": "Obtención de certificaciones ISO 9001 y aprobación del USDA para exportación de productos orgánicos."
        },
        {
          "icon": "TrendingUp",
          "year": "2023",
          "title": "Alianzas Globales",
          "description": "Firma de acuerdos de distribución con socios en Europa y Asia, alcanzando presencia en 25 países."
        },
        {
          "icon": "Lightbulb",
          "year": "2025",
          "title": "Nueva Era Digital",
          "description": "Lanzamiento de la plataforma digital de pedidos B2B y el laboratorio de investigación de próxima generación."
        }
      ],
      "description": "<p>Desde nuestra fundación hemos recorrido un camino de investigación, validación y expansión global, construyendo la plataforma biotecnológica del futuro.</p>"
    },
    "visible": true
  },
  {
    "id": "home-team",
    "type": "team",
    "order": 60,
    "content": {
      "title": "Nuestros Líderes",
      "members": [
        {
          "name": "Dr. Carlos Andrade",
          "role": "CEO & Co-Fundador",
          "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        },
        {
          "name": "Dra. Sofía Ramírez",
          "role": "Directora Científica",
          "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        },
        {
          "name": "Ing. Ricardo Flores",
          "role": "Director de Operaciones",
          "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        },
        {
          "name": "Mgs. Valentina Cruz",
          "role": "Directora Comercial",
          "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        }
      ],
      "subtitle": "Un equipo multidisciplinario de científicos, ingenieros y expertos en negocios internacionales unidos por la pasión de transformar industrias a través de la biotecnología."
    },
    "visible": true
  },
  {
    "id": "home-ecosystem",
    "type": "ecosystem",
    "order": 70,
    "content": {
      "items": [
        {
          "desc": "Conectamos profesionales del sector biotecnológico y agroindustrial para crear sinergias de alto impacto.",
          "label": "Red de Innovadores",
          "title": "Red de Innovadores",
          "iconPath": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          "description": "Conectamos profesionales del sector biotecnológico y agroindustrial para crear sinergias de alto impacto."
        },
        {
          "desc": "Impulsamos el desarrollo responsable que equilibra la rentabilidad económica con el cuidado del planeta.",
          "label": "Crecimiento Sostenible",
          "title": "Crecimiento Sostenible",
          "iconPath": "",
          "description": "Impulsamos el desarrollo responsable que equilibra la rentabilidad económica con el cuidado del planeta."
        }
      ],
      "title": "Nuestro Ecosistema",
      "subtitle": "Conectamos innovadores, empresarios y profesionales para construir un ecosistema de negocios sostenible y tecnológico que impulse la economía verde."
    },
    "visible": true
  },
  {
    "id": "home-news",
    "type": "news",
    "order": 80,
    "content": {
      "title": "Noticias y Artículos",
      "subtitle": "Mantente al tanto de los últimos avances en bionanotecnología, sostenibilidad y los logros de Bionano A&amp;T."
    },
    "visible": true
  }
]');

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 8. PAGE CONTENTS: HOME (EN)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES
('page-home', 'en', '[
  {
    "id": "home-hero",
    "type": "hero",
    "order": 0,
    "content": {
      "seo": {
        "metaTitle": "Bionano A&T | Bionanotechnological Solutions",
        "metaKeywords": "bionanotechnology, BNX, antimicrobial, fungicide, sustainable, nanotechnology",
        "metaDescription": "Bionanoaxus (BNX): Innovation in bionanotechnology for sustainable antimicrobial and fungicidal protection."
      },
      "title": "Bionanoaxus (BNX)",
      "ctaLink": "/store",
      "ctaText": "Explore Catalog",
      "subtitle": "The bionanotechnology revolution that protects your industry and the planet. Organic antimicrobial and fungicidal solutions with atomic precision.",
      "backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1775964807642_edly1hf8t.webp?v=1775964811213",
      "secondaryCtaLink": "/technology",
      "secondaryCtaText": "Our Technology"
    },
    "visible": true
  },
  {
    "id": "home-trust",
    "type": "trust",
    "order": 10,
    "content": {
      "partners": [
        {
          "link": "https://www.agrosavia.co",
          "name": "AGROSAVIA",
          "image": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&h=200&fit=crop",
          "details": [
            "Applied field research",
            "BNX product validation",
            "National agricultural certification"
          ],
          "description": "Colombian corporation for agricultural research. Strategic ally in validating solutions for the agricultural sector.",
          "placeholder": "Agricultural Research"
        },
        {
          "link": "https://www.procolombia.co",
          "name": "ProColombia",
          "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop",
          "details": [
            "International market support",
            "Global distribution network",
            "Export certification"
          ],
          "description": "Government entity promoting tourism, investment and Colombian exports worldwide.",
          "placeholder": "International Promotion"
        },
        {
          "link": "https://minciencias.gov.co",
          "name": "MinCiencias",
          "image": "https://ik.imagekit.io/wfm4vebzr/perfiles/avatares/avatar_user_default_1775966374482_895o48o2e.webp?v=1775966377623",
          "details": [
            "R&D financing",
            "Technological recognition",
            "Institutional support"
          ],
          "description": "Ministry of Sciences that supports national technological innovation, endorsing Bionano A&T research.",
          "placeholder": "Science & Innovation"
        },
        {
          "name": "BioTrade",
          "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&h=200&fit=crop",
          "details": [
            "Fair trade certification",
            "Organic distribution network",
            "Premium markets"
          ],
          "description": "Sustainable trade network certifying biological origin products for international markets.",
          "placeholder": "Green Trade"
        },
        {
          "name": "AgroNet",
          "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=400&h=200&fit=crop",
          "details": [
            "Rural connectivity",
            "Technology dissemination",
            "Producer training"
          ],
          "description": "Comprehensive agricultural connection platform facilitating producer access to innovative technologies.",
          "placeholder": "Agricultural Network"
        },
        {
          "name": "EcoInvest",
          "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop",
          "details": [
            "Seed capital",
            "Business mentoring",
            "Market access"
          ],
          "description": "Investment fund specialized in biotechnology startups and circular economy.",
          "placeholder": "Green Investment"
        }
      ]
    },
    "visible": true
  },
  {
    "id": "home-purpose",
    "type": "features",
    "order": 20,
    "content": {
      "items": [
        {
          "icon": "Users",
          "title": "Mission",
          "description": "Develop organic bionanotechnological solutions that protect crops, industries and spaces, eliminating pathogens without harming the ecosystem or human health."
        },
        {
          "icon": "Target",
          "title": "Vision",
          "description": "To be global leaders in sustainable biotechnology by 2030, present in more than 50 countries with internationally certified products."
        },
        {
          "icon": "Lightbulb",
          "title": "Innovation",
          "description": "We combine cutting-edge nanotechnology with organic active ingredients to create solutions that conventional industry cannot match."
        }
      ]
    },
    "visible": true
  },
  {
    "id": "home-featured",
    "type": "featured",
    "order": 30,
    "content": {
      "title": "Star Product",
      "ctaLink": "/store",
      "ctaText": "View Details & Pricing",
      "features": [
        {
          "icon": "Shield",
          "title": "Proven Efficacy",
          "description": "Eliminates 99.99% of bacteria, fungi and viruses with a single application, backed by international laboratory studies."
        },
        {
          "icon": "Leaf",
          "title": "100% Organic",
          "description": "Formulated with natural extracts and biodegradable nanoparticles. Leaves no toxic residues or food chain impact."
        },
        {
          "icon": "Droplets",
          "title": "Multiple Applications",
          "description": "Valid for agriculture, food industry, hospitals, aquaculture and public spaces. One product, infinite solutions."
        }
      ],
      "productName": "Bionanoaxus (BNX)",
      "productImage": "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&fit=crop",
      "productDescription": "<p>Our flagship next-generation antimicrobial disinfection and protection solution. Formulated with organic silver nanoparticles and active botanical extracts, BNX offers unprecedented efficacy against bacteria, fungi, viruses and spores, with minimal ecosystem impact.</p>"
    },
    "visible": true
  },
  {
    "id": "home-products",
    "type": "products",
    "order": 40,
    "content": {
      "title": "Solutions for Every Industry",
      "subtitle": "Discover our complete range of bionanotechnological products, designed to meet the specific needs of each productive sector.",
      "selectedProductIds": [
        "prod-003",
        "prod-001",
        "prod-002"
      ]
    },
    "visible": true
  },
  {
    "id": "home-timeline",
    "type": "timeline",
    "order": 50,
    "content": {
      "title": "Our History",
      "subtitle": "A journey of constant innovation",
      "milestones": [
        {
          "icon": "Lightbulb",
          "year": "2015",
          "title": "Founded in Colombia",
          "description": "Bionano A&T was born with the mission of democratizing sustainable biotechnology in Latin America."
        },
        {
          "icon": "FileCheck",
          "year": "2017",
          "title": "First BNX Patent",
          "description": "Registration of the first Bionanoaxus formula patent with the Superintendence of Industry and Commerce."
        },
        {
          "icon": "TrendingUp",
          "year": "2019",
          "title": "Regional Expansion",
          "description": "Entry into markets in Mexico, Peru and Ecuador, consolidating our presence in Latin America."
        },
        {
          "icon": "FileCheck",
          "year": "2021",
          "title": "International Certification",
          "description": "Obtaining ISO 9001 certifications and USDA approval for export of organic products."
        },
        {
          "icon": "TrendingUp",
          "year": "2023",
          "title": "Global Alliances",
          "description": "Signing distribution agreements with partners in Europe and Asia, reaching presence in 25 countries."
        },
        {
          "icon": "Lightbulb",
          "year": "2025",
          "title": "New Digital Era",
          "description": "Launch of the B2B digital ordering platform and the next-generation research laboratory."
        }
      ],
      "description": "Since our founding, we have traveled a path of research, validation and global expansion, building the biotechnological platform of the future."
    },
    "visible": true
  },
  {
    "id": "home-team",
    "type": "team",
    "order": 60,
    "content": {
      "title": "Our Leaders",
      "members": [
        {
          "name": "Dr. Carlos Andrade",
          "role": "CEO & Co-Founder",
          "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        },
        {
          "name": "Dr. Sofía Ramírez",
          "role": "Chief Science Officer",
          "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        },
        {
          "name": "Eng. Ricardo Flores",
          "role": "Chief Operating Officer",
          "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        },
        {
          "name": "Mgs. Valentina Cruz",
          "role": "Chief Commercial Officer",
          "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        }
      ],
      "subtitle": "A multidisciplinary team of scientists, engineers and international business experts united by the passion to transform industries through biotechnology."
    },
    "visible": true
  },
  {
    "id": "home-ecosystem",
    "type": "ecosystem",
    "order": 70,
    "content": {
      "items": [
        {
          "desc": "We connect professionals from the biotechnological and agroindustrial sector to create high-impact synergies.",
          "label": "Network of Innovators",
          "iconPath": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        },
        {
          "desc": "We promote responsible development that balances economic profitability with caring for the planet.",
          "label": "Sustainable Growth",
          "iconPath": ""
        }
      ],
      "title": "Our Ecosystem",
      "subtitle": "We connect innovators, entrepreneurs and professionals to build a sustainable and technological business ecosystem that drives the green economy."
    },
    "visible": true
  },
  {
    "id": "home-news",
    "type": "news",
    "order": 80,
    "content": {
      "title": "News & Articles",
      "subtitle": "Stay up to date with the latest advances in bionanotechnology, sustainability and Bionano A&T achievements."
    },
    "visible": true
  }
]');

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 9. PAGE CONTENTS: ABOUT (ES)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES
('page-about', 'es', '[
  {
    "id": "about-hero",
    "type": "hero",
    "order": 1,
    "visible": true,
    "content": {
      "title": "Ciencia aplicada para un mundo de Residuo Cero",
      "subtitle": "Dos doctoras, 20 aÃ±os de investigaciÃ³n y una misiÃ³n clara: transformar la industria con bionanotecnologÃ­a de ruta verde.",
      "ctaText": "Conocer nuestra historia",
      "ctaLink": "#history",
      "ctaActionType": "scroll"
    }
  },
  {
    "id": "about-history",
    "type": "text",
    "order": 2,
    "visible": true,
    "content": {
      "title": "Nuestra Historia",
      "text": "En 2003, Ana Elisa Casas y Tatiana Pineda se conocieron en Brasil mientras realizaban sus posgrados en materiales en RÃ­o de Janeiro. Dos colombianas unidas por la ciencia y la aventura de investigar lejos de casa.<br><br>Ana Elisa regresÃ³ en 2007 a Colombia como docente e investigadora. Tatiana culminÃ³ su doctorado en 2012 y se vinculÃ³ a una universidad del sur de Brasil. En 2020, en plena pandemia, Tatiana decidiÃ³ regresar a Colombia y juntas tomaron una decisiÃ³n que cambiarÃ­a su rumbo: unir casi 20 aÃ±os de experiencia en nanotecnologÃ­a y materiales para crear productos reales para la industria.<br><br>Alquilaron un laboratorio y comenzaron desde cero. En 2021 formalizaron A&T BioNano SAS ante la CÃ¡mara de Comercio de Sabaneta. Desde entonces, cada convocatoria ganada, cada patente registrada y cada aliado de la industria confirma que la ciencia colombiana puede competir en los mercados mÃ¡s exigentes del mundo."
    }
  },
  {
    "id": "about-stats",
    "type": "stats",
    "order": 3,
    "visible": true,
    "content": {
      "title": "Nuestra trayectoria en nÃºmeros",
      "stats": [
        {"value": "20+", "label": "AÃ±os de experiencia cientÃ­fica combinada"},
        {"value": "2021", "label": "AÃ±o de constituciÃ³n como empresa"},
        {"value": "1", "label": "Patente registrada ante la SIC"},
        {"value": "3+", "label": "Convocatorias de Minciencias ganadas"}
      ]
    }
  },
  {
    "id": "about-timeline",
    "type": "timeline",
    "order": 4,
    "visible": true,
    "content": {
      "title": "Nuestros Hitos",
      "subtitle": "El camino que nos trajo hasta aquÃ­",
      "milestones": [
        {"year": "2003", "title": "El encuentro", "description": "Ana Elisa y Tatiana se conocen en Brasil durante sus posgrados en materiales."},
        {"year": "2020", "title": "La decisiÃ³n", "description": "En pandemia, deciden unirse para transferir conocimiento a productos industriales. Alquilan su primer laboratorio."},
        {"year": "2021", "title": "Nacimiento oficial", "description": "Constituyen A&T BioNano SAS ante la CÃ¡mara de Comercio de Sabaneta. Ganan Idearlo no es suficiente de Minciencias."},
        {"year": "2022", "title": "Primer equipo", "description": "Juan Pablo Barrera, Ing. en NanotecnologÃ­a, se une al equipo. Ganan SÃ¡cale jugo a tu patente de Minciencias."},
        {"year": "2023", "title": "Primeras ventas", "description": "Validaciones en campo con empresas aliadas en sectores avÃ­cola, agrÃ­cola, empaques y pinturas."},
        {"year": "2024", "title": "CertificaciÃ³n internacional", "description": "Beneficiadas en la convocatoria MapBio para certificaciÃ³n de bioproductos. La patente avanza a examen de fondo."}
      ]
    }
  },
  {
    "id": "about-team",
    "type": "team",
    "order": 5,
    "visible": true,
    "content": {
      "title": "Nuestro Equipo",
      "subtitle": "Ciencia, pasiÃ³n y compromiso al servicio de la industria",
      "members": [
        {"name": "Ana Elisa Casas Botero", "role": "Co-Fundadora & CEO", "bio": "Ph.D. en Materiales. MÃ¡s de 20 aÃ±os de experiencia acadÃ©mica e investigativa en universidades colombianas y brasileras.", "image": "/images/team/ana-elisa.jpg", "linkedin": ""},
        {"name": "Tatiana Pineda Vasquez", "role": "Co-Fundadora & CTO", "bio": "Ph.D. en BiotecnologÃ­a. Investigadora con mÃ¡s de 20 aÃ±os de trayectoria en sÃ­ntesis de materiales nanoestructurados.", "image": "/images/team/tatiana.jpg", "linkedin": ""},
        {"name": "Juan Pablo Barrera", "role": "Ing. en NanotecnologÃ­a", "bio": "Ingeniero en NanotecnologÃ­a. Responsable del desarrollo, caracterizaciÃ³n y pruebas de aplicaciÃ³n de los productos.", "image": "/images/team/juan-pablo.jpg", "linkedin": ""}
      ]
    }
  },
  {
    "id": "about-values",
    "type": "features",
    "order": 6,
    "visible": true,
    "content": {
      "items": [
        {"icon": "ðŸ”¬", "title": "Rigor CientÃ­fico", "description": "Ventaja competitiva respaldada en propiedad intelectual e investigaciÃ³n avanzada con eficacia del 99.9%."},
        {"icon": "ðŸŒ±", "title": "Sostenibilidad", "description": "Procesos que eliminan la contaminaciÃ³n quÃ­mica, protegiendo ecosistemas y alineados con la Agenda 2030."},
        {"icon": "ðŸ›¡ï¸", "title": "Inocuidad", "description": "Bioproductos seguros para agricultores y consumidores, sin toxicidad ni resistencia microbiana."},
        {"icon": "ðŸ“‹", "title": "Excelencia Normativa", "description": "Operamos bajo los estÃ¡ndares tÃ©cnicos mÃ¡s estrictos de mercados europeos y asiÃ¡ticos."},
        {"icon": "ðŸ¤", "title": "ColaboraciÃ³n EstratÃ©gica", "description": "Alianzas con academia, centros de investigaciÃ³n y distribuidores internacionales."}
      ]
    }
  },
  {
    "id": "about-cta",
    "type": "cta",
    "order": 7,
    "visible": true,
    "content": {
      "title": "Â¿Quiere conocer mÃ¡s sobre nuestra tecnologÃ­a?",
      "subtitle": "Hable directamente con nuestros cientÃ­ficos",
      "ctaText": "ContÃ¡ctenos",
      "ctaLink": "#contact",
      "ctaActionType": "scroll"
    }
  }
]');

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 10. PAGE CONTENTS: ABOUT (EN)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES
('page-about', 'en', '[
  {
    "id": "about-hero",
    "type": "hero",
    "order": 1,
    "visible": true,
    "content": {
      "title": "Applied Science for a Zero-Residue World",
      "subtitle": "Two doctors, 20 years of research and a clear mission: transforming industry with green-route bionanotechnology.",
      "ctaText": "Learn our story",
      "ctaLink": "#history",
      "ctaActionType": "scroll"
    }
  },
  {
    "id": "about-history",
    "type": "text",
    "order": 2,
    "visible": true,
    "content": {
      "title": "Our Story",
      "text": "In 2003, Ana Elisa Casas and Tatiana Pineda met in Brazil while pursuing their postgraduate studies in materials in Rio de Janeiro. Two Colombian women united by science and the adventure of researching far from home.<br><br>Ana Elisa returned to Colombia in 2007 as a lecturer and researcher. Tatiana completed her doctorate in 2012 and joined a university in southern Brazil. In 2020, during the pandemic, Tatiana decided to return to Colombia and together they made a life-changing decision: combining nearly 20 years of experience in nanotechnology and materials to create real products for industry.<br><br>They rented a laboratory and started from scratch. In 2021 they formalized A&T BioNano SAS before the Chamber of Commerce of Sabaneta. Since then, every grant won, every patent filed and every industry ally confirms that Colombian science can compete in the most demanding markets in the world."
    }
  },
  {
    "id": "about-stats",
    "type": "stats",
    "order": 3,
    "visible": true,
    "content": {
      "title": "Our trajectory in numbers",
      "stats": [
        {"value": "20+", "label": "Combined years of scientific experience"},
        {"value": "2021", "label": "Year of incorporation"},
        {"value": "1", "label": "Patent registered with SIC"},
        {"value": "3+", "label": "Minciencias grants won"}
      ]
    }
  },
  {
    "id": "about-timeline",
    "type": "timeline",
    "order": 4,
    "visible": true,
    "content": {
      "title": "Our Milestones",
      "subtitle": "The journey that brought us here",
      "milestones": [
        {"year": "2003", "title": "The meeting", "description": "Ana Elisa and Tatiana meet in Brazil during their materials postgraduate programs."},
        {"year": "2020", "title": "The decision", "description": "During the pandemic, they decide to transfer their knowledge into industrial products. They rent their first lab."},
        {"year": "2021", "title": "Official birth", "description": "A&T BioNano SAS incorporated. Won Minciencias grant for patent registration."},
        {"year": "2022", "title": "First team", "description": "Juan Pablo Barrera, Nanotechnology Engineer, joins the team. Won second Minciencias grant for scaling equipment."},
        {"year": "2023", "title": "First sales", "description": "Field validations with allied companies in poultry, agriculture, packaging and paints sectors."},
        {"year": "2024", "title": "International certification", "description": "Selected for MapBio bioproduct certification. Patent advances to substantive examination."}
      ]
    }
  },
  {
    "id": "about-team",
    "type": "team",
    "order": 5,
    "visible": true,
    "content": {
      "title": "Our Team",
      "subtitle": "Science, passion and commitment for industry",
      "members": [
        {"name": "Ana Elisa Casas Botero", "role": "Co-Founder & CEO", "bio": "Ph.D. in Materials. Over 20 years of academic and research experience in Colombian and Brazilian universities.", "image": "/images/team/ana-elisa.jpg", "linkedin": ""},
        {"name": "Tatiana Pineda Vasquez", "role": "Co-Founder & CTO", "bio": "Ph.D. in Biotechnology. Researcher with over 20 years in nanostructured materials synthesis.", "image": "/images/team/tatiana.jpg", "linkedin": ""},
        {"name": "Juan Pablo Barrera", "role": "Nanotechnology Engineer", "bio": "Nanotechnology Engineer. Responsible for product development, characterization and application testing.", "image": "/images/team/juan-pablo.jpg", "linkedin": ""}
      ]
    }
  },
  {
    "id": "about-values",
    "type": "features",
    "order": 6,
    "visible": true,
    "content": {
      "items": [
        {"icon": "ðŸ”¬", "title": "Scientific Rigor", "description": "Competitive advantage backed by intellectual property and advanced research with 99.9% efficacy."},
        {"icon": "ðŸŒ±", "title": "Sustainability", "description": "Processes that eliminate chemical contamination, protecting ecosystems and aligned with the 2030 Agenda."},
        {"icon": "ðŸ›¡ï¸", "title": "Safety", "description": "Bioproducts safe for farmers and consumers, with no toxicity or microbial resistance."},
        {"icon": "ðŸ“‹", "title": "Regulatory Excellence", "description": "We operate under the strictest technical standards of European and Asian markets."},
        {"icon": "ðŸ¤", "title": "Strategic Collaboration", "description": "Alliances with academia, research centers and international distributors."}
      ]
    }
  },
  {
    "id": "about-cta",
    "type": "cta",
    "order": 7,
    "visible": true,
    "content": {
      "title": "Want to learn more about our technology?",
      "subtitle": "Speak directly with our scientists",
      "ctaText": "Contact Us",
      "ctaLink": "#contact",
      "ctaActionType": "scroll"
    }
  }
]');

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 11. PAGE CONTENTS: ECOSYSTEM (ES y EN)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES
('page-ecosystem', 'es', '[{"id": "ecosystem-hero","type": "hero","order": 0,"content": {"title": "Nuestro Ecosistema","height": "300px","subtitle": "Conectamos ciencia, tecnología y negocios para un futuro sostenible.","backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1776113359487_6svdef9eu.webp?v=1776113362528"},"visible": true},{"id": "ecosystem-stats","type": "stats","order": 1,"content": {"stats": [{"label": "Aliados Activos","value": "50+"},{"label": "Países Alcanzados","value": "12"},{"label": "Sostenibilidad","value": "100%"},{"label": "Soporte","value": "24/7"}],"title": "Creciendo Juntos"},"visible": true},{"id": "ecosystem-catalog","type": "category-filter","order": 2,"content": {"title": "Directorio de Miembros","subtitle": "Explora los innovadores y empresas que están transformando la industria."},"visible": true}]'),
('page-ecosystem', 'en', '[{"id": "ecosystem-hero","type": "hero","order": 0,"content": {"title": "Our Ecosystem","height": "300px","subtitle": "Connecting science, technology, and business for a sustainable future.","backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1776113359487_6svdef9eu.webp?v=1776113362528"},"visible": true},{"id": "ecosystem-stats","type": "stats","order": 1,"content": {"stats": [{"label": "Active Allies","value": "50+"},{"label": "Countries Reached","value": "12"},{"label": "Sustainability","value": "100%"},{"label": "Support","value": "24/7"}],"title": "Growing Together"},"visible": true},{"id": "ecosystem-catalog","type": "category-filter","order": 2,"content": {"title": "Members Directory","subtitle": "Explore the innovators and companies that are transforming the industry."},"visible": true}]');

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 12. PAGE CONTENTS: TECHNOLOGY (ES y EN)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES
('page-technology', 'es', '[{"id":"tech-hero","type":"hero","order":0,"content":{"seo":{"metaTitle":"Tecnología BNX | Bionano A&T","metaKeywords":"V-Lab, R-Tech, nanotecnología, antimicrobiano, fungicida, BNX","metaDescription":"Descubre la ciencia detrás de Bionanoaxus: nanopartículas orgánicas, V-Lab y R-Tech para protección antimicrobiana de nueva generación."},"title":"Tecnología Bionano A&T","ctaLink":"/store","ctaText":"Ver Nuestros Productos","subtitle":"Donde la ciencia molecular se convierte en soluciones reales. Desarrollamos bionanotecnología que transforma la forma en que el mundo protege sus cultivos, alimentos e industrias.","backgroundImage":"https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1775966716178_ajfz0mem9.webp?v=1775966719587","secondaryCtaLink":"6c2b8381-ad2e-43bb-a2c3-cce614eac317","secondaryCtaText":"Contactar Equipo","secondaryCtaActionType":"popup"},"visible":true},{"id":"tech-features","type":"features","order":1,"content":{"items":[{"icon":"Microscope","title":"V-Lab: Laboratorio Virtual","details":["Simulación molecular 3D de alta precisión","Predicción de eficacia por cepa patógena","Optimización de concentraciones sin ensayos físicos","Integración con bases de datos microbiológicas globales","Resultados reproducibles y auditables"],"description":"Plataforma de modelado molecular en tiempo real que simula el comportamiento de nanopartículas antes de su síntesis. Reducimos ciclos de desarrollo de meses a días."},{"icon":"Atom","title":"R-Tech: Nanorecubrimientos Inteligentes","details":["Adherencia certificada en metales, plásticos y textiles","Liberación controlada del agente activo por contacto","Resistencia a humedad, UV y temperatura extrema","Cobertura homogénea en superficies complejas","Compatible con sistemas de nebulización industrial"],"description":"Sistema propietario de recubrimiento superficial de larga duración con nanopartículas de plata orgánica. Un solo tratamiento protege hasta 12 meses sin reactivaciones."},{"icon":"Shield","title":"BNX: Fórmula Insignia","details":["Eficacia del 99.99% contra 47 cepas documentadas","Tiempo de acción: menos de 30 segundos en superficies","Biodegradación completa en menos de 72 horas","Sin residuos tóxicos en suelos ni agua","Certificado USDA, EPA y ANLA Colombia"],"description":"Formulación líquida de amplio espectro que elimina bacterias, virus, hongos y esporas en contacto, sin generar resistencias microbianas."},{"icon":"Leaf","title":"AgroBio: Protección Agrícola","details":["Compatible con agricultura orgánica certificada","Sin periodo de carencia para cosecha","Reducción del 60% en pérdidas por hongos postcosecha","Aplicación por goteo, foliar o nebulización","Probado en: banano, aguacate, cacao, tomate, fresa"],"description":"Línea específica para el sector agropecuario. Protege cultivos de alto valor comercial contra enfermedades fúngicas sin afectar la biodiversidad del suelo."}],"title":"Nuestra Plataforma Tecnológica","subtitle":"Cuatro pilares científicos que hacen de BNX la solución más avanzada del mercado"},"visible":true},{"id":"tech-stats","type":"stats","order":2,"content":{"stats":[{"label":"Eficacia Antimicrobiana","value":"99.99%","description":"Contra 47 cepas documentadas"},{"label":"Litros Producidos","value":"5M+","description":"Desde nuestra fundación"},{"label":"Países Activos","value":"25+","description":"Red de distribución global"},{"label":"Biodegradación","value":"72h","description":"Descomposición completa"}],"title":"Resultados que Hablan por Sí Solos","subtitle":"Diez años de investigación respaldados por datos reales"},"visible":true},{"id":"tech-bento","type":"bento","order":3,"content":{"items":[{"icon":"FlaskConical","size":"large","title":"I+D Continuo","details":["10 patentes registradas","Equipo de 25 investigadores"],"description":"Nuestro laboratorio nunca se detiene. Cada año lanzamos mejoras a la fórmula basadas en evidencia científica y retroalimentación de clientes en campo."},{"icon":"Globe","size":"normal","title":"Alcance Global","description":"Presentes en 25 países con red de distribución certificada."},{"icon":"Shield","size":"normal","title":"Certificaciones","details":["USDA Organic","EPA Registered","ISO 9001:2015"],"description":"USDA Organic, EPA registrado, ANLA Colombia, ISO 9001 y BPM vigentes."},{"icon":"Zap","size":"normal","title":"Acción Ultrarrápida","description":"Menos de 30 segundos para eliminar el 99.99% de los patógenos objetivo en superficie."},{"icon":"Leaf","size":"large","title":"Cero Impacto Ambiental","details":["Biodegradación total en 72h","Sin bioacumulación"],"description":"Primer desinfectante industrial con huella de carbono negativa, 100% biodegradable y sin acumulación en cadenas tróficas."}],"title":"¿Por Qué Elegirnos?","subtitle":"Ventajas diferenciales que nos posicionan como la tecnología número uno en el mercado"},"visible":true},{"id":"tech-quote","type":"quote","order":4,"content":{"role":"Corporación AgroAndes — Export Division","image":"https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop","quote":"Bionanoaxus no solo resolvió nuestro problema de contaminación fúngica, transformó completamente nuestra cadena de poscosecha. Las pérdidas se redujeron un 58% en el primer ciclo.","author":"Gerente de Operaciones"},"visible":true},{"id":"tech-history","type":"history","order":5,"content":{"title":"Una Década de Innovación","subtitle":"Los hitos que construyeron el futuro de la biotecnología sostenible","milestones":[{"icon":"Lightbulb","year":"2015","title":"Fundación en Medellín","description":"Nace Bionano A&T con un equipo de 5 investigadores y la misión de democratizar la biotecnología."},{"icon":"FileCheck","year":"2017","title":"Patente BNX V1.0","description":"Primera patente de la fórmula Bionanoaxus. Validación en 12 cepas patógenas con eficacia superior al 99%."},{"icon":"TrendingUp","year":"2019","title":"Primer Millón de Litros","description":"Superamos el primer millón de litros producidos. Presencia en Colombia, México, Perú y Ecuador."},{"icon":"FileCheck","year":"2021","title":"Certificación USDA & ISO","description":"Aprobación del USDA para exportación y certificación ISO 9001. Entrada al mercado europeo."},{"icon":"TrendingUp","year":"2023","title":"Expansión Global","description":"Operaciones en 25 países. Acuerdos de distribución con socios en Alemania, Japón y Brasil."},{"icon":"Lightbulb","year":"2025","title":"Era Digital BNX","description":"Lanzamiento de la plataforma B2B, V-Lab virtual y nueva línea AgroBio Premium."}],"description":"Cada año nos ha acercado más a nuestro objetivo: hacer de la biotecnología orgánica el estándar global de protección industrial."},"visible":true},{"id":"tech-faq","type":"faq","order":6,"content":{"items":[{"answer":"Las nanopartículas de plata orgánica de BNX actúan en múltiples frentes: penetran la membrana celular bacteriana, interfieren con la síntesis de ATP e inhiben la replicación del ADN. Esta acción triple impide que los microorganismos desarrollen resistencia, a diferencia de los antibióticos convencionales.","question":"¿Cuál es el mecanismo de acción de BNX contra bacterias?"},{"answer":"Sí. BNX está certificado por el USDA como producto orgánico y no requiere periodo de carencia antes de la cosecha. Sus componentes se biodegradam completamente en el suelo en menos de 72 horas, sin dejar residuos detestables por espectrometría de masas.","question":"¿Es seguro usar BNX cerca de cultivos para consumo humano?"},{"answer":"Los fungicidas químicos convencionales actúan sobre un único sitio de acción, lo que facilita el desarrollo de resistencia. BNX actúa simultáneamente sobre múltiples blancos moleculares, es biodegradable, no genera bioacumulación y no afecta organismos benéficos como polinizadores o microfauna del suelo.","question":"¿Qué diferencia a BNX de los fungicidas convencionales?"},{"answer":"Absolutamente. BNX es miscible en agua en cualquier proporción y no forma precipitados ni obstruye emisores de riego. Se recomienda aplicar entre 2 y 5 mL por litro según la concentración de patógenos objetivo identificados en el análisis de suelo.","question":"¿Se puede aplicar BNX en sistemas de riego por goteo?"},{"answer":"Los estudios de toxicidad oral realizados demuestran que BNX es prácticamente no tóxico en las concentraciones de uso (LD50 > 5000 mg/kg en modelos murinos). No obstante, no está formulado para consumo directo. En caso de ingestión, se recomienda beber agua abundante y contactar al médico.","question":"¿Qué pasa si se consume accidentalmente?"},{"answer":"En condiciones normales de uso industrial, R-Tech mantiene actividad antimicrobiana activa por un período de 6 a 12 meses, dependiendo de la frecuencia de limpieza, temperatura ambiente y exposición a luz UV directa. Se recomienda reaplicación anual en entornos de alta rotación.","question":"¿Cuánto tiempo dura la protección de R-Tech en superficies?"}],"title":"Preguntas Técnicas Frecuentes","subtitle":"Respuestas a las dudas más comunes sobre nuestra tecnología"},"visible":true},{"id":"tech-team","type":"team","order":7,"content":{"title":"El Equipo Científico","members":[{"name":"Dra. Sofía Ramírez","role":"Directora Científica","image":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"},{"name":"Dr. Manuel Herrera","role":"Jefe de Nanotecnología","image":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"},{"name":"Ing. Lucía Vargas","role":"Investigadora Senior BNX","image":"https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"}],"subtitle":"Investigadores y doctores especializados que dan vida a cada innovación de Bionano A&T."},"visible":true},{"id":"tech-process","type":"timeline","order":8,"content":{"title":"¿Cómo Funciona BNX?","subtitle":"Del laboratorio a su industria en cuatro pasos precisos","milestones":[{"desc":"Producimos nanopartículas de plata orgánica entre 1 y 20 nm, controlando forma y carga superficial para máxima eficacia.","step":"01","title":"Síntesis Nanomolecular"},{"desc":"Combinamos las nanopartículas con extractos vegetales activos (cúrcuma, neem, aloe) que potencian la acción antimicrobiana.","step":"02","title":"Activación Botánica"},{"desc":"Cada lote pasa pruebas de CMI y citotoxicidad antes de aprobarse para producción masiva.","step":"03","title":"Validación de Laboratorio"},{"desc":"El producto llega listo para usar via nebulización, aspersión o inmersión, adaptado a cada industria.","step":"04","title":"Aplicación Industrial"}],"description":"Nuestro proceso simplificado garantiza eficiencia."},"visible":true}]'),
('page-technology', 'en', '[{"id":"tech-hero","type":"hero","order":0,"content":{"seo":{"metaTitle":"BNX Technology | Bionano A&T","metaKeywords":"V-Lab, R-Tech, nanotechnology, antimicrobial, fungicide, BNX","metaDescription":"Discover the science behind Bionanoaxus: organic nanoparticles, V-Lab and R-Tech for next-generation antimicrobial protection."},"title":"Bionano A&T Technology","ctaLink":"/store","ctaText":"View Our Products","subtitle":"Where molecular science becomes real solutions. We develop bionanotechnology that transforms how the world protects its crops, food and industries.","backgroundImage":"https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1775966716178_ajfz0mem9.webp?v=1775966719587","secondaryCtaLink":"6c2b8381-ad2e-43bb-a2c3-cce614eac317","secondaryCtaText":"Contact Team","secondaryCtaActionType":"popup"},"visible":true},{"id":"tech-features","type":"features","order":1,"content":{"items":[{"icon":"Microscope","title":"V-Lab: Virtual Laboratory","details":["High-precision 3D molecular simulation","Efficacy prediction per pathogen strain","Concentration optimization without physical trials","Integration with global microbiological databases","Reproducible and auditable results"],"description":"Real-time molecular modeling platform that simulates nanoparticle behavior before synthesis. We reduce development cycles from months to days."},{"icon":"Atom","title":"R-Tech: Smart Nanocoatings","details":["Adhesion certified on metals, plastics and textiles","Controlled release of active agent on contact","Resistance to humidity, UV and extreme temperature","Homogeneous coverage on complex surfaces","Compatible with industrial nebulization systems"],"description":"Proprietary long-duration surface coating system with organic silver nanoparticles. A single treatment protects up to 12 months."},{"icon":"Shield","title":"BNX: Flagship Formula","details":["99.99% efficacy against 47 documented strains","Action time: less than 30 seconds on surfaces","Complete biodegradation in less than 72 hours","No toxic residues in soil or water","USDA, EPA and ANLA Colombia certified"],"description":"Broad-spectrum liquid formulation that eliminates bacteria, viruses, fungi and spores on contact, without generating microbial resistance."},{"icon":"Leaf","title":"AgroBio: Agricultural Protection","details":["Compatible with certified organic agriculture","No waiting period before harvest","60% reduction in post-harvest fungal losses","Application by drip, foliar or nebulization","Tested on: banana, avocado, cocoa, tomato, strawberry"],"description":"Specific line for the agricultural sector. Protects high-value commercial crops against fungal diseases without affecting soil biodiversity."}],"title":"Our Technology Platform","subtitle":"Four scientific pillars that make BNX the most advanced solution in the market"},"visible":true},{"id":"tech-stats","type":"stats","order":2,"content":{"stats":[{"label":"Antimicrobial Efficacy","value":"99.99%","description":"Against 47 documented strains"},{"label":"Liters Produced","value":"5M+","description":"Since our founding"},{"label":"Active Countries","value":"25+","description":"Global distribution network"},{"label":"Biodegradation","value":"72h","description":"Complete decomposition"}],"title":"Results That Speak for Themselves","subtitle":"Ten years of research backed by real data"},"visible":true},{"id":"tech-bento","type":"bento","order":3,"content":{"items":[{"icon":"FlaskConical","size":"large","title":"Continuous R&D","details":["10 registered patents","Team of 25 researchers"],"description":"Our laboratory never stops. Every year we release formula improvements based on scientific evidence and field customer feedback."},{"icon":"Globe","size":"normal","title":"Global Reach","description":"Present in 25 countries with certified distribution network."},{"icon":"Shield","size":"normal","title":"Certifications","details":["USDA Organic","EPA Registered","ISO 9001:2015"],"description":"USDA Organic, EPA registered, ISO 9001 and GMP in force."},{"icon":"Zap","size":"normal","title":"Ultra-Fast Action","description":"Less than 30 seconds to eliminate 99.99% of target pathogens on surface."},{"icon":"Leaf","size":"large","title":"Zero Environmental Impact","details":["Full biodegradation in 72h","No bioaccumulation"],"description":"First industrial disinfectant with a negative carbon footprint, 100% biodegradable."}],"title":"Why Choose Us?","subtitle":"Differential advantages that position us as the number one technology in the market"},"visible":true},{"id":"tech-quote","type":"quote","order":4,"content":{"role":"AgroAndes Corporation — Export Division","image":"https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop","quote":"Bionanoaxus did not just solve our fungal contamination problem, it completely transformed our post-harvest chain. Losses were reduced by 58% in the first cycle.","author":"Operations Manager"},"visible":true},{"id":"tech-history","type":"history","order":5,"content":{"title":"A Decade of Innovation","subtitle":"The milestones that built the future of sustainable biotechnology","milestones":[{"icon":"Lightbulb","year":"2015","title":"Founded in Medellín","description":"Bionano A&T is born with a team of 5 researchers."},{"icon":"FileCheck","year":"2017","title":"BNX V1.0 Patent","description":"First Bionanoaxus formula patent. Validated on 12 pathogenic strains."},{"icon":"TrendingUp","year":"2019","title":"First Million Liters","description":"We surpassed one million liters produced. Presence in 4 countries."},{"icon":"FileCheck","year":"2021","title":"USDA & ISO Certification","description":"USDA approval for export and ISO 9001 certification."},{"icon":"TrendingUp","year":"2023","title":"Global Expansion","description":"Operations in 25 countries with partners in Germany, Japan and Brazil."},{"icon":"Lightbulb","year":"2025","title":"Digital BNX Era","description":"B2B platform launch, virtual V-Lab and new AgroBio Premium line."}],"description":"Each year has brought us closer to our goal: making organic biotechnology the global standard for industrial protection."},"visible":true},{"id":"tech-faq","type":"faq","order":6,"content":{"items":[{"answer":"BNX organic silver nanoparticles act on multiple fronts: they penetrate the bacterial cell membrane, interfere with ATP synthesis, and inhibit DNA replication. This triple action prevents microorganisms from developing resistance.","question":"What is the mechanism of action of BNX against bacteria?"},{"answer":"Yes. BNX is USDA certified as an organic product and requires no waiting period before harvest. Its components completely biodegrade in soil in less than 72 hours.","question":"Is it safe to use BNX near food crops?"},{"answer":"Conventional chemical fungicides act on a single site, facilitating resistance development. BNX acts simultaneously on multiple molecular targets, is biodegradable, and does not affect beneficial organisms like pollinators.","question":"What differentiates BNX from conventional fungicides?"},{"answer":"Absolutely. BNX is miscible in water in any proportion and does not form precipitates or clog irrigation emitters. Apply 2-5 mL per liter depending on pathogen concentration.","question":"Can BNX be applied in drip irrigation systems?"},{"answer":"Under normal industrial use conditions, R-Tech maintains active antimicrobial activity for 6 to 12 months, depending on cleaning frequency and UV exposure. Annual reapplication is recommended in high-rotation environments.","question":"How long does R-Tech protection last on surfaces?"}],"title":"Frequently Asked Technical Questions","subtitle":"Answers to the most common questions about our technology"},"visible":true},{"id":"tech-team","type":"team","order":7,"content":{"title":"The Scientific Team","members":[{"name":"Dr. Sofía Ramírez","role":"Chief Science Officer","image":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"},{"name":"Dr. Manuel Herrera","role":"Head of Nanotechnology","image":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"},{"name":"Eng. Lucía Vargas","role":"Senior BNX Researcher","image":"https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"}],"subtitle":"Researchers and specialized scientists who bring every Bionano A&T innovation to life."},"visible":true},{"id":"tech-process","type":"timeline","order":8,"content":{"title":"How Does BNX Work?","subtitle":"From laboratory to your industry in four precise steps","milestones":[{"desc":"We produce organic silver nanoparticles between 1 and 20 nm, controlling shape and surface charge for maximum efficacy.","step":"01","title":"Nanomolecular Synthesis"},{"desc":"We combine nanoparticles with active plant extracts (turmeric, neem, aloe) that synergistically enhance antimicrobial action.","step":"02","title":"Botanical Activation"},{"desc":"Each batch undergoes MIC tests and cytotoxicity studies before being approved for mass production.","step":"03","title":"Laboratory Validation"},{"desc":"The product arrives ready to use via nebulization, spraying or immersion, adapted to each industry.","step":"04","title":"Industrial Application"}]},"visible":true}]');

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 13. ECOSYSTEM MEMBERS
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO ecosystem_members (id, slug, status, image, sector, social_media, youtube_videos, short_videos) VALUES
('eco-001', 'ce3pac',      'active', '', 'Empaques Alimentarios', '{}', '[]', '[]'),
('eco-002', 'coatings',    'active', '', 'Agroindustrial',        '{}', '[]', '[]'),
('eco-003', 'vmax-brasil', 'active', '', 'PolÃ­meros & Empaques',  '{}', '[]', '[]');

INSERT IGNORE INTO ecosystem_member_translations (member_id, language, name, description) VALUES
('eco-001', 'es', 'CE3PAC',       'Trabajan con empaques para almacenamiento de huevos y productos de panaderÃ­a. Incorporan nuestro biocida para control de hongos y bacterias en empaques de contacto alimentario.'),
('eco-001', 'en', 'CE3PAC',       'They work with packaging for eggs and bakery products. They incorporate our biocide for fungi and bacteria control in food-contact packaging.'),
('eco-002', 'es', 'Coatings S.A.S', 'Incorporan nuestra nanotecnologÃ­a en ceras para recubrimiento de frutas y verduras, protegiendo la producciÃ³n durante almacenamiento y transporte.'),
('eco-002', 'en', 'Coatings S.A.S', 'They incorporate our nanotechnology in waxes for fruit and vegetable coating, protecting production during storage and transport.'),
('eco-003', 'es', 'Vmax (Brasil)', 'Distribuidor aliado en Brasil con mÃ¡s de 20 aÃ±os en el sector de polÃ­meros para empaques de alimentos. Nuestro canal de entrada al mercado brasilero.'),
('eco-003', 'en', 'Vmax (Brazil)', 'Allied distributor in Brazil with over 20 years in the food packaging polymers sector. Our gateway to the Brazilian market.');

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 14. LEGAL PAGES
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO legal_pages (id, slug, title_es, title_en, content_es, content_en, is_active) VALUES
('legal-001', 'privacidad',
  'PolÃ­tica de Privacidad',
  'Privacy Policy',
  '<h2>Tratamiento de Datos Personales</h2><p>A&T BioNano SAS, con domicilio en Sabaneta, Antioquia, Colombia, es responsable del tratamiento de sus datos personales conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013.</p><h3>Datos que recopilamos</h3><p>Nombre, correo electrÃ³nico, telÃ©fono y mensajes enviados a travÃ©s de nuestros formularios de contacto.</p><h3>Finalidad</h3><p>Los datos recopilados se utilizan exclusivamente para responder a sus consultas, enviar cotizaciones y mantener comunicaciÃ³n comercial relacionada con nuestros productos.</p><h3>Derechos</h3><p>Usted tiene derecho a conocer, actualizar, rectificar y solicitar la supresiÃ³n de sus datos personales escribiendo a aytbionano@gmail.com.</p>',
  '<h2>Personal Data Processing</h2><p>A&T BioNano SAS, based in Sabaneta, Antioquia, Colombia, is responsible for the processing of your personal data in accordance with Colombian Law 1581 of 2012.</p><h3>Data We Collect</h3><p>Name, email, phone number and messages sent through our contact forms.</p><h3>Purpose</h3><p>Collected data is used exclusively to respond to your inquiries, send quotes and maintain commercial communication related to our products.</p><h3>Rights</h3><p>You have the right to access, update, rectify and request the deletion of your personal data by writing to aytbionano@gmail.com.</p>',
  TRUE
),
('legal-002', 'terminos',
  'TÃ©rminos y Condiciones',
  'Terms and Conditions',
  '<h2>Condiciones de Uso</h2><p>Al acceder y usar el sitio web de A&T BioNano, usted acepta los presentes tÃ©rminos y condiciones de uso.</p><h3>Propiedad Intelectual</h3><p>Todo el contenido de este sitio, incluyendo textos, imÃ¡genes, logotipos y materiales tÃ©cnicos, es propiedad de A&T BioNano SAS y estÃ¡ protegido por las leyes de propiedad intelectual de Colombia.</p><h3>Productos</h3><p>Los precios publicados en el sitio son referenciales. Las cotizaciones formales se envÃ­an directamente al cliente segÃºn volumen y especificaciones requeridas.</p><h3>LimitaciÃ³n de Responsabilidad</h3><p>A&T BioNano no se hace responsable por el uso inadecuado de la informaciÃ³n proporcionada en este sitio web.</p>',
  '<h2>Terms of Use</h2><p>By accessing and using the A&T BioNano website, you agree to these terms and conditions of use.</p><h3>Intellectual Property</h3><p>All content on this site, including text, images, logos and technical materials, is the property of A&T BioNano SAS and is protected by Colombian intellectual property laws.</p><h3>Products</h3><p>Prices published on the site are for reference only. Formal quotes are sent directly to the client based on volume and required specifications.</p><h3>Limitation of Liability</h3><p>A&T BioNano is not responsible for improper use of the information provided on this website.</p>',
  TRUE
);

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 15. USUARIO ADMINISTRADOR
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO users (id, name, email, password, role) VALUES (
  'admin-001',
  'Admin BioNano',
  'admin@bionano-ayt.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
);

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 16. PAGE CONTENTS: STORE (ES)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES
('page-store', 'es', '[{"id": "store-hero","type": "hero","order": 0,"content": {"seo": {"metaTitle": "Tienda Bionano AYT - Compra Productos Biotecnológicos","metaKeywords": "comprar agricultura, productos biotecnológicos, fertilizantes orgánicos, tienda online, bionano ayt","metaDescription": "Compra ahora productos biotecnológicos para agricultura. Fertilizantes orgánicos, soluciones especializadas y equipos agrícolas. Envío rápido y garantizado."},"badge": "Tienda Bionano AYT","title": "¡Compra Ahora!","ctaText": "Ver Productos","subtitle": "Soluciones biotecnológicas de alta calidad para tus cultivos. Productos certificados y envío garantizado.","backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1776031695614_qavrsa8l6.webp?v=1776031698130","secondaryCtaLink": "0d1a8625-06ee-4da1-8f24-fad8d5ac5a01","secondaryCtaText": "Cotizar personalizado","secondaryCtaActionType": "popup"},"visible": true},{"id": "store-flipcards","type": "flipcards","order": 10,"content": {"items": [{"icon": "Shield","title": "Certificado","description": "Todos los productos estan certificados y aprobados por el SENASA"},{"icon": "Truck","title": "Envio Rapido","description": "Envios nacionales en menos de 48 horas a todo el país"},{"icon": "CheckCircle","title": "Garantia","description": "Garantia total de 30 dias en todos nuestros productos"},{"icon": "Users","title": "Asesoría","description": "Asesoría técnica personalizada por profesionales expertos"},{"icon": "Package","title": "Stock","description": "Stock permanente disponible para entrega inmediata"},{"icon": "Award","title": "Calidad","description": "Calidad premium garantizada en cada uno de nuestros productos"}]},"visible": true},{"id": "store-products","type": "products","order": 20,"content": {"title": "Soluciones para Cada Industria","subtitle": "Descubre nuestra gama completa de productos bionanotecnológicos, diseñados para satisfacer las necesidades específicas de cada sector productivo.","selectedProductIds": ["prod-003","prod-001","prod-002"]},"visible": true},{"id": "clientes-1776113880083","type": "clientes","order": 30,"content": {"items": [],"title": "Nuestros Clientes Satisfechos","subtitle": "Empresas líderes de distintos sectores apuestan por nuestras soluciones biotecnológicas.","selectedMemberIds": ["eco-004","eco-003","eco-001","eco-002"]},"visible": true},{"id": "store-cta","type": "cta","order": 40,"content": {"icon": "ShoppingCart","title": "¿Necesitas Ayuda?","ctaText": "Contactar Ahora","subtitle": "Nuestro equipo de expertos esta listo para asesorarte y ayudarte a elegir el producto ideal para tus necesidades.","secondaryCtaText": "WhatsApp"},"visible": true}]');

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 17. PAGE CONTENTS: STORE (EN)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES
('page-store', 'en', '[{"id": "store-hero","type": "hero","order": 0,"content": {"seo": {"metaTitle": "Bionano AYT Store - Buy Biotechnological Products","metaKeywords": "buy agriculture, biotechnological products, organic fertilizers, online store, bionano ayt","metaDescription": "Shop now for biotechnological agricultural products. Organic fertilizers, specialized solutions and agricultural equipment. Fast and guaranteed shipping."},"badge": "Bionano AYT Store","title": "Shop Now!","ctaText": "View Products","subtitle": "High-quality biotechnological solutions for your crops. Certified products and guaranteed shipping.","backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1776031695614_qavrsa8l6.webp?v=1776031698130","secondaryCtaLink": "0d1a8625-06ee-4da1-8f24-fad8d5ac5a01","secondaryCtaText": "Contact Us","secondaryCtaActionType": "popup"},"visible": true},{"id": "store-flipcards","type": "flipcards","order": 10,"content": {"items": [{"icon": "Shield","title": "Certified","description": "All products are certified and approved by SENASA"},{"icon": "Truck","title": "Fast Shipping","description": "National shipments in less than 48 hours throughout the country"},{"icon": "CheckCircle","title": "Warranty","description": "30-day full warranty on all our products"},{"icon": "Users","title": "Advisory","description": "Personalized technical advice by expert professionals"},{"icon": "Package","title": "Stock","description": "Permanent stock available for immediate delivery"},{"icon": "Award","title": "Quality","description": "Guaranteed premium quality in each of our products"}]},"visible": true},{"id": "store-products","type": "products","order": 20,"content": {"selectedProductIds": ["prod-003","prod-001","prod-002"]},"visible": true},{"id": "store-trust","type": "trust","order": 30,"content": {"title": "Our Customers Trust Us","partners": [{"logo": "/images/partners/agroperu.png","name": "Agro Peru SAC","description": "Leading agricultural distribution company"},{"logo": "/images/partners/senasa.png","name": "SENASA","description": "National Agrarian Health Organization"},{"logo": "/images/partners/incagro.png","name": "Inca Agro","description": "Organic products exporter"},{"logo": "/images/partners/agroandina.png","name": "Agro Andina","description": "Andean Farmers Association"}],"subtitle": "Companies and farmers from all over Peru already use our products","selectedMemberIds": ["eco-003","eco-001","eco-002","eco-004"]},"visible": true},{"id": "clientes-1776113880083","type": "clientes","order": 40,"content": {"items": [],"title": "Nueva Sección","subtitle": "Descripción de ejemplo para la nueva sección.","selectedMemberIds": ["eco-004","eco-003","eco-001","eco-002"]},"visible": true},{"id": "store-cta","type": "cta","order": 50,"content": {"icon": "ShoppingCart","title": "Need Help?","ctaText": "Contact Now","subtitle": "Our team of experts is ready to advise you and help you choose the ideal product for your needs.","secondaryCtaText": "WhatsApp"},"visible": true}]');

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 18. BLOG: CategorÃ­as
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO blog_categories (id, slug, `order`, status) VALUES
('bcat-01', 'industria-y-regulacion', 1, 'active'),
('bcat-02', 'bionanotecnologia',      2, 'active'),
('bcat-03', 'postcosecha',            3, 'active'),
('bcat-04', 'sostenibilidad',         4, 'active');

INSERT IGNORE INTO blog_category_translations (category_id, language, name, description) VALUES
('bcat-01', 'es', 'Industria y RegulaciÃ³n', 'Noticias y anÃ¡lisis sobre normativas, LMR y tendencias del sector agro'),
('bcat-01', 'en', 'Industry & Regulation',  'News and analysis on regulations, MRL and agro sector trends'),
('bcat-02', 'es', 'BionanotecnologÃ­a',       'Ciencia aplicada, investigaciÃ³n y avances tecnolÃ³gicos'),
('bcat-02', 'en', 'Bionanotechnology',       'Applied science, research and technological advances'),
('bcat-03', 'es', 'Postcosecha',             'Soluciones para la cadena frÃ­a, almacenamiento y exportaciÃ³n'),
('bcat-03', 'en', 'Post-harvest',            'Solutions for cold chain, storage and export'),
('bcat-04', 'es', 'Sostenibilidad',          'Agenda 2030, ruta verde y producciÃ³n limpia'),
('bcat-04', 'en', 'Sustainability',          '2030 Agenda, green route and clean production');

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 19. BLOG: ArtÃ­culo 1 â€” Pesticidas en manzanas (PAN Europe)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO blog_posts (id, slug, author, cover_image, status, featured, views, type) VALUES
('blog-001',
 'residuos-pesticidas-manzanas-europa-2026',
 'Ana Elisa Casas Botero',
 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200',
 'published',
 TRUE,
 0,
 'article');

INSERT IGNORE INTO blog_post_translations (post_id, language, title, excerpt, content, meta_title, meta_description, meta_keywords) VALUES
('blog-001', 'es',
 'El 85% de las manzanas europeas contienen mÃºltiples pesticidas: Â¿por quÃ© la producciÃ³n limpia ya no es opcional?',
 'Un estudio de PAN Europe analiza 59 muestras de manzanas en 13 paÃ­ses y encuentra que el 85% presenta residuos de mÃ¡s de un pesticida simultÃ¡neamente. El llamado "efecto cÃ³ctel" preocupa a cientÃ­ficos y reguladores porque su riesgo combinado aÃºn no se evalÃºa.',
 '<p>La ONG Pesticide Action Network Europe (PAN Europe), en colaboraciÃ³n con otras 13 entidades europeas, ha analizado 59 muestras de manzanas de producciÃ³n local procedentes de 13 paÃ­ses, entre ellos EspaÃ±a, y ha encontrado que el <strong>85% presentaba residuos de mÃ¡s de un pesticida a la vez</strong>.</p>

<p>SegÃºn los resultados, cada manzana contenÃ­a una media de <strong>tres pesticidas diferentes</strong>, aunque algunas llegaban a tener hasta siete simultÃ¡neamente. En total, el 93% de las manzanas estudiadas tenÃ­an presencia de al menos un pesticida.</p>

<h2>El mapa europeo de la contaminaciÃ³n</h2>

<p>El porcentaje de manzanas con residuos mÃºltiples varÃ­a significativamente entre paÃ­ses. En ocho estados, <em>todas</em> las manzanas analizadas tenÃ­an residuos de varios pesticidas al tiempo. En EspaÃ±a, Francia e Italia, era el 80% el que presentaba contaminaciÃ³n mÃºltiple. Los dos paÃ­ses con menor incidencia fueron Dinamarca (20%) y BÃ©lgica (50%).</p>

<p>El informe tambiÃ©n seÃ±ala que el <strong>71% de las manzanas analizadas estÃ¡n contaminadas con pesticidas que la UE ha clasificado como candidatos a la sustituciÃ³n</strong> por su alta toxicidad. El 36% tenÃ­a presencia de pesticidas neurotÃ³xicos y el 64% contenÃ­a pesticidas considerados PFAS â€”sustancias persistentes de larga vida ambientalâ€”.</p>

<h2>El "efecto cÃ³ctel": el riesgo que las autoridades no miden</h2>

<p>Carlos de Prada, responsable de Hogar sin tÃ³xicos, advirtiÃ³ que las autoridades solo evalÃºan el riesgo de cada pesticida de forma aislada, ignorando el <strong>"efecto cÃ³ctel"</strong>, que puede ser "muy superior" al de cada sustancia por separado. Esta omisiÃ³n regulatoria es especialmente preocupante para los mÃ¡s pequeÃ±os: <em>"Si se vendieran como alimento procesado para bebÃ©s, el 93% de las muestras no estarÃ­an permitidas"</em>, seÃ±ala el informe.</p>

<h2>Â¿QuÃ© dice la normativa internacional?</h2>

<p>Los LÃ­mites MÃ¡ximos de Residuos (LMR) son el mecanismo regulador que define hasta quÃ© nivel de contaminaciÃ³n quÃ­mica es "tolerable" en un alimento. Sin embargo, el informe denuncia que incluso cuando se superan estos lÃ­mites o se detectan sustancias prohibidas, las autoridades nacionales y europeas no siempre actÃºan:</p>

<blockquote><em>"Si las autoridades reguladoras implementaran correctamente la ley, una serie de pesticidas detectados en las manzanas se habrÃ­an prohibido hace mucho tiempo. En cambio, la UE propone debilitar la protecciÃ³n de la salud con su propuesta Ã³mnibus sobre alimentos y piensos."</em> â€” Martin Dermine, director ejecutivo de PAN Europe.</blockquote>

<h2>La alternativa existe: producciÃ³n de residuo cero</h2>

<p>Lo que este estudio confirma es una realidad que en <strong>A&T BioNano</strong> llevamos aÃ±os trabajando para resolver: <strong>los biocidas quÃ­micos convencionales tienen fecha de caducidad</strong>, no solo por su toxicidad sino por la presiÃ³n regulatoria creciente a nivel global.</p>

<p>Nuestra tecnologÃ­a <strong>BIONANOAXUSÂ®</strong> opera exactamente en el espacio que los pesticidas convencionales no pueden ocupar:</p>

<ul>
  <li>âœ… <strong>Residuo cero</strong>: no deja trazas en anÃ¡lisis multiresiduos LMR</li>
  <li>âœ… <strong>AcciÃ³n mecÃ¡nica</strong>: actÃºa por ruptura fÃ­sica de la pared celular, sin inhibiciÃ³n metabÃ³lica</li>
  <li>âœ… <strong>Sin resistencia adaptativa</strong>: los patÃ³genos no pueden desarrollar inmunidad</li>
  <li>âœ… <strong>Inocuo</strong>: seguro para agricultores, consumidores y ecosistemas</li>
  <li>âœ… <strong>Cumple LMR</strong> de la UE, Asia y EEUU para acceso a mercados premium</li>
</ul>

<p>El informe de PAN Europe no es un caso aislado. Es la evidencia cientÃ­fica de que la industria agroalimentaria global <strong>necesita con urgencia una alternativa real a los pesticidas sintÃ©ticos</strong>. Esa alternativa ya existe.</p>

<p><strong>Â¿Quiere saber cÃ³mo BIONANOAXUSÂ® puede proteger su producciÃ³n sin comprometer el acceso a mercados internacionales? <a href="/store/bionanoaxus">Conozca nuestra soluciÃ³n aquÃ­.</a></strong></p>',
 'Residuos de Pesticidas en Manzanas Europa 2026 | A&T BioNano',
 'El 85% de manzanas europeas contienen mÃºltiples pesticidas. PAN Europe alerta sobre el efecto cÃ³ctel. Conozca la alternativa de residuo cero de A&T BioNano.',
 'pesticidas manzanas, LMR, residuo cero, bionanotecnologÃ­a, PAN Europe, BIONANOAXUS'
),
('blog-001', 'en',
 '85% of European apples contain multiple pesticides: why clean production is no longer optional',
 'A PAN Europe study analyzes 59 apple samples across 13 countries and finds that 85% show residues of more than one pesticide simultaneously. The so-called "cocktail effect" concerns scientists and regulators because its combined risk is not yet evaluated.',
 '<p>The NGO Pesticide Action Network Europe (PAN Europe), in collaboration with 13 other European organizations, analyzed 59 samples of locally produced apples from 13 countries, including Spain, and found that <strong>85% showed residues of more than one pesticide at the same time</strong>.</p>

<p>According to the results, each apple contained an average of <strong>three different pesticides</strong>, with some having up to seven simultaneously. In total, 93% of the apples studied contained at least one pesticide.</p>

<h2>The European contamination map</h2>

<p>The percentage of apples with multiple residues varies significantly between countries. In eight states, <em>all</em> apples analyzed had residues from several pesticides at once. In Spain, France and Italy, 80% showed multiple contamination. The two countries with the lowest rates were Denmark (20%) and Belgium (50%).</p>

<p>The report also notes that <strong>71% of the analyzed apples are contaminated with pesticides the EU has classified as candidates for substitution</strong> due to high toxicity. 36% contained neurotoxic pesticides and 64% contained PFAS â€” persistent, long-lived environmental substances.</p>

<h2>The "cocktail effect": the risk authorities do not measure</h2>

<p>Authorities only evaluate the risk of each pesticide in isolation, ignoring the <strong>"cocktail effect"</strong>, which may be "far greater" than any single substance. This regulatory gap is especially concerning for children: <em>"If sold as processed baby food, 93% of the apple samples analyzed would not be permitted,"</em> the report states.</p>

<h2>The zero-residue alternative already exists</h2>

<p>What this study confirms is a reality that <strong>A&T BioNano</strong> has been working to solve: <strong>conventional chemical biocides have an expiration date</strong>, not just due to toxicity but due to growing global regulatory pressure.</p>

<p>Our <strong>BIONANOAXUSÂ®</strong> technology operates precisely in the space conventional pesticides can no longer occupy:</p>

<ul>
  <li>âœ… <strong>Zero residue</strong>: leaves no traces in MRL multi-residue analyses</li>
  <li>âœ… <strong>Mechanical action</strong>: acts by physically disrupting the cell wall, no metabolic inhibition</li>
  <li>âœ… <strong>No adaptive resistance</strong>: pathogens cannot develop immunity</li>
  <li>âœ… <strong>Safe</strong>: for farmers, consumers and ecosystems</li>
  <li>âœ… <strong>MRL compliant</strong> â€” EU, Asia and USA â€” for premium market access</li>
</ul>

<p><strong>Want to know how BIONANOAXUSÂ® can protect your production without compromising international market access? <a href="/store/bionanoaxus">Learn more here.</a></strong></p>',
 'Pesticide Residues in European Apples 2026 | A&T BioNano',
 '85% of European apples contain multiple pesticides. PAN Europe warns about the cocktail effect. Discover A&T BioNano zero-residue alternative.',
 'apple pesticides, MRL, zero residue, bionanotechnology, PAN Europe, BIONANOAXUS'
);

INSERT IGNORE INTO blog_post_categories (post_id, category_id) VALUES
('blog-001', 'bcat-01'),
('blog-001', 'bcat-04');

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 20. FORMULARIOS DINÃMICOS (popup de salida + contacto)
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO forms (id, name, slug, title_es, title_en, subtitle_es, subtitle_en, image_url, fields, status) VALUES
('form-contact',
 'Formulario de Contacto',
 'contact',
 'ContÃ¡ctenos',
 'Contact Us',
 'Nuestro equipo cientÃ­fico responde en menos de 24 horas',
 'Our scientific team responds in less than 24 hours',
 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
 '[{"id":"cf1","name":"full_name","type":"text","label_es":"Nombre completo","label_en":"Full name","placeholder_es":"Tu nombre y apellido","placeholder_en":"Your full name","required":true},{"id":"cf2","name":"email","type":"email","label_es":"Correo electrÃ³nico","label_en":"Email address","placeholder_es":"tunombre@empresa.com","placeholder_en":"yourname@company.com","required":true},{"id":"cf3","name":"phone","type":"tel","label_es":"TelÃ©fono / WhatsApp","label_en":"Phone / WhatsApp","placeholder_es":"+57 300 000 0000","placeholder_en":"+1 000 000 0000","required":false},{"id":"cf4","name":"company","type":"text","label_es":"Empresa / OrganizaciÃ³n","label_en":"Company / Organization","placeholder_es":"Nombre de tu empresa","placeholder_en":"Your company name","required":false},{"id":"cf5","name":"sector","type":"select","label_es":"Sector de interÃ©s","label_en":"Sector of interest","required":true,"options_es":["Agroindustrial / Postcosecha","Flores","Pinturas y ConstrucciÃ³n","Empaques Alimentarios","Otro"],"options_en":["Agroindustrial / Post-harvest","Flowers","Paints and Construction","Food Packaging","Other"]},{"id":"cf6","name":"message","type":"textarea","label_es":"Mensaje o consulta","label_en":"Message or inquiry","placeholder_es":"Â¿Sobre quÃ© producto necesita informaciÃ³n? Â¿CuÃ¡l es su sector y volumen aproximado?","placeholder_en":"Which product do you need information about? What is your sector and approximate volume?","required":true}]',
 'active'),

('form-cotizacion',
 'Solicitud de CotizaciÃ³n',
 'cotizacion',
 'Solicitar CotizaciÃ³n',
 'Request a Quote',
 'CuÃ©ntenos su caso y le enviamos una propuesta tÃ©cnica personalizada',
 'Tell us about your case and we will send you a personalized technical proposal',
 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800',
 '[{"id":"qf1","name":"full_name","type":"text","label_es":"Nombre completo","label_en":"Full name","placeholder_es":"Tu nombre","placeholder_en":"Your name","required":true},{"id":"qf2","name":"email","type":"email","label_es":"Correo electrÃ³nico","label_en":"Email","placeholder_es":"correo@empresa.com","placeholder_en":"email@company.com","required":true},{"id":"qf3","name":"phone","type":"tel","label_es":"TelÃ©fono","label_en":"Phone","placeholder_es":"+57 300 000 0000","placeholder_en":"+1 000 000 0000","required":true},{"id":"qf4","name":"company","type":"text","label_es":"Empresa","label_en":"Company","placeholder_es":"Nombre de la empresa","placeholder_en":"Company name","required":true},{"id":"qf5","name":"volume","type":"select","label_es":"Volumen estimado","label_en":"Estimated volume","required":true,"options_es":["1 - 9 litros","10 - 49 litros","50 - 100 litros","MÃ¡s de 100 litros"],"options_en":["1 - 9 liters","10 - 49 liters","50 - 100 liters","More than 100 liters"]},{"id":"qf6","name":"sector","type":"select","label_es":"Sector","label_en":"Sector","required":true,"options_es":["Agroindustrial","Postcosecha","Flores","Pinturas / ConstrucciÃ³n","Empaques","Otro"],"options_en":["Agroindustrial","Post-harvest","Flowers","Paints / Construction","Packaging","Other"]},{"id":"qf7","name":"message","type":"textarea","label_es":"InformaciÃ³n adicional","label_en":"Additional information","placeholder_es":"Describa brevemente su proceso actual o el problema que quiere resolver","placeholder_en":"Briefly describe your current process or the problem you want to solve","required":false}]',
 'active'),

('form-exit-intent',
 'Exit Intent - Descarga Informe',
 'exit-intent',
 'Â¿Antes de irte, descarga nuestro informe?',
 'Before you leave, download our report?',
 'BionanotecnologÃ­a aplicada: residuo cero para la agroindustria global',
 'Applied bionanotechnology: zero residue for global agroindustry',
 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800',
 '[{"id":"ef1","name":"name","type":"text","label_es":"Nombre","label_en":"Name","placeholder_es":"Tu nombre...","placeholder_en":"Your name...","required":true},{"id":"ef2","name":"email","type":"email","label_es":"Email","label_en":"Email","placeholder_es":"Tu email...","placeholder_en":"Your email...","required":true}]',
 'active');

-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- 21. USUARIO ADMINISTRADOR
-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT IGNORE INTO users (id, name, email, password, role) VALUES (
  'admin-001',
  'Admin BioNano',
  'admin@bionano-ayt.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
);

-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
-- FIN DEL SEED COMPLETO âœ…
-- Contiene: site_settings, footer, 50 traducciones, 4 categorÃ­as,
-- BIONANOAXUSÂ® (ES/EN + precios), 6 pÃ¡ginas con secciones ES/EN,
-- Store con flipcards/clientes/products, 4 categorÃ­as blog,
-- 1 artÃ­culo completo (PAN Europe pesticidas), 3 formularios,
-- 3 miembros ecosistema, 2 pÃ¡ginas legales, 1 usuario admin.
-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES ('page-home', 'es', '[
  {
    "id": "home-hero",
    "type": "hero",
    "order": 0,
    "content": {
      "seo": {
        "metaTitle": "Bionano A&T | Soluciones Bionanotecnológicas",
        "metaKeywords": "bionanotecnología, BNX, antimicrobiano, fungicida, sostenible, nanotecnología",
        "metaDescription": "Bionanoaxus (BNX): Innovación en bionanotecnología para protección antimicrobiana y fungicida sostenible."
      },
      "title": "Bionanoaxus (BNX)",
      "ctaLink": "/store",
      "ctaText": "Explorar Catálogo",
      "subtitle": "La revolución bionanotecnológica que cuida su industria y el planeta. Soluciones antimicrobianas y fungicidas de origen orgánico con precisión atómica.",
      "backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1775964807642_edly1hf8t.webp?v=1775964811213",
      "secondaryCtaLink": "/technology",
      "secondaryCtaText": "Nuestra Tecnología"
    },
    "visible": true
  },
  {
    "id": "home-trust",
    "type": "trust",
    "order": 10,
    "content": {
      "partners": [
        {
          "link": "https://www.agrosavia.co",
          "name": "AGROSAVIA",
          "image": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&h=200&fit=crop",
          "details": [
            "Investigación aplicada en campo",
            "Validación de productos BNX",
            "Certificación agrícola nacional"
          ],
          "description": "Corporación colombiana de investigación agropecuaria. Aliado estratégico en validación de soluciones para el sector agrícola.",
          "placeholder": "Investigación Agrícola"
        },
        {
          "link": "https://www.procolombia.co",
          "name": "ProColombia",
          "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop",
          "details": [
            "Apoyo en mercados internacionales",
            "Red de distribución global",
            "Certificación de exportación"
          ],
          "description": "Entidad gubernamental que promueve el turismo, la inversión y las exportaciones de Colombia al mundo.",
          "placeholder": "Promoción Internacional"
        },
        {
          "link": "https://minciencias.gov.co",
          "name": "MinCiencias",
          "image": "https://ik.imagekit.io/wfm4vebzr/perfiles/avatares/avatar_user_default_1775966374482_895o48o2e.webp?v=1775966377623",
          "details": [
            "Financiación I+D+i",
            "Reconocimiento tecnológico",
            "Respaldo institucional"
          ],
          "description": "Ministerio de Ciencias que respalda la innovación tecnológica nacional, avalando la investigación de Bionano A&T.",
          "placeholder": "Ciencia & Innovación"
        },
        {
          "name": "BioTrade",
          "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&h=200&fit=crop",
          "details": [
            "Certificación de comercio justo",
            "Red de distribución orgánica",
            "Mercados premium"
          ],
          "description": "Red de comercio sostenible que certifica productos de origen biológico para mercados internacionales.",
          "placeholder": "Comercio Verde"
        },
        {
          "name": "AgroNet",
          "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=400&h=200&fit=crop",
          "details": [
            "Conectividad rural",
            "Difusión tecnológica",
            "Capacitación de productores"
          ],
          "description": "Plataforma integral de conexión agrícola que facilita el acceso de productores a tecnologías innovadoras.",
          "placeholder": "Red Agrícola"
        },
        {
          "name": "EcoInvest",
          "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop",
          "details": [
            "Capital semilla",
            "Mentoría empresarial",
            "Acceso a mercados"
          ],
          "description": "Fondo de inversión especializado en startups de biotecnología y economía circular.",
          "placeholder": "Inversión Verde"
        }
      ]
    },
    "visible": true
  },
  {
    "id": "home-purpose",
    "type": "features",
    "order": 20,
    "content": {
      "items": [
        {
          "icon": "Users",
          "title": "Misión",
          "description": "<p>Desarrollar soluciones bionanotecnológicas orgánicas que protejan cultivos, industrias y espacios, eliminando patógenos sin dañar el ecosistema ni la salud humana.</p>"
        },
        {
          "icon": "Target",
          "title": "Visión",
          "description": "Ser líderes globales en biotecnología sostenible para 2030, presentes en más de 50 países con productos certificados internacionalmente."
        },
        {
          "icon": "Lightbulb",
          "title": "Innovación",
          "description": "Combinamos nanotecnología de vanguardia con principios activos orgánicos para crear soluciones que la industria convencional no puede igualar."
        }
      ]
    },
    "visible": true
  },
  {
    "id": "home-featured",
    "type": "featured",
    "order": 30,
    "content": {
      "title": "Producto Estrella",
      "ctaLink": "/store",
      "ctaText": "Ver Detalles y Precios",
      "features": [
        {
          "icon": "Shield",
          "title": "Eficacia Comprobada",
          "description": "Elimina el 99.99% de bacterias, hongos y virus con una sola aplicación, avalado por estudios de laboratorio internacionales."
        },
        {
          "icon": "Leaf",
          "title": "100% Orgánico",
          "description": "Formulado con extractos naturales y nanopartículas biodegradables. No deja residuos tóxicos ni afecta la cadena alimentaria."
        },
        {
          "icon": "Droplets",
          "title": "Múltiples Aplicaciones",
          "description": "Válido para agricultura, industria alimentaria, hospitales, acuicultura y espacios públicos. Un producto, infinitas soluciones."
        }
      ],
      "productName": "Bionanoaxus (BNX)",
      "productImage": "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&fit=crop",
      "productDescription": "<p>Nuestra solución insignia de desinfección y protección antimicrobiana de última generación. Formulado con nanopartículas de plata orgánica y extractos botánicos activos, BNX ofrece una eficacia sin precedentes contra bacterias, hongos, virus y esporas, con impacto mínimo sobre el ecosistema.</p>"
    },
    "visible": true
  },
  {
    "id": "home-products",
    "type": "products",
    "order": 40,
    "content": {
      "title": "Soluciones para Cada Industria",
      "ctaLink": "/store",
      "ctaText": "Ver Catalogo completo",
      "subtitle": "Descubre nuestra gama completa de productos bionanotecnológicos, diseñados para satisfacer las necesidades específicas de cada sector productivo.",
      "selectedProductIds": [
        "prod-003",
        "prod-001",
        "prod-002"
      ]
    },
    "visible": true
  },
  {
    "id": "home-timeline",
    "type": "timeline",
    "order": 50,
    "content": {
      "title": "Nuestra Historia",
      "subtitle": "Una trayectoria de innovación constante",
      "milestones": [
        {
          "icon": "Lightbulb",
          "year": "2015",
          "title": "Fundación en Colombia",
          "description": "Nace Bionano A&T con la misión de democratizar la biotecnología sostenible en Latinoamérica."
        },
        {
          "icon": "FileCheck",
          "year": "2017",
          "title": "Primera Patente BNX",
          "description": "Registro de la primera patente de la fórmula Bionanoaxus ante la Superintendencia de Industria y Comercio."
        },
        {
          "icon": "TrendingUp",
          "year": "2019",
          "title": "Expansión Regional",
          "description": "Entrada a mercados de México, Perú y Ecuador, consolidando nuestra presencia en América Latina."
        },
        {
          "icon": "FileCheck",
          "year": "2021",
          "title": "Certificación Internacional",
          "description": "Obtención de certificaciones ISO 9001 y aprobación del USDA para exportación de productos orgánicos."
        },
        {
          "icon": "TrendingUp",
          "year": "2023",
          "title": "Alianzas Globales",
          "description": "Firma de acuerdos de distribución con socios en Europa y Asia, alcanzando presencia en 25 países."
        },
        {
          "icon": "Lightbulb",
          "year": "2025",
          "title": "Nueva Era Digital",
          "description": "Lanzamiento de la plataforma digital de pedidos B2B y el laboratorio de investigación de próxima generación."
        }
      ],
      "description": "<p>Desde nuestra fundación hemos recorrido un camino de investigación, validación y expansión global, construyendo la plataforma biotecnológica del futuro.</p>"
    },
    "visible": true
  },
  {
    "id": "home-team",
    "type": "team",
    "order": 60,
    "content": {
      "title": "Nuestros Líderes",
      "members": [
        {
          "name": "Dr. Carlos Andrade",
          "role": "CEO & Co-Fundador",
          "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        },
        {
          "name": "Dra. Sofía Ramírez",
          "role": "Directora Científica",
          "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        },
        {
          "name": "Ing. Ricardo Flores",
          "role": "Director de Operaciones",
          "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        },
        {
          "name": "Mgs. Valentina Cruz",
          "role": "Directora Comercial",
          "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        }
      ],
      "subtitle": "Un equipo multidisciplinario de científicos, ingenieros y expertos en negocios internacionales unidos por la pasión de transformar industrias a través de la biotecnología."
    },
    "visible": true
  },
  {
    "id": "home-ecosystem",
    "type": "ecosystem",
    "order": 70,
    "content": {
      "items": [
        {
          "desc": "Conectamos profesionales del sector biotecnológico y agroindustrial para crear sinergias de alto impacto.",
          "label": "Red de Innovadores",
          "title": "Red de Innovadores",
          "iconPath": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          "description": "Conectamos profesionales del sector biotecnológico y agroindustrial para crear sinergias de alto impacto."
        },
        {
          "desc": "Impulsamos el desarrollo responsable que equilibra la rentabilidad económica con el cuidado del planeta.",
          "label": "Crecimiento Sostenible",
          "title": "Crecimiento Sostenible",
          "iconPath": "",
          "description": "Impulsamos el desarrollo responsable que equilibra la rentabilidad económica con el cuidado del planeta."
        }
      ],
      "title": "Nuestro Ecosistema",
      "subtitle": "Conectamos innovadores, empresarios y profesionales para construir un ecosistema de negocios sostenible y tecnológico que impulse la economía verde."
    },
    "visible": true
  },
  {
    "id": "home-news",
    "type": "news",
    "order": 80,
    "content": {
      "title": "Noticias y Artículos",
      "subtitle": "Mantente al tanto de los últimos avances en bionanotecnología, sostenibilidad y los logros de Bionano A&amp;T."
    },
    "visible": true
  }
]');

INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES ('page-home', 'en', '[
  {
    "id": "home-hero",
    "type": "hero",
    "order": 0,
    "content": {
      "seo": {
        "metaTitle": "Bionano A&T | Bionanotechnological Solutions",
        "metaKeywords": "bionanotechnology, BNX, antimicrobial, fungicide, sustainable, nanotechnology",
        "metaDescription": "Bionanoaxus (BNX): Innovation in bionanotechnology for sustainable antimicrobial and fungicidal protection."
      },
      "title": "Bionanoaxus (BNX)",
      "ctaLink": "/store",
      "ctaText": "Explore Catalog",
      "subtitle": "The bionanotechnology revolution that protects your industry and the planet. Organic antimicrobial and fungicidal solutions with atomic precision.",
      "backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1775964807642_edly1hf8t.webp?v=1775964811213",
      "secondaryCtaLink": "/technology",
      "secondaryCtaText": "Our Technology"
    },
    "visible": true
  },
  {
    "id": "home-trust",
    "type": "trust",
    "order": 10,
    "content": {
      "partners": [
        {
          "link": "https://www.agrosavia.co",
          "name": "AGROSAVIA",
          "image": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&h=200&fit=crop",
          "details": [
            "Applied field research",
            "BNX product validation",
            "National agricultural certification"
          ],
          "description": "Colombian corporation for agricultural research. Strategic ally in validating solutions for the agricultural sector.",
          "placeholder": "Agricultural Research"
        },
        {
          "link": "https://www.procolombia.co",
          "name": "ProColombia",
          "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop",
          "details": [
            "International market support",
            "Global distribution network",
            "Export certification"
          ],
          "description": "Government entity promoting tourism, investment and Colombian exports worldwide.",
          "placeholder": "International Promotion"
        },
        {
          "link": "https://minciencias.gov.co",
          "name": "MinCiencias",
          "image": "https://ik.imagekit.io/wfm4vebzr/perfiles/avatares/avatar_user_default_1775966374482_895o48o2e.webp?v=1775966377623",
          "details": [
            "R&D financing",
            "Technological recognition",
            "Institutional support"
          ],
          "description": "Ministry of Sciences that supports national technological innovation, endorsing Bionano A&T research.",
          "placeholder": "Science & Innovation"
        },
        {
          "name": "BioTrade",
          "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&h=200&fit=crop",
          "details": [
            "Fair trade certification",
            "Organic distribution network",
            "Premium markets"
          ],
          "description": "Sustainable trade network certifying biological origin products for international markets.",
          "placeholder": "Green Trade"
        },
        {
          "name": "AgroNet",
          "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=400&h=200&fit=crop",
          "details": [
            "Rural connectivity",
            "Technology dissemination",
            "Producer training"
          ],
          "description": "Comprehensive agricultural connection platform facilitating producer access to innovative technologies.",
          "placeholder": "Agricultural Network"
        },
        {
          "name": "EcoInvest",
          "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop",
          "details": [
            "Seed capital",
            "Business mentoring",
            "Market access"
          ],
          "description": "Investment fund specialized in biotechnology startups and circular economy.",
          "placeholder": "Green Investment"
        }
      ]
    },
    "visible": true
  },
  {
    "id": "home-purpose",
    "type": "features",
    "order": 20,
    "content": {
      "items": [
        {
          "icon": "Users",
          "title": "Mission",
          "description": "Develop organic bionanotechnological solutions that protect crops, industries and spaces, eliminating pathogens without harming the ecosystem or human health."
        },
        {
          "icon": "Target",
          "title": "Vision",
          "description": "To be global leaders in sustainable biotechnology by 2030, present in more than 50 countries with internationally certified products."
        },
        {
          "icon": "Lightbulb",
          "title": "Innovation",
          "description": "We combine cutting-edge nanotechnology with organic active ingredients to create solutions that conventional industry cannot match."
        }
      ]
    },
    "visible": true
  },
  {
    "id": "home-featured",
    "type": "featured",
    "order": 30,
    "content": {
      "title": "Star Product",
      "ctaLink": "/store",
      "ctaText": "View Details & Pricing",
      "features": [
        {
          "icon": "Shield",
          "title": "Proven Efficacy",
          "description": "Eliminates 99.99% of bacteria, fungi and viruses with a single application, backed by international laboratory studies."
        },
        {
          "icon": "Leaf",
          "title": "100% Organic",
          "description": "Formulated with natural extracts and biodegradable nanoparticles. Leaves no toxic residues or food chain impact."
        },
        {
          "icon": "Droplets",
          "title": "Multiple Applications",
          "description": "Valid for agriculture, food industry, hospitals, aquaculture and public spaces. One product, infinite solutions."
        }
      ],
      "productName": "Bionanoaxus (BNX)",
      "productImage": "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&fit=crop",
      "productDescription": "<p>Our flagship next-generation antimicrobial disinfection and protection solution. Formulated with organic silver nanoparticles and active botanical extracts, BNX offers unprecedented efficacy against bacteria, fungi, viruses and spores, with minimal ecosystem impact.</p>"
    },
    "visible": true
  },
  {
    "id": "home-products",
    "type": "products",
    "order": 40,
    "content": {
      "title": "Solutions for Every Industry",
      "subtitle": "Discover our complete range of bionanotechnological products, designed to meet the specific needs of each productive sector.",
      "selectedProductIds": [
        "prod-003",
        "prod-001",
        "prod-002"
      ]
    },
    "visible": true
  },
  {
    "id": "home-timeline",
    "type": "timeline",
    "order": 50,
    "content": {
      "title": "Our History",
      "subtitle": "A journey of constant innovation",
      "milestones": [
        {
          "icon": "Lightbulb",
          "year": "2015",
          "title": "Founded in Colombia",
          "description": "Bionano A&T was born with the mission of democratizing sustainable biotechnology in Latin America."
        },
        {
          "icon": "FileCheck",
          "year": "2017",
          "title": "First BNX Patent",
          "description": "Registration of the first Bionanoaxus formula patent with the Superintendence of Industry and Commerce."
        },
        {
          "icon": "TrendingUp",
          "year": "2019",
          "title": "Regional Expansion",
          "description": "Entry into markets in Mexico, Peru and Ecuador, consolidating our presence in Latin America."
        },
        {
          "icon": "FileCheck",
          "year": "2021",
          "title": "International Certification",
          "description": "Obtaining ISO 9001 certifications and USDA approval for export of organic products."
        },
        {
          "icon": "TrendingUp",
          "year": "2023",
          "title": "Global Alliances",
          "description": "Signing distribution agreements with partners in Europe and Asia, reaching presence in 25 countries."
        },
        {
          "icon": "Lightbulb",
          "year": "2025",
          "title": "New Digital Era",
          "description": "Launch of the B2B digital ordering platform and the next-generation research laboratory."
        }
      ],
      "description": "Since our founding, we have traveled a path of research, validation and global expansion, building the biotechnological platform of the future."
    },
    "visible": true
  },
  {
    "id": "home-team",
    "type": "team",
    "order": 60,
    "content": {
      "title": "Our Leaders",
      "members": [
        {
          "name": "Dr. Carlos Andrade",
          "role": "CEO & Co-Founder",
          "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        },
        {
          "name": "Dr. Sofía Ramírez",
          "role": "Chief Science Officer",
          "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        },
        {
          "name": "Eng. Ricardo Flores",
          "role": "Chief Operating Officer",
          "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        },
        {
          "name": "Mgs. Valentina Cruz",
          "role": "Chief Commercial Officer",
          "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        }
      ],
      "subtitle": "A multidisciplinary team of scientists, engineers and international business experts united by the passion to transform industries through biotechnology."
    },
    "visible": true
  },
  {
    "id": "home-ecosystem",
    "type": "ecosystem",
    "order": 70,
    "content": {
      "items": [
        {
          "desc": "We connect professionals from the biotechnological and agroindustrial sector to create high-impact synergies.",
          "label": "Network of Innovators",
          "iconPath": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        },
        {
          "desc": "We promote responsible development that balances economic profitability with caring for the planet.",
          "label": "Sustainable Growth",
          "iconPath": ""
        }
      ],
      "title": "Our Ecosystem",
      "subtitle": "We connect innovators, entrepreneurs and professionals to build a sustainable and technological business ecosystem that drives the green economy."
    },
    "visible": true
  },
  {
    "id": "home-news",
    "type": "news",
    "order": 80,
    "content": {
      "title": "News & Articles",
      "subtitle": "Stay up to date with the latest advances in bionanotechnology, sustainability and Bionano A&T achievements."
    },
    "visible": true
  }
]');

INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES ('page-technology', 'es', '[{"id":"tech-hero","type":"hero","order":0,"content":{"seo":{"metaTitle":"Tecnología BNX | Bionano A&T","metaKeywords":"V-Lab, R-Tech, nanotecnología, antimicrobiano, fungicida, BNX","metaDescription":"Descubre la ciencia detrás de Bionanoaxus: nanopartículas orgánicas, V-Lab y R-Tech para protección antimicrobiana de nueva generación."},"title":"Tecnología Bionano A&T","ctaLink":"/store","ctaText":"Ver Nuestros Productos","subtitle":"Donde la ciencia molecular se convierte en soluciones reales. Desarrollamos bionanotecnología que transforma la forma en que el mundo protege sus cultivos, alimentos e industrias.","backgroundImage":"https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1775966716178_ajfz0mem9.webp?v=1775966719587","secondaryCtaLink":"6c2b8381-ad2e-43bb-a2c3-cce614eac317","secondaryCtaText":"Contactar Equipo","secondaryCtaActionType":"popup"},"visible":true},{"id":"tech-features","type":"features","order":1,"content":{"items":[{"icon":"Microscope","title":"V-Lab: Laboratorio Virtual","details":["Simulación molecular 3D de alta precisión","Predicción de eficacia por cepa patógena","Optimización de concentraciones sin ensayos físicos","Integración con bases de datos microbiológicas globales","Resultados reproducibles y auditables"],"description":"Plataforma de modelado molecular en tiempo real que simula el comportamiento de nanopartículas antes de su síntesis. Reducimos ciclos de desarrollo de meses a días."},{"icon":"Atom","title":"R-Tech: Nanorecubrimientos Inteligentes","details":["Adherencia certificada en metales, plásticos y textiles","Liberación controlada del agente activo por contacto","Resistencia a humedad, UV y temperatura extrema","Cobertura homogénea en superficies complejas","Compatible con sistemas de nebulización industrial"],"description":"Sistema propietario de recubrimiento superficial de larga duración con nanopartículas de plata orgánica. Un solo tratamiento protege hasta 12 meses sin reactivaciones."},{"icon":"Shield","title":"BNX: Fórmula Insignia","details":["Eficacia del 99.99% contra 47 cepas documentadas","Tiempo de acción: menos de 30 segundos en superficies","Biodegradación completa en menos de 72 horas","Sin residuos tóxicos en suelos ni agua","Certificado USDA, EPA y ANLA Colombia"],"description":"Formulación líquida de amplio espectro que elimina bacterias, virus, hongos y esporas en contacto, sin generar resistencias microbianas."},{"icon":"Leaf","title":"AgroBio: Protección Agrícola","details":["Compatible con agricultura orgánica certificada","Sin periodo de carencia para cosecha","Reducción del 60% en pérdidas por hongos postcosecha","Aplicación por goteo, foliar o nebulización","Probado en: banano, aguacate, cacao, tomate, fresa"],"description":"Línea específica para el sector agropecuario. Protege cultivos de alto valor comercial contra enfermedades fúngicas sin afectar la biodiversidad del suelo."}],"title":"Nuestra Plataforma Tecnológica","subtitle":"Cuatro pilares científicos que hacen de BNX la solución más avanzada del mercado"},"visible":true},{"id":"tech-stats","type":"stats","order":2,"content":{"stats":[{"label":"Eficacia Antimicrobiana","value":"99.99%","description":"Contra 47 cepas documentadas"},{"label":"Litros Producidos","value":"5M+","description":"Desde nuestra fundación"},{"label":"Países Activos","value":"25+","description":"Red de distribución global"},{"label":"Biodegradación","value":"72h","description":"Descomposición completa"}],"title":"Resultados que Hablan por Sí Solos","subtitle":"Diez años de investigación respaldados por datos reales"},"visible":true},{"id":"tech-bento","type":"bento","order":3,"content":{"items":[{"icon":"FlaskConical","size":"large","title":"I+D Continuo","details":["10 patentes registradas","Equipo de 25 investigadores"],"description":"Nuestro laboratorio nunca se detiene. Cada año lanzamos mejoras a la fórmula basadas en evidencia científica y retroalimentación de clientes en campo."},{"icon":"Globe","size":"normal","title":"Alcance Global","description":"Presentes en 25 países con red de distribución certificada."},{"icon":"Shield","size":"normal","title":"Certificaciones","details":["USDA Organic","EPA Registered","ISO 9001:2015"],"description":"USDA Organic, EPA registrado, ANLA Colombia, ISO 9001 y BPM vigentes."},{"icon":"Zap","size":"normal","title":"Acción Ultrarrápida","description":"Menos de 30 segundos para eliminar el 99.99% de los patógenos objetivo en superficie."},{"icon":"Leaf","size":"large","title":"Cero Impacto Ambiental","details":["Biodegradación total en 72h","Sin bioacumulación"],"description":"Primer desinfectante industrial con huella de carbono negativa, 100% biodegradable y sin acumulación en cadenas tróficas."}],"title":"¿Por Qué Elegirnos?","subtitle":"Ventajas diferenciales que nos posicionan como la tecnología número uno en el mercado"},"visible":true},{"id":"tech-quote","type":"quote","order":4,"content":{"role":"Corporación AgroAndes — Export Division","image":"https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop","quote":"Bionanoaxus no solo resolvió nuestro problema de contaminación fúngica, transformó completamente nuestra cadena de poscosecha. Las pérdidas se redujeron un 58% en el primer ciclo.","author":"Gerente de Operaciones"},"visible":true},{"id":"tech-history","type":"history","order":5,"content":{"title":"Una Década de Innovación","subtitle":"Los hitos que construyeron el futuro de la biotecnología sostenible","milestones":[{"icon":"Lightbulb","year":"2015","title":"Fundación en Medellín","description":"Nace Bionano A&T con un equipo de 5 investigadores y la misión de democratizar la biotecnología."},{"icon":"FileCheck","year":"2017","title":"Patente BNX V1.0","description":"Primera patente de la fórmula Bionanoaxus. Validación en 12 cepas patógenas con eficacia superior al 99%."},{"icon":"TrendingUp","year":"2019","title":"Primer Millón de Litros","description":"Superamos el primer millón de litros producidos. Presencia en Colombia, México, Perú y Ecuador."},{"icon":"FileCheck","year":"2021","title":"Certificación USDA & ISO","description":"Aprobación del USDA para exportación y certificación ISO 9001. Entrada al mercado europeo."},{"icon":"TrendingUp","year":"2023","title":"Expansión Global","description":"Operaciones en 25 países. Acuerdos de distribución con socios en Alemania, Japón y Brasil."},{"icon":"Lightbulb","year":"2025","title":"Era Digital BNX","description":"Lanzamiento de la plataforma B2B, V-Lab virtual y nueva línea AgroBio Premium."}],"description":"Cada año nos ha acercado más a nuestro objetivo: hacer de la biotecnología orgánica el estándar global de protección industrial."},"visible":true},{"id":"tech-faq","type":"faq","order":6,"content":{"items":[{"answer":"Las nanopartículas de plata orgánica de BNX actúan en múltiples frentes: penetran la membrana celular bacteriana, interfieren con la síntesis de ATP e inhiben la replicación del ADN. Esta acción triple impide que los microorganismos desarrollen resistencia, a diferencia de los antibióticos convencionales.","question":"¿Cuál es el mecanismo de acción de BNX contra bacterias?"},{"answer":"Sí. BNX está certificado por el USDA como producto orgánico y no requiere periodo de carencia antes de la cosecha. Sus componentes se biodegradam completamente en el suelo en menos de 72 horas, sin dejar residuos detestables por espectrometría de masas.","question":"¿Es seguro usar BNX cerca de cultivos para consumo humano?"},{"answer":"Los fungicidas químicos convencionales actúan sobre un único sitio de acción, lo que facilita el desarrollo de resistencia. BNX actúa simultáneamente sobre múltiples blancos moleculares, es biodegradable, no genera bioacumulación y no afecta organismos benéficos como polinizadores o microfauna del suelo.","question":"¿Qué diferencia a BNX de los fungicidas convencionales?"},{"answer":"Absolutamente. BNX es miscible en agua en cualquier proporción y no forma precipitados ni obstruye emisores de riego. Se recomienda aplicar entre 2 y 5 mL por litro según la concentración de patógenos objetivo identificados en el análisis de suelo.","question":"¿Se puede aplicar BNX en sistemas de riego por goteo?"},{"answer":"Los estudios de toxicidad oral realizados demuestran que BNX es prácticamente no tóxico en las concentraciones de uso (LD50 > 5000 mg/kg en modelos murinos). No obstante, no está formulado para consumo directo. En caso de ingestión, se recomienda beber agua abundante y contactar al médico.","question":"¿Qué pasa si se consume accidentalmente?"},{"answer":"En condiciones normales de uso industrial, R-Tech mantiene actividad antimicrobiana activa por un período de 6 a 12 meses, dependiendo de la frecuencia de limpieza, temperatura ambiente y exposición a luz UV directa. Se recomienda reaplicación anual en entornos de alta rotación.","question":"¿Cuánto tiempo dura la protección de R-Tech en superficies?"}],"title":"Preguntas Técnicas Frecuentes","subtitle":"Respuestas a las dudas más comunes sobre nuestra tecnología"},"visible":true},{"id":"tech-team","type":"team","order":7,"content":{"title":"El Equipo Científico","members":[{"name":"Dra. Sofía Ramírez","role":"Directora Científica","image":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"},{"name":"Dr. Manuel Herrera","role":"Jefe de Nanotecnología","image":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"},{"name":"Ing. Lucía Vargas","role":"Investigadora Senior BNX","image":"https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"}],"subtitle":"Investigadores y doctores especializados que dan vida a cada innovación de Bionano A&T."},"visible":true},{"id":"tech-process","type":"timeline","order":8,"content":{"title":"¿Cómo Funciona BNX?","subtitle":"Del laboratorio a su industria en cuatro pasos precisos","milestones":[{"desc":"Producimos nanopartículas de plata orgánica entre 1 y 20 nm, controlando forma y carga superficial para máxima eficacia.","step":"01","title":"Síntesis Nanomolecular"},{"desc":"Combinamos las nanopartículas con extractos vegetales activos (cúrcuma, neem, aloe) que potencian la acción antimicrobiana.","step":"02","title":"Activación Botánica"},{"desc":"Cada lote pasa pruebas de CMI y citotoxicidad antes de aprobarse para producción masiva.","step":"03","title":"Validación de Laboratorio"},{"desc":"El producto llega listo para usar via nebulización, aspersión o inmersión, adaptado a cada industria.","step":"04","title":"Aplicación Industrial"}],"description":"Nuestro proceso simplificado garantiza eficiencia."},"visible":true}]');

INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES ('page-technology', 'en', '[{"id":"tech-hero","type":"hero","order":0,"content":{"seo":{"metaTitle":"BNX Technology | Bionano A&T","metaKeywords":"V-Lab, R-Tech, nanotechnology, antimicrobial, fungicide, BNX","metaDescription":"Discover the science behind Bionanoaxus: organic nanoparticles, V-Lab and R-Tech for next-generation antimicrobial protection."},"title":"Bionano A&T Technology","ctaLink":"/store","ctaText":"View Our Products","subtitle":"Where molecular science becomes real solutions. We develop bionanotechnology that transforms how the world protects its crops, food and industries.","backgroundImage":"https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1775966716178_ajfz0mem9.webp?v=1775966719587","secondaryCtaLink":"6c2b8381-ad2e-43bb-a2c3-cce614eac317","secondaryCtaText":"Contact Team","secondaryCtaActionType":"popup"},"visible":true},{"id":"tech-features","type":"features","order":1,"content":{"items":[{"icon":"Microscope","title":"V-Lab: Virtual Laboratory","details":["High-precision 3D molecular simulation","Efficacy prediction per pathogen strain","Concentration optimization without physical trials","Integration with global microbiological databases","Reproducible and auditable results"],"description":"Real-time molecular modeling platform that simulates nanoparticle behavior before synthesis. We reduce development cycles from months to days."},{"icon":"Atom","title":"R-Tech: Smart Nanocoatings","details":["Adhesion certified on metals, plastics and textiles","Controlled release of active agent on contact","Resistance to humidity, UV and extreme temperature","Homogeneous coverage on complex surfaces","Compatible with industrial nebulization systems"],"description":"Proprietary long-duration surface coating system with organic silver nanoparticles. A single treatment protects up to 12 months."},{"icon":"Shield","title":"BNX: Flagship Formula","details":["99.99% efficacy against 47 documented strains","Action time: less than 30 seconds on surfaces","Complete biodegradation in less than 72 hours","No toxic residues in soil or water","USDA, EPA and ANLA Colombia certified"],"description":"Broad-spectrum liquid formulation that eliminates bacteria, viruses, fungi and spores on contact, without generating microbial resistance."},{"icon":"Leaf","title":"AgroBio: Agricultural Protection","details":["Compatible with certified organic agriculture","No waiting period before harvest","60% reduction in post-harvest fungal losses","Application by drip, foliar or nebulization","Tested on: banana, avocado, cocoa, tomato, strawberry"],"description":"Specific line for the agricultural sector. Protects high-value commercial crops against fungal diseases without affecting soil biodiversity."}],"title":"Our Technology Platform","subtitle":"Four scientific pillars that make BNX the most advanced solution in the market"},"visible":true},{"id":"tech-stats","type":"stats","order":2,"content":{"stats":[{"label":"Antimicrobial Efficacy","value":"99.99%","description":"Against 47 documented strains"},{"label":"Liters Produced","value":"5M+","description":"Since our founding"},{"label":"Active Countries","value":"25+","description":"Global distribution network"},{"label":"Biodegradation","value":"72h","description":"Complete decomposition"}],"title":"Results That Speak for Themselves","subtitle":"Ten years of research backed by real data"},"visible":true},{"id":"tech-bento","type":"bento","order":3,"content":{"items":[{"icon":"FlaskConical","size":"large","title":"Continuous R&D","details":["10 registered patents","Team of 25 researchers"],"description":"Our laboratory never stops. Every year we release formula improvements based on scientific evidence and field customer feedback."},{"icon":"Globe","size":"normal","title":"Global Reach","description":"Present in 25 countries with certified distribution network."},{"icon":"Shield","size":"normal","title":"Certifications","details":["USDA Organic","EPA Registered","ISO 9001:2015"],"description":"USDA Organic, EPA registered, ISO 9001 and GMP in force."},{"icon":"Zap","size":"normal","title":"Ultra-Fast Action","description":"Less than 30 seconds to eliminate 99.99% of target pathogens on surface."},{"icon":"Leaf","size":"large","title":"Zero Environmental Impact","details":["Full biodegradation in 72h","No bioaccumulation"],"description":"First industrial disinfectant with a negative carbon footprint, 100% biodegradable."}],"title":"Why Choose Us?","subtitle":"Differential advantages that position us as the number one technology in the market"},"visible":true},{"id":"tech-quote","type":"quote","order":4,"content":{"role":"AgroAndes Corporation — Export Division","image":"https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop","quote":"Bionanoaxus did not just solve our fungal contamination problem, it completely transformed our post-harvest chain. Losses were reduced by 58% in the first cycle.","author":"Operations Manager"},"visible":true},{"id":"tech-history","type":"history","order":5,"content":{"title":"A Decade of Innovation","subtitle":"The milestones that built the future of sustainable biotechnology","milestones":[{"icon":"Lightbulb","year":"2015","title":"Founded in Medellín","description":"Bionano A&T is born with a team of 5 researchers."},{"icon":"FileCheck","year":"2017","title":"BNX V1.0 Patent","description":"First Bionanoaxus formula patent. Validated on 12 pathogenic strains."},{"icon":"TrendingUp","year":"2019","title":"First Million Liters","description":"We surpassed one million liters produced. Presence in 4 countries."},{"icon":"FileCheck","year":"2021","title":"USDA & ISO Certification","description":"USDA approval for export and ISO 9001 certification."},{"icon":"TrendingUp","year":"2023","title":"Global Expansion","description":"Operations in 25 countries with partners in Germany, Japan and Brazil."},{"icon":"Lightbulb","year":"2025","title":"Digital BNX Era","description":"B2B platform launch, virtual V-Lab and new AgroBio Premium line."}],"description":"Each year has brought us closer to our goal: making organic biotechnology the global standard for industrial protection."},"visible":true},{"id":"tech-faq","type":"faq","order":6,"content":{"items":[{"answer":"BNX organic silver nanoparticles act on multiple fronts: they penetrate the bacterial cell membrane, interfere with ATP synthesis, and inhibit DNA replication. This triple action prevents microorganisms from developing resistance.","question":"What is the mechanism of action of BNX against bacteria?"},{"answer":"Yes. BNX is USDA certified as an organic product and requires no waiting period before harvest. Its components completely biodegrade in soil in less than 72 hours.","question":"Is it safe to use BNX near food crops?"},{"answer":"Conventional chemical fungicides act on a single site, facilitating resistance development. BNX acts simultaneously on multiple molecular targets, is biodegradable, and does not affect beneficial organisms like pollinators.","question":"What differentiates BNX from conventional fungicides?"},{"answer":"Absolutely. BNX is miscible in water in any proportion and does not form precipitates or clog irrigation emitters. Apply 2-5 mL per liter depending on pathogen concentration.","question":"Can BNX be applied in drip irrigation systems?"},{"answer":"Under normal industrial use conditions, R-Tech maintains active antimicrobial activity for 6 to 12 months, depending on cleaning frequency and UV exposure. Annual reapplication is recommended in high-rotation environments.","question":"How long does R-Tech protection last on surfaces?"}],"title":"Frequently Asked Technical Questions","subtitle":"Answers to the most common questions about our technology"},"visible":true},{"id":"tech-team","type":"team","order":7,"content":{"title":"The Scientific Team","members":[{"name":"Dr. Sofía Ramírez","role":"Chief Science Officer","image":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"},{"name":"Dr. Manuel Herrera","role":"Head of Nanotechnology","image":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"},{"name":"Eng. Lucía Vargas","role":"Senior BNX Researcher","image":"https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"}],"subtitle":"Researchers and specialized scientists who bring every Bionano A&T innovation to life."},"visible":true},{"id":"tech-process","type":"timeline","order":8,"content":{"title":"How Does BNX Work?","subtitle":"From laboratory to your industry in four precise steps","milestones":[{"desc":"We produce organic silver nanoparticles between 1 and 20 nm, controlling shape and surface charge for maximum efficacy.","step":"01","title":"Nanomolecular Synthesis"},{"desc":"We combine nanoparticles with active plant extracts (turmeric, neem, aloe) that synergistically enhance antimicrobial action.","step":"02","title":"Botanical Activation"},{"desc":"Each batch undergoes MIC tests and cytotoxicity studies before being approved for mass production.","step":"03","title":"Laboratory Validation"},{"desc":"The product arrives ready to use via nebulization, spraying or immersion, adapted to each industry.","step":"04","title":"Industrial Application"}]},"visible":true}]');

INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES ('page-processes', 'es', '[{"id":"proc-hero","type":"hero","order":0,"content":{"seo":{"metaTitle":"Procesos Industriales BNX | Bionano A&T","metaKeywords":"proceso industrial, BNX, desinfección industrial, protección antimicrobiana, bionanotecnología","metaDescription":"Descubre el proceso de implementación de Bionanoaxus BNX para proteger su industria: diagnóstico, diseño, aplicación y seguimiento certificado."},"badge":"Procesos Industriales","title":"Protección Total para su Industria","ctaLink":"#process-steps","ctaText":"Ver Nuestro Proceso","subtitle":"De la amenaza microbiana a la tranquilidad operativa en 4 etapas. Nuestro proceso certificado ha protegido más de 500 instalaciones industriales en 25 países.","backgroundImage":"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&fit=crop","secondaryCtaLink":"/#contact","secondaryCtaText":"Agendar Diagnóstico"},"visible":true},{"id":"proc-problems","type":"problems","order":1,"content":{"badge":"El Problema Real","items":[{"icon":"TrendingUp","stat":"40%","title":"Pérdidas en Cadena de Valor","statLabel":"pérdidas medias por contaminación","description":"La contaminación fúngica y bacteriana destruye entre el 15 y el 40% de la producción agrícola e industrial antes de llegar al mercado."},{"icon":"AlertTriangle","stat":"$2.8M","title":"Recalls y Sanciones Regulatorias","statLabel":"costo promedio de un recall","description":"Un brote de contaminación puede significar el retiro de toda una línea de producción y multas millonarias de organismos sanitarios."},{"icon":"Factory","stat":"73%","title":"Resistencia a Productos Convencionales","statLabel":"de cepas resistentes a desinfectantes","description":"Las bacterias y hongos desarrollan resistencia a los desinfectantes químicos en 3-6 meses de uso continuo, volviendo ineficaz la protección."},{"icon":"Microscope","stat":"68%","title":"Contaminación Cruzada Invisible","statLabel":"de brotes en superficies visualmente limpias","description":"El 68% de los brotes de contaminación ocurren en superficies aparentemente limpias que albergan biopelículas microbianas no visibles."},{"icon":"Globe","stat":"1 de 3","title":"Barreras a la Exportación","statLabel":"exportadores rechazados por estándares micro","description":"Compradores internacionales exigen certificaciones microbiológicas que muchas plantas no pueden garantizar con productos convencionales."},{"icon":"FileCheck","stat":"180+","title":"Cumplimiento Normativo Creciente","statLabel":"nuevas normas sanitarias en 2024","description":"Las regulaciones sanitarias internacionales son cada vez más estrictas. Quedarse atrás tiene consecuencias legales y comerciales devastadoras."}],"title":"¿Qué Está Costando la Contaminación a su Empresa?","subtitle":"La contaminación microbiana no detectada destruye silenciosamente la rentabilidad de miles de empresas cada año"},"visible":true},{"id":"proc-steps","type":"features","order":2,"content":{"badge":"Metodología Certificada","items":[{"icon":"Microscope","title":"Diagnóstico de Riesgo Microbiológico","result":"Informe de Riesgo Certificado","details":["Muestreo ambiental con hisopados en 50+ puntos","Análisis microbiológico en laboratorio acreditado","Identificación de cepas por espectrometría MALDI-TOF","Evaluación de biopelículas en superficies","Reporte con mapa de riesgo codificado por colores","Recomendaciones preventivas inmediatas"],"duration":"1 a 3 días hábiles","description":"Realizamos un levantamiento exhaustivo de su instalación mediante análisis de superficies, muestreo de aire y mapeo de puntos críticos de control. Identificamos exactamente qué patógenos están presentes y dónde se encuentran."},{"icon":"FlaskConical","title":"Diseño de Protocolo Personalizado","result":"Protocolo Certificado por Ingeniero","details":["Selección de la fórmula BNX adecuada al patógeno","Cálculo de concentración óptima por superficie","Diseño de cronograma de aplicación","Definición de EPP y medidas de seguridad","Plan de contingencia ante rebrotes","Documentación compatible con BPM / HACCP / ISO"],"duration":"2 a 5 días hábiles","description":"Con base en los resultados del diagnóstico, nuestro equipo científico formula un protocolo de tratamiento a la medida de su industria, producto y carga microbiana específica. No existe un tratamiento único para todos."},{"icon":"Factory","title":"Implementación Controlada","result":"Certificado de Aplicación con Sello BNX","details":["Nebulización en frío de ultra bajo volumen (ULV)","Cobertura de superficies difíciles y espacios aéreos","Control de dosificación con sensores digitales","Registro fotográfico y digital de cada zona","Aplicación en horarios de no producción","Sin necesidad de evacuar permanentemente"],"duration":"1 día a 2 semanas según instalación","description":"Nuestro equipo técnico certificado aplica el protocolo diseñado utilizando equipos de nebulización de última generación. Cada aplicación es documentada y registrada en tiempo real para trazabilidad completa."},{"icon":"TrendingUp","title":"Monitoreo y Seguimiento Continuo","result":"Protección Continua Garantizada","details":["Muestreos de verificación post-tratamiento","Dashboard digital con indicadores en tiempo real","Alertas automáticas ante anomalías microbiológicas","Ajuste del protocolo basado en nuevos datos","Informes de cumplimiento para auditorías","Soporte técnico prioritario 24/7"],"duration":"Programa mensual / trimestral","description":"La implementación no termina con la aplicación. Nuestro programa de seguimiento garantiza que la protección se mantenga en el tiempo mediante monitoreos periódicos y ajustes del protocolo según los resultados."}],"title":"Nuestro Proceso de 4 Etapas","subtitle":"Una metodología probada que garantiza resultados medibles desde la primera semana de implementación"},"visible":true},{"id":"proc-sectors","type":"sectors","order":3,"content":{"items":[{"icon":"Apple","title":"Agroindustria","description":"Protección de cultivos, postcosecha y procesado de alimentos frescos"},{"icon":"Warehouse","title":"Almacenamiento","description":"Silos, bodegas y cámaras de frío libres de patógenos fúngicos"},{"icon":"Factory","title":"Manufactura","description":"Líneas de producción que cumplen los estándares BPM y HACCP"},{"icon":"Fish","title":"Acuicultura","description":"Cultivos de camarón, tilapia y salmón con mínima mortalidad microbiana"},{"icon":"HeartPulse","title":"Salud & Hospitalario","description":"Ambientes clínicos libres de patógenos resistentes (MRSA, VRE)"},{"icon":"Sprout","title":"Agricultura Orgánica","description":"Protección certificada para exportación orgánica sin residuos"},{"icon":"Building2","title":"Hoteles & Turismo","description":"Ambientes seguros con protección invisible y continua"},{"icon":"Shirt","title":"Textil & Confección","description":"Telas antimicrobianas y protección de área de producción"}],"title":"Industrias que Protegemos","subtitle":"Nuestra metodología se adapta a los requisitos específicos de cada sector. Hemos trabajado con los estándares más exigentes del mundo."},"visible":true},{"id":"proc-timeline","type":"timeline","order":4,"content":{"title":"Cronograma de Implementación","subtitle":"De la primera llamada a la protección total: así fluye nuestro proceso","milestones":[{"desc":"Visita técnica y muestreo exhaustivo de su instalación","time":"Diagnóstico","phase":"Semana 1"},{"desc":"Protocolo personalizado listo y validado por ingeniería","time":"Diseño","phase":"Semana 2"},{"desc":"Implementación certificada con equipos ULV de última generación","time":"Aplicación","phase":"Semana 3"},{"desc":"Muestreo post-tratamiento y reporte de resultados","time":"Validación","phase":"Semana 4"},{"desc":"Monitoreo continuo y ajustes para mantener la protección","time":"Seguimiento","phase":"Mensual"}]},"visible":true},{"id":"proc-stats","type":"stats","order":5,"content":{"stats":[{"label":"Instalaciones Protegidas","value":"500+","description":"En 25 países de 4 continentes"},{"label":"Eficacia Promedio","value":"99.99%","description":"Medida en muestreos post-tratamiento"},{"label":"Reducción de Pérdidas","value":"58%","description":"Promedio en sector agroindustrial"},{"label":"Recalls por Contaminación","value":"0","description":"En clientes con programa continuo activo"}],"title":"Los Números No Mienten","subtitle":"Resultados reales medidos en las instalaciones de nuestros clientes activos"},"visible":true},{"id":"proc-certifications","type":"certifications","order":6,"content":{"items":[{"name":"USDA Organic","year":"2021","acronym":"USDA","description":"Certificación del Departamento de Agricultura de EE.UU. que avala que nuestros productos son aptos para uso en agricultura orgánica certificada para exportación."},{"name":"ISO 9001:2015","year":"2020","acronym":"ISO","description":"Certificación de Sistema de Gestión de Calidad que garantiza la consistencia y trazabilidad de cada lote producido y cada proceso de aplicación."},{"name":"EPA Registered","year":"2022","acronym":"EPA","description":"Registro ante la Agencia de Protección Ambiental de EE.UU. que confirma la seguridad ambiental del producto y su eficacia contra patógenos declarados."},{"name":"ANLA Colombia","year":"2018","acronym":"ANLA","description":"Autorización de la Autoridad Nacional de Licencias Ambientales de Colombia, certificando el bajo impacto ecológico del producto y su proceso de fabricación."},{"name":"Buenas Prácticas de Manufactura","year":"2019","acronym":"BPM","description":"Cumplimiento de las BPM exigidas por el INVIMA para la fabricación de productos de uso sanitario, asegurando calidad desde el origen."},{"name":"HACCP Compatible","year":"2021","acronym":"HACCP","description":"Nuestros procesos y productos son compatibles con los sistemas de Análisis de Peligros y Puntos Críticos de Control en la industria alimentaria."}],"title":"Respaldo Normativo Internacional","subtitle":"Nuestros procesos están certificados bajo los estándares más rigurosos del mundo, garantizando que su empresa cumpla con cualquier auditoría"},"visible":true},{"id":"proc-quote","type":"quote","order":7,"content":{"role":"Gerente de Producción — Finca El Progreso, Colombia","image":"https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop","quote":"Antes de BNX, perdíamos entre el 20 y 25% de nuestra producción de aguacate Hass por antracnosis en postcosecha. Después de implementar el protocolo, las pérdidas cayeron al 3%. El retorno de inversión fue evidente desde el segundo mes.","author":"Carlos Martínez"},"visible":true},{"id":"proc-faq","type":"faq","order":8,"content":{"items":[{"answer":"No necesariamente. En la mayoría de los casos, la aplicación se realiza en horarios de baja actividad (turnos nocturnos, fines de semana o pausas programadas). El tiempo de ventilación post-aplicación es entre 20 y 40 minutos dependiendo del tipo de espacio. Diseñamos el cronograma para minimizar el impacto en su operación.","question":"¿Necesito detener mi producción para implementar BNX?"},{"answer":"Los resultados microbiológicos se evidencian desde la primera aplicación. En los muestreos de verificación realizados entre 48 y 72 horas post-aplicación, la reducción de carga microbiana es del 99%+ en superficies tratadas. Los impactos en indicadores operativos (menores pérdidas, mayor vida útil del producto) se observan típicamente en el primer ciclo de producción completo.","question":"¿Cuánto tiempo pasa antes de ver resultados?"},{"answer":"BNX está específicamente diseñado para facilitar las auditorías, no complicarlas. Toda nuestra documentación (certificados de análisis, fichas técnicas, registros de aplicación, muestreos) está preparada en el formato que exigen INVIMA, FDA, BRC, SQF y otros organismos certificadores. Hemos acompañado a más de 80 empresas durante auditorías exitosas.","question":"¿Qué pasa si tenemos una auditoría sanitaria durante el proceso?"},{"answer":"El costo depende del tamaño de la instalación, la carga microbiana y el tipo de protocolo requerido. Trabajamos con modelos de pago flexible: aplicación única, programa mensual o contrato anual. En promedio, el costo del programa BNX representa solo el 3-8% de las pérdidas medias que evita. Solicite una cotización sin costo.","question":"¿Cuál es el costo aproximado de implementación?"},{"answer":"BNX es compatible con la mayoría de protocolos de limpieza estándar. Sin embargo, para maximizar su eficacia, recomendamos aplicarlo después de los procesos de limpieza y desinfección convencionales, no como sustituto de estos en la primera fase. Nuestro equipo evaluará su protocolo actual y le indicará la secuencia óptima.","question":"¿BNX es compatible con mis productos de limpieza actuales?"},{"answer":"Sí, todos nuestros planes incluyen soporte técnico. En el plan Continuo, disponemos de un ingeniero asignado a su cuenta, con acceso a dashboard en tiempo real, alertas automáticas por anomalías y retención de respuesta ante emergencias en menos de 4 horas durante días hábiles.","question":"¿Ofrecen soporte técnico continuo después de la implementación?"}],"title":"Preguntas Sobre el Proceso","ctaLink":"/#contact","ctaText":"¿Tiene más preguntas? Contáctenos","subtitle":"Todo lo que necesita saber antes de dar el primer paso"},"visible":true},{"id":"proc-cta","type":"cta","order":9,"content":{"icon":"Shield","emoji":"🛡️","title":"¿Listo para Proteger su Operación?","ctaLink":"/#contact","ctaText":"Solicitar Diagnóstico Gratuito","subtitle":"Solicite un diagnóstico gratuito. Nuestro equipo realizará un análisis preliminar de su instalación sin costo ni compromiso y le entregará un informe con los riesgos identificados.","secondaryCtaLink":"/store","secondaryCtaText":"Ver Nuestros Productos"},"visible":true}]');

INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES ('page-processes', 'en', '[{"id":"proc-hero","type":"hero","order":0,"content":{"seo":{"metaTitle":"Industrial Processes BNX | Bionano A&T","metaKeywords":"industrial process, BNX, industrial disinfection, antimicrobial protection, bionanotechnology","metaDescription":"Discover the implementation process of Bionanoaxus BNX to protect your industry: diagnosis, design, application and certified follow-up."},"badge":"Industrial Processes","title":"Total Protection for Your Industry","ctaLink":"#process-steps","ctaText":"See Our Process","subtitle":"From microbial threat to operational peace of mind in 4 stages. Our certified process has protected more than 500 industrial facilities in 25 countries.","backgroundImage":"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&fit=crop","secondaryCtaLink":"/#contact","secondaryCtaText":"Schedule a Diagnosis"},"visible":true},{"id":"proc-problems","type":"problems","order":1,"content":{"badge":"The Real Problem","items":[{"icon":"TrendingUp","stat":"40%","title":"Value Chain Losses","statLabel":"average losses from contamination","description":"Fungal and bacterial contamination destroys between 15 and 40% of agricultural and industrial production before reaching the market."},{"icon":"AlertTriangle","stat":"$2.8M","title":"Regulatory Recalls","statLabel":"average cost of a recall","description":"A contamination outbreak can mean the withdrawal of an entire production line and million-dollar fines from health regulators."},{"icon":"Factory","stat":"73%","title":"Resistance to Conventional Products","statLabel":"strains resistant to disinfectants","description":"Bacteria and fungi develop resistance to chemical disinfectants within 3-6 months of continuous use."},{"icon":"Microscope","stat":"68%","title":"Invisible Cross-Contamination","statLabel":"outbreaks on visually clean surfaces","description":"68% of contamination outbreaks occur on visually clean surfaces that harbor invisible microbial biofilms."},{"icon":"Globe","stat":"1 in 3","title":"Export Barriers","statLabel":"exporters rejected by micro standards","description":"International buyers require microbiological certifications that many plants cannot guarantee with conventional products."},{"icon":"FileCheck","stat":"180+","title":"Rising Regulatory Compliance","statLabel":"new sanitary regulations in 2024","description":"International sanitary regulations are increasingly strict. Falling behind has devastating legal and commercial consequences."}],"title":"What Is Contamination Costing Your Company?","subtitle":"Undetected microbial contamination silently destroys the profitability of thousands of companies every year"},"visible":true},{"id":"proc-steps","type":"features","order":2,"content":{"badge":"Certified Methodology","items":[{"icon":"Microscope","title":"Microbiological Risk Assessment","result":"Certified Risk Report","details":["Environmental swab sampling at 50+ points","Microbiological analysis at accredited laboratory","Strain identification by MALDI-TOF spectrometry","Biofilm evaluation on surfaces","Color-coded risk map report","Immediate preventive recommendations"],"duration":"1 to 3 business days","description":"We conduct a comprehensive survey of your facility through surface analysis, air sampling, and critical control point mapping. We identify exactly which pathogens are present and where they are located."},{"icon":"FlaskConical","title":"Custom Protocol Design","result":"Engineer-Certified Protocol","details":["BNX formula selection suited to pathogen","Optimal concentration calculation per surface","Application schedule design","PPE and safety measures definition","Contingency plan for re-outbreaks","Documentation compatible with GMP / HACCP / ISO"],"duration":"2 to 5 business days","description":"Based on diagnostic results, our scientific team formulates a treatment protocol tailored to your specific industry, product, and microbial load. There is no one-size-fits-all treatment."},{"icon":"Factory","title":"Controlled Implementation","result":"Application Certificate with BNX Seal","details":["Ultra low volume (ULV) cold nebulization","Coverage of hard-to-reach surfaces and air spaces","Dosage control with digital sensors","Photographic and digital record of each zone","Application during non-production hours","No permanent evacuation required"],"duration":"1 day to 2 weeks depending on facility","description":"Our certified technical team applies the designed protocol using state-of-the-art nebulization equipment. Each application is documented and recorded in real time for complete traceability."},{"icon":"TrendingUp","title":"Monitoring and Continuous Follow-up","result":"Guaranteed Continuous Protection","details":["Post-treatment verification sampling","Digital dashboard with real-time indicators","Automatic alerts for microbiological anomalies","Protocol adjustment based on new data","Compliance reports for audits","Priority 24/7 technical support"],"duration":"Monthly / quarterly program","description":"Implementation does not end with the application. Our follow-up program ensures protection is maintained over time through periodic monitoring and protocol adjustments based on results."}],"title":"Our 4-Stage Process","subtitle":"A proven methodology that guarantees measurable results from the first week of implementation"},"visible":true},{"id":"proc-sectors","type":"sectors","order":3,"content":{"items":[{"icon":"Apple","title":"Agroindustry","description":"Crop protection, post-harvest and fresh food processing"},{"icon":"Warehouse","title":"Storage","description":"Silos, warehouses and cold rooms free of fungal pathogens"},{"icon":"Factory","title":"Manufacturing","description":"Production lines meeting GMP and HACCP standards"},{"icon":"Fish","title":"Aquaculture","description":"Shrimp, tilapia and salmon farming with minimal microbial mortality"},{"icon":"HeartPulse","title":"Healthcare","description":"Clinical environments free of resistant pathogens (MRSA, VRE)"},{"icon":"Sprout","title":"Organic Agriculture","description":"Certified protection for organic export without residues"},{"icon":"Building2","title":"Hotels & Tourism","description":"Safe environments with invisible and continuous protection"},{"icon":"Shirt","title":"Textile & Apparel","description":"Antimicrobial fabrics and production area protection"}],"title":"Industries We Protect","subtitle":"Our methodology adapts to the specific requirements of each sector. We have worked with the most demanding standards in the world."},"visible":true},{"id":"proc-timeline","type":"timeline","order":4,"content":{"title":"Implementation Timeline","subtitle":"From the first call to total protection: this is how our process flows","milestones":[{"desc":"Technical visit and comprehensive sampling of your facility","time":"Diagnosis","phase":"Week 1"},{"desc":"Customized protocol ready and validated by engineering","time":"Design","phase":"Week 2"},{"desc":"Certified implementation with latest-gen ULV equipment","time":"Application","phase":"Week 3"},{"desc":"Post-treatment sampling and results report","time":"Validation","phase":"Week 4"},{"desc":"Continuous monitoring and adjustments to maintain protection","time":"Follow-up","phase":"Monthly"}]},"visible":true},{"id":"proc-stats","type":"stats","order":5,"content":{"stats":[{"label":"Protected Facilities","value":"500+","description":"In 25 countries across 4 continents"},{"label":"Average Efficacy","value":"99.99%","description":"Measured in post-treatment sampling"},{"label":"Loss Reduction","value":"58%","description":"Average in agroindustrial sector"},{"label":"Recalls from Contamination","value":"0","description":"In clients with active continuous program"}],"title":"The Numbers Do Not Lie","subtitle":"Real results measured at the facilities of our active clients"},"visible":true},{"id":"proc-certifications","type":"certifications","order":6,"content":{"items":[{"name":"USDA Organic","year":"2021","acronym":"USDA","description":"Certification from the U.S. Department of Agriculture validating that our products are suitable for use in certified organic agriculture for export."},{"name":"ISO 9001:2015","year":"2020","acronym":"ISO","description":"Quality Management System certification guaranteeing the consistency and traceability of each batch produced and each application process."},{"name":"EPA Registered","year":"2022","acronym":"EPA","description":"Registration with the U.S. Environmental Protection Agency confirming the environmental safety of the product and its efficacy against declared pathogens."},{"name":"ANLA Colombia","year":"2018","acronym":"ANLA","description":"Authorization from the National Environmental Licensing Authority of Colombia, certifying the low ecological impact of the product."},{"name":"Good Manufacturing Practices","year":"2019","acronym":"GMP","description":"GMP compliance required by INVIMA for the manufacture of sanitary use products, ensuring quality from the source."},{"name":"HACCP Compatible","year":"2021","acronym":"HACCP","description":"Our processes and products are compatible with Hazard Analysis and Critical Control Point systems in the food industry."}],"title":"International Regulatory Backing","subtitle":"Our processes are certified under the most rigorous standards in the world, ensuring your company can pass any audit"},"visible":true},{"id":"proc-quote","type":"quote","order":7,"content":{"role":"Production Manager — Finca El Progreso, Colombia","image":"https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop","quote":"Before BNX, we were losing between 20 and 25% of our Hass avocado production to post-harvest anthracnose. After implementing the protocol, losses dropped to 3%. The return on investment was evident from the second month.","author":"Carlos Martínez"},"visible":true},{"id":"proc-faq","type":"faq","order":8,"content":{"items":[{"answer":"Not necessarily. In most cases, application is done during low-activity hours (night shifts, weekends, or scheduled pauses). Post-application ventilation time is between 20 and 40 minutes depending on the space type. We design the schedule to minimize impact on your operation.","question":"Do I need to stop production to implement BNX?"},{"answer":"Microbiological results are evident from the first application. In verification samples taken 48-72 hours post-application, the reduction in microbial load is 99%+ on treated surfaces. Impacts on operational indicators are typically observed in the first complete production cycle.","question":"How long before I see results?"},{"answer":"BNX is specifically designed to facilitate audits, not complicate them. All our documentation is ready in the format required by FDA, BRC, SQF and other certification bodies. We have accompanied over 80 companies through successful audits.","question":"What if we have a health audit during the process?"},{"answer":"Cost depends on facility size, microbial load and required protocol type. We work with flexible payment models: single application, monthly program or annual contract. On average, the BNX program cost represents only 3-8% of the average losses it prevents.","question":"What is the approximate cost of implementation?"},{"answer":"BNX is compatible with most standard cleaning protocols. However, to maximize efficacy, we recommend applying it after conventional cleaning and disinfection processes. Our team will evaluate your current protocol and indicate the optimal sequence.","question":"Is BNX compatible with my current cleaning products?"},{"answer":"Yes, all our plans include technical support. In the Continuous plan, we have an engineer assigned to your account, with access to a real-time dashboard, automatic anomaly alerts, and emergency response in less than 4 hours on business days.","question":"Do you offer continuous technical support after implementation?"}],"title":"Questions About the Process","ctaLink":"/#contact","ctaText":"Have more questions? Contact us","subtitle":"Everything you need to know before taking the first step"},"visible":true},{"id":"proc-cta","type":"cta","order":9,"content":{"icon":"Shield","emoji":"🛡️","title":"Ready to Protect Your Operation?","ctaLink":"/#contact","ctaText":"Request Free Diagnosis","subtitle":"Request a free diagnosis. Our team will conduct a preliminary analysis of your facility at no cost or commitment and deliver a report with identified risks.","secondaryCtaLink":"/store","secondaryCtaText":"View Our Products"},"visible":true}]');

INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES ('page-blog', 'es', '[{"id": "blog-hero-section","type": "hero-blog","order": 100,"content": {"badge": "Blog","title": "Actualidad y Ciencia","subtitle": "Explora las últimas innovaciones en bioseguridad, nanotecnología y desarrollo sostenible.","backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1776047672996_x214zn12o.webp?v=1776047682724"},"visible": true},{"id": "blog-posts-section","type": "blog-posts","order": 1000,"content": {},"visible": true}]');

INSERT IGNORE INTO page_contents (page_id, language, sections) VALUES ('page-blog', 'en', '[{"id": "blog-hero-section","type": "hero-blog","order": 100,"content": {"badge": "Blog","title": "News & Science","subtitle": "Explore the latest innovations in biosecurity, nanotechnology, and sustainable development.","backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1776047672996_x214zn12o.webp?v=1776047682724"},"visible": true},{"id": "blog-posts-section","type": "blog-posts","order": 1000,"content": {},"visible": true}]');
