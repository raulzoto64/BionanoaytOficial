import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function initDatabase() {
  console.log('Inicializando base de datos Supabase...');

  try {
    // 1. Borrar todos los datos existentes
    console.log('Borrando datos existentes...');
    const tables = ['page_contents', 'pages', 'product_translations', 'products', 'prices_by_quantity', 'category_translations', 'categories', 'translations', 'site_settings', 'users'];
    
    for (const table of tables) {
      console.log(`Borrando datos de ${table}...`);
      const { error } = await supabase.from(table).delete().neq('id', 'nonexistent');
      if (error) {
        console.warn(`Advertencia: No se pudieron borrar datos de ${table}:`, error.message);
      } else {
        console.log(`Datos de ${table} borrados exitosamente`);
      }
    }

    // 2. Insertar configuración predeterminada
    console.log('Insertando configuración del sitio...');
    const { error: settingsError } = await supabase
      .from('site_settings')
      .upsert({
        id: 'settings-001',
        site_name: 'A&T BioNano',
        site_email: 'contacto@atbionano.com',
        site_phone: '+57 300 123 4567',
        site_address: 'Calle 123 #45-67, Bogotá, Colombia',
        social_media: {
          facebook: 'https://facebook.com/atbionano',
          twitter: 'https://twitter.com/atbionano',
          instagram: 'https://instagram.com/atbionano',
          linkedin: 'https://linkedin.com/company/atbionano'
        },
        seo: {
          defaultTitle: 'A&T BioNano - Innovación en Bionanotecnología',
          defaultDescription: 'Desarrollamos soluciones antimicrobianas y fungicidas sostenibles con nanotecnología avanzada',
          defaultKeywords: 'bionanotecnología, antimicrobianos, fungicidas, nanotecnología, sostenibilidad'
        },
        colors: {
          primary: '#1C5D15',
          secondary: '#629960',
          accent: '#19FF00',
          background: '#F7F9CE'
        }
      });

    if (settingsError) {
      console.error('Error al insertar configuración:', settingsError);
    } else {
      console.log('Configuración insertada exitosamente');
    }

    // 3. Insertar categorías predeterminadas
    console.log('Insertando categorías...');
    const { error: categoriesError } = await supabase
      .from('categories')
      .upsert([
        { id: 'cat-001', slug: 'antimicrobianos', parent_id: null, icon: 'Shield', order: 1, status: 'active' },
        { id: 'cat-002', slug: 'limpieza-industrial', parent_id: null, icon: 'Sparkles', order: 2, status: 'active' },
        { id: 'cat-003', slug: 'fertilizantes', parent_id: null, icon: 'Leaf', order: 3, status: 'active' },
        { id: 'cat-004', slug: 'fungicidas', parent_id: null, icon: 'Bug', order: 4, status: 'active' }
      ]);

    if (categoriesError) {
      console.error('Error al insertar categorías:', categoriesError);
    } else {
      console.log('Categorías insertadas exitosamente');
    }

    // 4. Insertar traducciones de categorías
    console.log('Insertando traducciones de categorías...');
    const { error: categoryTranslationsError } = await supabase
      .from('category_translations')
      .upsert([
        { category_id: 'cat-001', language: 'es', name: 'Antimicrobianos', description: 'Productos antimicrobianos de amplio espectro' },
        { category_id: 'cat-001', language: 'en', name: 'Antimicrobials', description: 'Broad-spectrum antimicrobial products' },
        { category_id: 'cat-002', language: 'es', name: 'Limpieza Industrial', description: 'Limpiadores de alto rendimiento' },
        { category_id: 'cat-002', language: 'en', name: 'Industrial Cleaning', description: 'High-performance cleaners' },
        { category_id: 'cat-003', language: 'es', name: 'Fertilizantes', description: 'Fertilizantes nanotecnológicos' },
        { category_id: 'cat-003', language: 'en', name: 'Fertilizers', description: 'Nanotechnological fertilizers' },
        { category_id: 'cat-004', language: 'es', name: 'Fungicidas', description: 'Soluciones contra hongos' },
        { category_id: 'cat-004', language: 'en', name: 'Fungicides', description: 'Solutions against fungi' }
      ]);

    if (categoryTranslationsError) {
      console.error('Error al insertar traducciones de categorías:', categoryTranslationsError);
    } else {
      console.log('Traducciones de categorías insertadas exitosamente');
    }

    // 5. Insertar productos predeterminados
    console.log('Insertando productos...');
    const { error: productsError } = await supabase
      .from('products')
      .upsert([
        { id: 'prod-001', slug: 'bionanoaxus-bnx', category: 'cat-001', status: 'active', image: 'https://images.unsplash.com/photo-1576834976341-53b1b975c6f9?w=800' },
        { id: 'prod-002', slug: 'z-klean-limpiador', category: 'cat-002', status: 'active', image: 'https://images.unsplash.com/photo-1580053234218-74eb4ae03a44?w=800' },
        { id: 'prod-003', slug: 'nanofert-plus', category: 'cat-003', status: 'active', image: 'https://images.unsplash.com/photo-1601839215170-6ce5854968d6?w=800' },
        { id: 'prod-004', slug: 'bioshield-spray', category: 'cat-001', status: 'active', image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800' }
      ]);

    if (productsError) {
      console.error('Error al insertar productos:', productsError);
    } else {
      console.log('Productos insertados exitosamente');
    }

    // 6. Insertar traducciones de productos
    console.log('Insertando traducciones de productos...');
    const { error: productTranslationsError } = await supabase
      .from('product_translations')
      .upsert([
        {
          product_id: 'prod-001',
          language: 'es',
          name: 'Bionanoaxus (BNX)',
          description: 'Bionanoaxus es nuestro producto estrella, un antimicrobiano revolucionario que utiliza nanotecnología de última generación para eliminar bacterias, virus y hongos. Su fórmula única ofrece protección duradera y es completamente segura para el medio ambiente.',
          short_description: 'Antimicrobiano de amplio espectro con nanotecnología avanzada',
          features: ["Tecnología de nanopartículas de plata", "Eficacia 99.9% contra microorganismos", "Biodegradable y eco-friendly", "Sin residuos tóxicos", "Protección de larga duración"],
          benefits: ["Reduce enfermedades transmitidas por microorganismos", "Seguro para uso en contacto con alimentos", "No genera resistencia microbiana", "Aplicación versátil en múltiples superficies", "Contribuye a la sostenibilidad ambiental"],
          technical_specs: {"Composición": "Nanopartículas de plata coloidal", "Concentración": "20-50 ppm", "pH": "6.5 - 7.5", "Densidad": "1.01 g/ml", "Vida útil": "24 meses", "Almacenamiento": "Temperatura ambiente, protegido de luz directa"},
          meta_title: 'Bionanoaxus - Antimicrobiano Nanotecnológico | A&T BioNano',
          meta_description: 'Descubre Bionanoaxus, el antimicrobiano más avanzado con nanotecnología. Eficacia 99.9%, biodegradable y seguro.'
        },
        {
          product_id: 'prod-001',
          language: 'en',
          name: 'Bionanoaxus (BNX)',
          description: 'Bionanoaxus is our flagship product, a revolutionary antimicrobial that uses state-of-the-art nanotechnology to eliminate bacteria, viruses, and fungi. Its unique formula offers long-lasting protection and is completely safe for the environment.',
          short_description: 'Broad-spectrum antimicrobial with advanced nanotechnology',
          features: ["Silver nanoparticle technology", "99.9% efficacy against microorganisms", "Biodegradable and eco-friendly", "No toxic residues", "Long-lasting protection"],
          benefits: ["Reduces microorganism-transmitted diseases", "Safe for food contact use", "Does not generate microbial resistance", "Versatile application on multiple surfaces", "Contributes to environmental sustainability"],
          technical_specs: {"Composition": "Colloidal silver nanoparticles", "Concentration": "20-50 ppm", "pH": "6.5 - 7.5", "Density": "1.01 g/ml", "Shelf life": "24 months", "Storage": "Room temperature, protected from direct light"},
          meta_title: 'Bionanoaxus - Nanotechnological Antimicrobial | A&T BioNano',
          meta_description: 'Discover Bionanoaxus, the most advanced antimicrobial with nanotechnology. 99.9% efficacy, biodegradable and safe.'
        },
        {
          product_id: 'prod-002',
          language: 'es',
          name: 'Z-Klean Limpiador Industrial',
          description: 'Z-Klean es un limpiador industrial revolucionario que combina el poder de la nanotecnología con ingredientes biodegradables para ofrecer una limpieza profunda y efectiva sin dañar el medio ambiente.',
          short_description: 'Limpiador de alto rendimiento con nanotecnología',
          features: ["Formulación con nanotecnología", "Desengrasante de alta potencia", "Biodegradable 100%", "No corrosivo", "Libre de fosfatos"],
          benefits: ["Limpieza profunda en superficies industriales", "Reduce tiempo de limpieza en 40%", "Seguro para operarios", "Versatilidad en múltiples aplicaciones", "Reduce costos operativos"],
          technical_specs: {"Tipo": "Limpiador alcalino", "pH": "11.5 - 12.5", "Dilución": "1:10 a 1:50", "Temperatura aplicación": "20-40°C", "Vida útil": "18 meses", "Presentación": "1L, 5L, 20L"},
          meta_title: 'Z-Klean - Limpiador Industrial Nanotecnológico | A&T BioNano',
          meta_description: 'Z-Klean, limpiador industrial con nanotecnología. Biodegradable, alta potencia y seguro.'
        },
        {
          product_id: 'prod-002',
          language: 'en',
          name: 'Z-Klean Industrial Cleaner',
          description: 'Z-Klean is a revolutionary industrial cleaner that combines the power of nanotechnology with biodegradable ingredients to offer deep and effective cleaning without harming the environment.',
          short_description: 'High-performance cleaner with nanotechnology',
          features: ["Nanotechnology formulation", "High-power degreaser", "100% biodegradable", "Non-corrosive", "Phosphate-free"],
          benefits: ["Deep cleaning on industrial surfaces", "Reduces cleaning time by 40%", "Safe for operators", "Versatility in multiple applications", "Reduces operating costs"],
          technical_specs: {"Type": "Alkaline cleaner", "pH": "11.5 - 12.5", "Dilution": "1:10 to 1:50", "Application temperature": "20-40°C", "Shelf life": "18 months", "Presentation": "1L, 5L, 20L"},
          meta_title: 'Z-Klean - Nanotechnological Industrial Cleaner | A&T BioNano',
          meta_description: 'Z-Klean, industrial cleaner with nanotechnology. Biodegradable, high power and safe.'
        },
        {
          product_id: 'prod-003',
          language: 'es',
          name: 'NanoFert Plus',
          description: 'NanoFert Plus es un fertilizante de nueva generación que utiliza nanotecnología para optimizar la absorción de nutrientes por las plantas. Su sistema de liberación controlada garantiza un suministro constante y eficiente.',
          short_description: 'Fertilizante nanométrico de liberación controlada',
          features: ["Nanoencapsulación de nutrientes", "Liberación controlada", "Mayor absorción foliar", "Mejora la salud del suelo", "Compatible con agricultura orgánica"],
          benefits: ["Aumenta rendimiento de cultivos hasta 35%", "Reduce consumo de fertilizantes en 50%", "Mejora calidad de frutos", "Menor impacto ambiental", "Resultados visibles en 7 días"],
          technical_specs: {"NPK": "12-10-8 + Micronutrientes", "Tamaño partícula": "20-100 nm", "Solubilidad": "Alta", "Aplicación": "Foliar o radicular", "Dosis": "2-5 ml/L", "Compatibilidad": "pH 5.5-7.5"},
          meta_title: 'NanoFert Plus - Fertilizante Nanotecnológico | A&T BioNano',
          meta_description: 'NanoFert Plus, fertilizante con nanotecnología de liberación controlada. Aumenta rendimiento hasta 35%.'
        },
        {
          product_id: 'prod-003',
          language: 'en',
          name: 'NanoFert Plus',
          description: 'NanoFert Plus is a next-generation fertilizer that uses nanotechnology to optimize nutrient absorption by plants. Its controlled release system ensures a constant and efficient supply.',
          short_description: 'Controlled-release nanometric fertilizer',
          features: ["Nutrient nanoencapsulation", "Controlled release", "Enhanced foliar absorption", "Improves soil health", "Compatible with organic farming"],
          benefits: ["Increases crop yield up to 35%", "Reduces fertilizer consumption by 50%", "Improves fruit quality", "Lower environmental impact", "Visible results in 7 days"],
          technical_specs: {"NPK": "12-10-8 + Micronutrients", "Particle size": "20-100 nm", "Solubility": "High", "Application": "Foliar or root", "Dosage": "2-5 ml/L", "Compatibility": "pH 5.5-7.5"},
          meta_title: 'NanoFert Plus - Nanotechnological Fertilizer | A&T BioNano',
          meta_description: 'NanoFert Plus, fertilizer with controlled-release nanotechnology. Increases yield up to 35%.'
        },
        {
          product_id: 'prod-004',
          language: 'es',
          name: 'BioShield Spray',
          description: 'BioShield Spray es la solución perfecta para protección inmediata contra microorganisms. Su formato en spray permite aplicación rápida y uniforme en cualquier superficie.',
          short_description: 'Protección antimicrobiana en aerosol',
          features: ["Aplicación en aerosol", "Secado rápido", "Sin olor residual", "Efecto antimicrobiano inmediato", "Portátil y práctico"],
          benefits: ["Ideal para uso doméstico y profesional", "Protege superficies de alto contacto", "Fácil aplicación", "No mancha ni deja residuos", "Seguro para toda la familia"],
          technical_specs: {"Volumen": "250 ml, 500 ml", "Tiempo de acción": "30 segundos", "Cobertura": "2 m² por segundo", "Durabilidad": "Hasta 24 horas", "Ingrediente activo": "Nanopartículas de plata", "Tipo": "Aerosol no inflamable"},
          meta_title: 'BioShield Spray - Protección Antimicrobiana Rápida | A&T BioNano',
          meta_description: 'BioShield Spray, protección antimicrobiana instantánea en formato aerosol. Seguro y efectivo.'
        },
        {
          product_id: 'prod-004',
          language: 'en',
          name: 'BioShield Spray',
          description: 'BioShield Spray is the perfect solution for immediate protection against microorganisms. Its spray format allows quick and uniform application on any surface.',
          short_description: 'Antimicrobial protection spray',
          features: ["Spray application", "Fast drying", "No residual odor", "Immediate antimicrobial effect", "Portable and practical"],
          benefits: ["Ideal for domestic and professional use", "Protects high-touch surfaces", "Easy application", "Does not stain or leave residues", "Safe for the whole family"],
          technical_specs: {"Volume": "250 ml, 500 ml", "Action time": "30 seconds", "Coverage": "2 m² per second", "Durability": "Up to 24 hours", "Active ingredient": "Silver nanoparticles", "Type": "Non-flammable aerosol"},
          meta_title: 'BioShield Spray - Fast Antimicrobial Protection | A&T BioNano',
          meta_description: 'BioShield Spray, instant antimicrobial protection in aerosol format. Safe and effective.'
        }
      ]);

    if (productTranslationsError) {
      console.error('Error al insertar traducciones de productos:', productTranslationsError);
    } else {
      console.log('Traducciones de productos insertadas exitosamente');
    }

    // 7. Insertar precios por cantidad
    console.log('Insertando precios por cantidad...');
    const { error: pricesError } = await supabase
      .from('prices_by_quantity')
      .upsert([
        { id: 'price-001', product_id: 'prod-001', min_quantity: 1, max_quantity: 5, price_per_unit: 45000, currency: 'COP' },
        { id: 'price-002', product_id: 'prod-001', min_quantity: 6, max_quantity: 20, price_per_unit: 40000, currency: 'COP' },
        { id: 'price-003', product_id: 'prod-001', min_quantity: 21, max_quantity: 50, price_per_unit: 35000, currency: 'COP' },
        { id: 'price-004', product_id: 'prod-001', min_quantity: 51, max_quantity: null, price_per_unit: 30000, currency: 'COP' },
        { id: 'price-005', product_id: 'prod-002', min_quantity: 1, max_quantity: 10, price_per_unit: 35000, currency: 'COP' },
        { id: 'price-006', product_id: 'prod-002', min_quantity: 11, max_quantity: 30, price_per_unit: 32000, currency: 'COP' },
        { id: 'price-007', product_id: 'prod-002', min_quantity: 31, max_quantity: null, price_per_unit: 28000, currency: 'COP' },
        { id: 'price-008', product_id: 'prod-003', min_quantity: 1, max_quantity: 10, price_per_unit: 55000, currency: 'COP' },
        { id: 'price-009', product_id: 'prod-003', min_quantity: 11, max_quantity: 25, price_per_unit: 50000, currency: 'COP' },
        { id: 'price-010', product_id: 'prod-003', min_quantity: 26, max_quantity: null, price_per_unit: 45000, currency: 'COP' },
        { id: 'price-011', product_id: 'prod-004', min_quantity: 1, max_quantity: 12, price_per_unit: 25000, currency: 'COP' },
        { id: 'price-012', product_id: 'prod-004', min_quantity: 13, max_quantity: 50, price_per_unit: 22000, currency: 'COP' },
        { id: 'price-013', product_id: 'prod-004', min_quantity: 51, max_quantity: null, price_per_unit: 18000, currency: 'COP' }
      ]);

    if (pricesError) {
      console.error('Error al insertar precios:', pricesError);
    } else {
      console.log('Precios insertados exitosamente');
    }

    // 8. Insertar páginas predeterminadas
    console.log('Insertando páginas...');
    const { error: pagesError } = await supabase
      .from('pages')
      .upsert([
        { id: 'page-home', slug: 'home', type: 'system', status: 'published' },
        { id: 'page-technology', slug: 'technology', type: 'system', status: 'published' },
        { id: 'page-process', slug: 'process', type: 'system', status: 'published' }
      ]);

    if (pagesError) {
      console.error('Error al insertar páginas:', pagesError);
    } else {
      console.log('Páginas insertadas exitosamente');
    }

    // 9. Insertar contenido de páginas con secciones y SEO - Contenido real desde los componentes
    console.log('Insertando contenido de páginas...');
    const { error: pageContentsError } = await supabase
      .from('page_contents')
      .upsert([
        {
          page_id: 'page-home',
          language: 'es',
          sections: [
            {
              id: 'sec-hero',
              type: 'hero',
              order: 1,
              visible: true,
              content: {
                title: 'Innovación y desarrollo de productos de base Bionanotecnológica',
                subtitle: 'Soluciones sostenibles diseñadas y manufacturadas en Colombia para revolucionar la industria',
                ctaText: 'Conoce nuestra tecnología patentada',
                ctaLink: '#technology',
                backgroundImage: 'https://images.unsplash.com/photo-1676313414325-2a877a95dd10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYW5vdGVjaG5vbG9neSUyMG1pY3Jvc2NvcGUlMjBzdHJ1Y3R1cmVzJTIwbGFib3JhdG9yeXxlbnwxfHx8fDE3NzAzOTE2NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
                seo: {
                  metaTitle: 'A&T BioNano - Innovación en Bionanotecnología',
                  metaDescription: 'Desarrollamos soluciones antimicrobianas y fungicidas sostenibles con nanotecnología avanzada',
                  metaKeywords: 'bionanotecnología, antimicrobianos, fungicidas, nanotecnología, sostenibilidad'
                }
              }
            },
            {
              id: 'sec-trust',
              type: 'trust',
              order: 2,
              visible: true,
              content: {
                title: 'Respaldados por',
                partners: [
                  { name: "MinCiencias", placeholder: "MC", image: "https://images.unsplash.com/photo-1612165469953-69b4bc7eedbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwYnVpbGRpbmclMjBvZmZpY2lhbHxlbnwxfHx8fDE3NzA0MTA0NTB8MA&ixlib=rb-4.1.0&q=80&w=1080" },
                  { name: "Ruta N", placeholder: "RN", image: "https://images.unsplash.com/photo-1762075314732-c8abb7ea446d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc2NpZW5jZSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MDQxMDQ0OXww&ixlib=rb-4.1.0&q=80&w=1080" },
                  { name: "SENA", placeholder: "SENA", image: "https://images.unsplash.com/photo-1614308457932-e16d85c5d053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwcmVzZWFyY2glMjBtaWNyb3Njb3BlfGVufDF8fHx8MTc3MDQxMDQ0OXww&ixlib=rb-4.1.0&q=80&w=1080" },
                  { name: "Tecnnova", placeholder: "TN", image: "https://images.unsplash.com/photo-1769147555720-71fc71bfc216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaG9zcGl0YWwlMjBtb2Rlcm58ZW58MXx8fHwxNzcwMzg5MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080" },
                  { name: "Tecnova", placeholder: "TV", image: "https://images.unsplash.com/photo-1762075314732-c8abb7ea446d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc2NpZW5jZSUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3MDQxMDQ0OXww&ixlib=rb-4.1.0&q=80&w=1080" }
                ]
              }
            },
            {
              id: 'sec-purpose',
              type: 'features',
              order: 3,
              visible: true,
              content: {
                title: 'Nuestro Propósito',
                items: [
                  { icon: 'Users', title: '¿Quiénes somos?', description: 'Empresa de base tecnológica dedicada a rutas verdes y amigables con el medio ambiente.' },
                  { icon: 'Target', title: '¿Qué hacemos?', description: 'Resolución de contaminación por microorganismos (hongos, virus y bacterias) mediante experticia científica.' },
                  { icon: 'Lightbulb', title: '¿Cómo lo hacemos?', description: 'Proveedores líderes de nanocompuestos para Latinoamérica.' }
                ],
                seo: {
                  metaTitle: 'Nuestro Propósito - A&T BioNano',
                  metaDescription: 'Descubre nuestro propósito de innovar en bionanotecnología para un futuro sostenible',
                  metaKeywords: 'propósito, innovación, sostenibilidad, excelencia'
                }
              }
            },
            {
              id: 'sec-featured',
              type: 'featured',
              order: 4,
              visible: true,
              content: {
                title: 'Producto Estrella',
                productName: 'Bionanoaxus',
                productDescription: 'Producto con nanotecnología antimicrobiana y fungicida',
                features: [
                  { icon: 'Shield', title: 'Protección Avanzada', description: 'Alternativa sostenible a químicos tradicionales' },
                  { icon: 'Leaf', title: 'Ecológico', description: 'Minimizando impacto en animales y personas' },
                  { icon: 'Droplets', title: 'Eficacia Comprobada', description: 'Tecnología patentada con resultados verificables' }
                ],
                productImage: 'https://images.unsplash.com/photo-1758685734156-3c5d35bae1d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWJvcmF0b3J5JTIwZ3JlZW4lMjBjaGVtaXN0cnklMjBmbGFza3xlbnwxfHx8fDE3NzAzOTE2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
                ctaText: 'Ver Catálogo de Productos',
                ctaLink: '/store'
              }
            },
            {
              id: 'sec-products',
              type: 'products',
              order: 5,
              visible: true,
              content: {
                title: 'Productos Más Demandados',
                subtitle: 'Soluciones bionanotecnológicas innovadoras para diferentes industrias',
                products: [
                  {
                    id: 'prod-001',
                    slug: 'bionanoaxus-bnx',
                    name: 'Bionanoaxus (BNX)',
                    category: 'Antimicrobiano Premium',
                    description: 'Nanotecnología antimicrobiana y fungicida de amplio espectro para aplicaciones industriales y comerciales.',
                    image: 'https://images.unsplash.com/photo-1576834976341-53b1b975c6f9?w=800',
                    features: [
                      'Eficacia comprobada 99.9%',
                      'Tecnología patentada',
                      'Acción prolongada',
                      'Amigable con el medio ambiente'
                    ],
                    popular: true
                  },
                  {
                    id: 'prod-002',
                    slug: 'z-klean-limpiador',
                    name: 'Z-Klean',
                    category: 'Limpieza Industrial',
                    description: 'Solución ecológica para limpieza y desinfección de superficies con nanocompuestos activos.',
                    image: 'https://images.unsplash.com/photo-1580053234218-74eb4ae03a44?w=800',
                    features: [
                      'Biodegradable',
                      'Sin químicos agresivos',
                      'Aplicación versátil',
                      'Certificado ecológico'
                    ],
                    popular: false
                  },
                  {
                    id: 'prod-003',
                    slug: 'nanofert-plus',
                    name: 'NanoFert Plus',
                    category: 'Protección Agrícola',
                    description: 'Formulación especializada para protección de cultivos contra hongos y bacterias patógenas.',
                    image: 'https://images.unsplash.com/photo-1601839215170-6ce5854968d6?w=800',
                    features: [
                      'Apto para agricultura orgánica',
                      'Resistencia prolongada',
                      'No fitotóxico',
                      'Aumenta productividad'
                    ],
                    popular: false
                  }
                ]
              }
            },
            {
              id: 'sec-timeline',
              type: 'timeline',
              order: 6,
              visible: true,
              content: {
                title: 'Nuestra Trayectoria',
                milestones: [
                  { year: '2019', title: 'Concepción de la idea', description: 'Innovación con propósito', icon: 'Lightbulb' },
                  { year: '2021', title: 'Registro de Patente', description: 'Sostenibilidad y liderazgo tecnológico', icon: 'FileCheck' },
                  { year: '2024-2025', title: 'Venta y escalabilidad comercial', description: 'BNX y Z-Klean', icon: 'TrendingUp' }
                ]
              }
            },
            {
              id: 'sec-team',
              type: 'team',
              order: 7,
              visible: true,
              content: {
                title: 'Nuestro Equipo',
                subtitle: 'Fundada por dos mujeres visionarias comprometidas con la Agenda 2030',
                members: [
                  { name: 'Ana Elisa Casas Botero', role: 'CEO', image: 'https://images.unsplash.com/photo-1754715203698-70c7ad3a879d?w=1080' },
                  { name: 'Tatiana G. Pineda Vasquez', role: 'Gerente de proyectos, Co-Founder', image: 'https://images.unsplash.com/photo-1727299781147-c7ab897883a0?w=1080' },
                  { name: 'Juan Pablo Barrera Rúa', role: 'Ingeniero I+D', image: 'https://images.unsplash.com/photo-1740485863716-8e1851b6d474?w=1080' }
                ]
              }
            },
            {
              id: 'sec-ecosystem',
              type: 'ecosystem',
              order: 8,
              visible: true,
              content: {
                title: 'Ecosistema y Aliados',
                allies: [
                  { name: 'Capiro', sector: 'Agrícola', initials: 'CP', slug: 'capiro' },
                  { name: 'Coatings', sector: 'Recubrimientos', initials: 'CT', slug: 'coatings' },
                  { name: 'Cecoltec', sector: 'Tecnología', initials: 'CL', slug: 'cecoltec' },
                  { name: 'BioTech Solutions', sector: 'Biotecnología', initials: 'BTS', slug: 'biotech-solutions' },
                  { name: 'Green Industries', sector: 'Sostenibilidad', initials: 'GI', slug: 'green-industries' }
                ]
              }
            },
            {
              id: 'sec-footer',
              type: 'contact',
              order: 9,
              visible: true,
              content: {
                title: 'Contáctanos',
                contactInfo: {
                  phone: '+57 305 460 22 46',
                  email: 'aytbionano@gmail.com',
                  location: 'Colombia'
                }
              }
            }
          ]
        },
        {
          page_id: 'page-home',
          language: 'en',
          sections: [
            {
              id: 'sec-hero',
              type: 'hero',
              order: 1,
              visible: true,
              content: {
                title: 'Innovation and development of bionanotechnology-based products',
                subtitle: 'Sustainable solutions designed and manufactured in Colombia to revolutionize the industry',
                ctaText: 'Learn about our patented technology',
                ctaLink: '#technology',
                backgroundImage: 'https://images.unsplash.com/photo-1676313414325-2a877a95dd10?w=1080',
                seo: {
                  metaTitle: 'A&T BioNano - Innovation in Bionanotechnology',
                  metaDescription: 'We develop sustainable antimicrobial and fungicidal solutions with advanced nanotechnology',
                  metaKeywords: 'bionanotechnology, antimicrobials, fungicides, nanotechnology, sustainability'
                }
              }
            },
            {
              id: 'sec-trust',
              type: 'trust',
              order: 2,
              visible: true,
              content: {
                title: 'Backed by',
                partners: [
                  { name: "MinCiencias", placeholder: "MC", image: "https://images.unsplash.com/photo-1612165469953-69b4bc7eedbf?w=1080" },
                  { name: "Ruta N", placeholder: "RN", image: "https://images.unsplash.com/photo-1762075314732-c8abb7ea446d?w=1080" },
                  { name: "SENA", placeholder: "SENA", image: "https://images.unsplash.com/photo-1614308457932-e16d85c5d053?w=1080" },
                  { name: "Tecnnova", placeholder: "TN", image: "https://images.unsplash.com/photo-1769147555720-71fc71bfc216?w=1080" },
                  { name: "Tecnova", placeholder: "TV", image: "https://images.unsplash.com/photo-1762075314732-c8abb7ea446d?w=1080" }
                ]
              }
            },
            {
              id: 'sec-purpose',
              type: 'features',
              order: 3,
              visible: true,
              content: {
                title: 'Our Purpose',
                items: [
                  { icon: 'Users', title: 'Who are we?', description: 'Technology-based company dedicated to green and environmentally friendly routes.' },
                  { icon: 'Target', title: 'What do we do?', description: 'Resolution of contamination by microorganisms (fungi, viruses and bacteria) through scientific expertise.' },
                  { icon: 'Lightbulb', title: 'How do we do it?', description: 'Leading nanocomposite suppliers for Latin America.' }
                ],
                seo: {
                  metaTitle: 'Our Purpose - A&T BioNano',
                  metaDescription: 'Discover our purpose of innovating in bionanotechnology for a sustainable future',
                  metaKeywords: 'purpose, innovation, sustainability, excellence'
                }
              }
            },
            {
              id: 'sec-featured',
              type: 'featured',
              order: 4,
              visible: true,
              content: {
                title: 'Featured Product',
                productName: 'Bionanoaxus',
                productDescription: 'Product with antimicrobial and fungicidal nanotechnology',
                features: [
                  { icon: 'Shield', title: 'Advanced Protection', description: 'Sustainable alternative to traditional chemicals' },
                  { icon: 'Leaf', title: 'Eco-friendly', description: 'Minimizing impact on animals and people' },
                  { icon: 'Droplets', title: 'Proven Efficacy', description: 'Patented technology with verifiable results' }
                ],
                productImage: 'https://images.unsplash.com/photo-1758685734156-3c5d35bae1d1?w=1080',
                ctaText: 'View Product Catalog',
                ctaLink: '/store'
              }
            },
            {
              id: 'sec-products',
              type: 'products',
              order: 5,
              visible: true,
              content: {
                title: 'Most Demanded Products',
                subtitle: 'Innovative bionanotechnological solutions for different industries',
                products: [
                  {
                    id: 'prod-001',
                    slug: 'bionanoaxus-bnx',
                    name: 'Bionanoaxus (BNX)',
                    category: 'Premium Antimicrobial',
                    description: 'Broad-spectrum antimicrobial and fungicidal nanotechnology for industrial and commercial applications.',
                    image: 'https://images.unsplash.com/photo-1576834976341-53b1b975c6f9?w=800',
                    features: [
                      '99.9% proven efficacy',
                      'Patented technology',
                      'Long-lasting action',
                      'Environmentally friendly'
                    ],
                    popular: true
                  },
                  {
                    id: 'prod-002',
                    slug: 'z-klean-limpiador',
                    name: 'Z-Klean',
                    category: 'Industrial Cleaning',
                    description: 'Ecological solution for cleaning and disinfection of surfaces with active nanocomposites.',
                    image: 'https://images.unsplash.com/photo-1580053234218-74eb4ae03a44?w=800',
                    features: [
                      'Biodegradable',
                      'No aggressive chemicals',
                      'Versatile application',
                      'Eco-certified'
                    ],
                    popular: false
                  },
                  {
                    id: 'prod-003',
                    slug: 'nanofert-plus',
                    name: 'NanoFert Plus',
                    category: 'Agricultural Protection',
                    description: 'Specialized formulation for protection of crops against pathogenic fungi and bacteria.',
                    image: 'https://images.unsplash.com/photo-1601839215170-6ce5854968d6?w=800',
                    features: [
                      'Organic agriculture approved',
                      'Prolonged resistance',
                      'Non-phytotoxic',
                      'Increases productivity'
                    ],
                    popular: false
                  }
                ]
              }
            },
            {
              id: 'sec-timeline',
              type: 'timeline',
              order: 6,
              visible: true,
              content: {
                title: 'Our Journey',
                milestones: [
                  { year: '2019', title: 'Conception of the idea', description: 'Innovation with purpose', icon: 'Lightbulb' },
                  { year: '2021', title: 'Patent Registration', description: 'Sustainability and technological leadership', icon: 'FileCheck' },
                  { year: '2024-2025', title: 'Sales and commercial scalability', description: 'BNX and Z-Klean', icon: 'TrendingUp' }
                ]
              }
            },
            {
              id: 'sec-team',
              type: 'team',
              order: 7,
              visible: true,
              content: {
                title: 'Our Team',
                subtitle: 'Founded by two visionary women committed to Agenda 2030',
                members: [
                  { name: 'Ana Elisa Casas Botero', role: 'CEO', image: 'https://images.unsplash.com/photo-1754715203698-70c7ad3a879d?w=1080' },
                  { name: 'Tatiana G. Pineda Vasquez', role: 'Project Manager, Co-Founder', image: 'https://images.unsplash.com/photo-1727299781147-c7ab897883a0?w=1080' },
                  { name: 'Juan Pablo Barrera Rúa', role: 'R&D Engineer', image: 'https://images.unsplash.com/photo-1740485863716-8e1851b6d474?w=1080' }
                ]
              }
            },
            {
              id: 'sec-ecosystem',
              type: 'ecosystem',
              order: 8,
              visible: true,
              content: {
                title: 'Ecosystem and Allies',
                allies: [
                  { name: 'Capiro', sector: 'Agriculture', initials: 'CP', slug: 'capiro' },
                  { name: 'Coatings', sector: 'Coatings', initials: 'CT', slug: 'coatings' },
                  { name: 'Cecoltec', sector: 'Technology', initials: 'CL', slug: 'cecoltec' },
                  { name: 'BioTech Solutions', sector: 'Biotechnology', initials: 'BTS', slug: 'biotech-solutions' },
                  { name: 'Green Industries', sector: 'Sustainability', initials: 'GI', slug: 'green-industries' }
                ]
              }
            },
            {
              id: 'sec-footer',
              type: 'contact',
              order: 9,
              visible: true,
              content: {
                title: 'Contact Us',
                contactInfo: {
                  phone: '+57 305 460 22 46',
                  email: 'aytbionano@gmail.com',
                  location: 'Colombia'
                }
              }
            }
          ]
        },
        {
          page_id: 'page-technology',
          language: 'es',
          sections: [
            {
              id: 'sec-hero',
              type: 'hero',
              order: 1,
              visible: true,
              content: {
                title: 'Nuestra Tecnología',
                subtitle: 'Desarrollamos soluciones antimicrobianas basadas en bionanotecnología de vanguardia, combinando ciencia de punta con sostenibilidad ambiental.',
                ctaText: 'Contactar a nuestro equipo',
                ctaLink: '/#contact',
                backgroundImage: '',
                seo: {
                  metaTitle: 'Nuestra Tecnología - A&T BioNano',
                  metaDescription: 'Conoce las tecnologías bionanotecnológicas que desarrollamos para resolver problemas de contaminación',
                  metaKeywords: 'tecnología, bionanotecnología, nanotecnología, innovación'
                }
              }
            },
            {
              id: 'sec-technologies',
              type: 'features',
              order: 2,
              visible: true,
              content: {
                title: 'Tecnologías',
                items: [
                  { 
                    icon: 'Microscope', 
                    title: 'Nanotecnología Avanzada', 
                    description: 'Utilizamos nanopartículas de última generación con tamaños entre 1-100 nanómetros para máxima efectividad antimicrobiana.',
                    details: [
                      'Síntesis controlada de nanopartículas',
                      'Caracterización mediante TEM y DLS',
                      'Estabilidad coloidal garantizada'
                    ]
                  },
                  { 
                    icon: 'Atom', 
                    title: 'Biocompatibilidad', 
                    description: 'Nuestros productos son diseñados para ser seguros con el medio ambiente y los seres vivos, manteniendo alta eficacia.',
                    details: [
                      'Certificaciones de seguridad',
                      'Biodegradabilidad comprobada',
                      'Sin efectos citotóxicos'
                    ]
                  },
                  { 
                    icon: 'Shield', 
                    title: 'Acción Antimicrobiana', 
                    description: 'Amplio espectro de acción contra bacterias, hongos y virus con eficacia comprobada del 99.9%.',
                    details: [
                      'Mecanismo de acción múltiple',
                      'Resistencia prolongada',
                      'Sin generación de resistencia'
                    ]
                  },
                  { 
                    icon: 'Leaf', 
                    title: 'Sostenibilidad', 
                    description: 'Comprometidos con el desarrollo sostenible mediante procesos de síntesis verde y materiales renovables.',
                    details: [
                      'Química verde',
                      'Reducción de huella de carbono',
                      'Economía circular'
                    ]
                  }
                ]
              }
            },
            {
              id: 'sec-process',
              type: 'timeline',
              order: 3,
              visible: true,
              content: {
                title: 'Proceso de Desarrollo',
                subtitle: 'De la investigación al producto final',
                milestones: [
                  { step: '01', title: 'Investigación', description: 'Estudios científicos y pruebas de laboratorio' },
                  { step: '02', title: 'Desarrollo', description: 'Formulación y optimización de productos' },
                  { step: '03', title: 'Validación', description: 'Ensayos clínicos y certificaciones' },
                  { step: '04', title: 'Producción', description: 'Manufactura bajo estándares ISO' }
                ]
              }
            }
          ]
        },
        {
          page_id: 'page-technology',
          language: 'en',
          sections: [
            {
              id: 'sec-hero',
              type: 'hero',
              order: 1,
              visible: true,
              content: {
                title: 'Our Technology',
                subtitle: 'We develop antimicrobial solutions based on cutting-edge bionanotechnology, combining cutting-edge science with environmental sustainability.',
                ctaText: 'Contact our team',
                ctaLink: '/#contact',
                backgroundImage: '',
                seo: {
                  metaTitle: 'Our Technology - A&T BioNano',
                  metaDescription: 'Learn about the bionanotechnological technologies we develop to solve contamination problems',
                  metaKeywords: 'technology, bionanotechnology, nanotechnology, innovation'
                }
              }
            },
            {
              id: 'sec-technologies',
              type: 'features',
              order: 2,
              visible: true,
              content: {
                title: 'Technologies',
                items: [
                  { 
                    icon: 'Microscope', 
                    title: 'Advanced Nanotechnology', 
                    description: 'We use state-of-the-art nanoparticles with sizes between 1-100 nanometers for maximum antimicrobial effectiveness.',
                    details: [
                      'Controlled nanoparticle synthesis',
                      'Characterization by TEM and DLS',
                      'Colloidal stability guaranteed'
                    ]
                  },
                  { 
                    icon: 'Atom', 
                    title: 'Biocompatibility', 
                    description: 'Our products are designed to be safe for the environment and living beings, while maintaining high efficacy.',
                    details: [
                      'Safety certifications',
                      'Proven biodegradability',
                      'No cytotoxic effects'
                    ]
                  },
                  { 
                    icon: 'Shield', 
                    title: 'Antimicrobial Action', 
                    description: 'Broad spectrum of action against bacteria, fungi and viruses with proven 99.9% efficacy.',
                    details: [
                      'Multiple action mechanisms',
                      'Prolonged resistance',
                      'No resistance generation'
                    ]
                  },
                  { 
                    icon: 'Leaf', 
                    title: 'Sustainability', 
                    description: 'Committed to sustainable development through green synthesis processes and renewable materials.',
                    details: [
                      'Green chemistry',
                      'Carbon footprint reduction',
                      'Circular economy'
                    ]
                  }
                ]
              }
            },
            {
              id: 'sec-process',
              type: 'timeline',
              order: 3,
              visible: true,
              content: {
                title: 'Development Process',
                subtitle: 'From research to final product',
                milestones: [
                  { step: '01', title: 'Research', description: 'Scientific studies and laboratory tests' },
                  { step: '02', title: 'Development', description: 'Product formulation and optimization' },
                  { step: '03', title: 'Validation', description: 'Clinical trials and certifications' },
                  { step: '04', title: 'Production', description: 'Manufacturing under ISO standards' }
                ]
              }
            }
          ]
        },
        {
          page_id: 'page-process',
          language: 'es',
          sections: [
            {
              id: 'sec-hero',
              type: 'hero',
              order: 1,
              visible: true,
              content: {
                title: 'Nuestro Proceso',
                subtitle: 'Desde la investigación inicial hasta la entrega final, cada paso está diseñado para garantizar productos de la más alta calidad y efectividad.',
                ctaText: '',
                ctaLink: '',
                backgroundImage: '',
                seo: {
                  metaTitle: 'Nuestro Proceso - A&T BioNano',
                  metaDescription: 'Conoce el proceso completo de desarrollo, producción y comercialización de nuestros productos',
                  metaKeywords: 'proceso, desarrollo, producción, calidad'
                }
              }
            },
            {
              id: 'sec-steps',
              type: 'features',
              order: 2,
              visible: true,
              content: {
                title: 'Pasos del Proceso',
                items: [
                  { 
                    icon: 'FlaskConical', 
                    title: 'Investigación y Desarrollo', 
                    description: 'Nuestro equipo de científicos investiga constantemente nuevas formulaciones y mejoras a productos existentes.',
                    details: [
                      'Revisión de literatura científica',
                      'Diseño experimental',
                      'Síntesis de nanocompuestos',
                      'Caracterización fisicoquímica'
                    ]
                  },
                  { 
                    icon: 'Microscope', 
                    title: 'Pruebas de Laboratorio', 
                    description: 'Realizamos exhaustivas pruebas de eficacia antimicrobiana y seguridad en nuestros laboratorios certificados.',
                    details: [
                      'Ensayos microbiológicos',
                      'Pruebas de estabilidad',
                      'Análisis de toxicidad',
                      'Estudios de compatibilidad'
                    ]
                  },
                  { 
                    icon: 'FileCheck', 
                    title: 'Validación y Certificación', 
                    description: 'Obtenemos las certificaciones necesarias para garantizar la calidad y seguridad de nuestros productos.',
                    details: [
                      'Registro sanitario',
                      'Certificaciones ISO',
                      'Estudios de campo',
                      'Documentación técnica'
                    ]
                  },
                  { 
                    icon: 'Factory', 
                    title: 'Producción Escalable', 
                    description: 'Manufactura bajo estrictos controles de calidad con capacidad de producción industrial.',
                    details: [
                      'Buenas prácticas de manufactura',
                      'Control de calidad continuo',
                      'Trazabilidad completa',
                      'Empaque especializado'
                    ]
                  },
                  { 
                    icon: 'TrendingUp', 
                    title: 'Optimización Continua', 
                    description: 'Mejoramos constantemente nuestros procesos basándonos en retroalimentación y nuevos descubrimientos.',
                    details: [
                      'Análisis de datos',
                      'Feedback de clientes',
                      'Innovación continua',
                      'Reducción de costos'
                    ]
                  },
                  { 
                    icon: 'Globe', 
                    title: 'Distribución y Soporte', 
                    description: 'Llevamos nuestros productos al mercado con soporte técnico completo y seguimiento post-venta.',
                    details: [
                      'Red de distribución',
                      'Capacitación a usuarios',
                      'Asistencia técnica',
                      'Monitoreo de resultados'
                    ]
                  }
                ]
              }
            },
            {
              id: 'sec-timeline',
              type: 'timeline',
              order: 3,
              visible: true,
              content: {
                title: 'Tiempo Promedio de Desarrollo',
                subtitle: 'De la idea al producto comercial',
                milestones: [
                  { phase: 'I+D', time: '3-6 meses' },
                  { phase: 'Pruebas', time: '2-4 meses' },
                  { phase: 'Certificación', time: '4-8 meses' },
                  { phase: 'Producción', time: 'Continuo' }
                ]
              }
            }
          ]
        },
        {
          page_id: 'page-process',
          language: 'en',
          sections: [
            {
              id: 'sec-hero',
              type: 'hero',
              order: 1,
              visible: true,
              content: {
                title: 'Our Process',
                subtitle: 'From initial research to final delivery, each step is designed to ensure products of the highest quality and effectiveness.',
                ctaText: '',
                ctaLink: '',
                backgroundImage: '',
                seo: {
                  metaTitle: 'Our Process - A&T BioNano',
                  metaDescription: 'Learn the complete process of development, production and commercialization of our products',
                  metaKeywords: 'process, development, production, quality'
                }
              }
            },
            {
              id: 'sec-steps',
              type: 'features',
              order: 2,
              visible: true,
              content: {
                title: 'Process Steps',
                items: [
                  { 
                    icon: 'FlaskConical', 
                    title: 'Research and Development', 
                    description: 'Our team of scientists constantly researches new formulations and improvements to existing products.',
                    details: [
                      'Scientific literature review',
                      'Experimental design',
                      'Nanocomposite synthesis',
                      'Physicochemical characterization'
                    ]
                  },
                  { 
                    icon: 'Microscope', 
                    title: 'Laboratory Tests', 
                    description: 'We conduct exhaustive antimicrobial efficacy and safety tests in our certified laboratories.',
                    details: [
                      'Microbiological assays',
                      'Stability tests',
                      'Toxicity analysis',
                      'Compatibility studies'
                    ]
                  },
                  { 
                    icon: 'FileCheck', 
                    title: 'Validation and Certification', 
                    description: 'We obtain the necessary certifications to guarantee the quality and safety of our products.',
                    details: [
                      'Health registration',
                      'ISO certifications',
                      'Field studies',
                      'Technical documentation'
                    ]
                  },
                  { 
                    icon: 'Factory', 
                    title: 'Scalable Production', 
                    description: 'Manufacturing under strict quality controls with industrial production capacity.',
                    details: [
                      'Good manufacturing practices',
                      'Continuous quality control',
                      'Complete traceability',
                      'Specialized packaging'
                    ]
                  },
                  { 
                    icon: 'TrendingUp', 
                    title: 'Continuous Optimization', 
                    description: 'We constantly improve our processes based on feedback and new discoveries.',
                    details: [
                      'Data analysis',
                      'Customer feedback',
                      'Continuous innovation',
                      'Cost reduction'
                    ]
                  },
                  { 
                    icon: 'Globe', 
                    title: 'Distribution and Support', 
                    description: 'We bring our products to market with comprehensive technical support and post-sales follow-up.',
                    details: [
                      'Distribution network',
                      'User training',
                      'Technical assistance',
                      'Results monitoring'
                    ]
                  }
                ]
              }
            },
            {
              id: 'sec-timeline',
              type: 'timeline',
              order: 3,
              visible: true,
              content: {
                title: 'Average Development Time',
                subtitle: 'From idea to commercial product',
                milestones: [
                  { phase: 'R&D', time: '3-6 months' },
                  { phase: 'Tests', time: '2-4 months' },
                  { phase: 'Certification', time: '4-8 months' },
                  { phase: 'Production', time: 'Continuous' }
                ]
              }
            }
          ]
        }
      ]);

    if (pageContentsError) {
      console.error('Error al insertar contenido de páginas:', pageContentsError);
    } else {
      console.log('Contenido de páginas insertado exitosamente');
    }

    // 10. Insertar traducciones generales
    console.log('Insertando traducciones generales...');
    const { error: translationsError } = await supabase
      .from('translations')
      .upsert([
        { key: 'nav.home', category: 'navigation', es: 'Inicio', en: 'Home' },
        { key: 'nav.technology', category: 'navigation', es: 'Tecnología', en: 'Technology' },
        { key: 'nav.process', category: 'navigation', es: 'Proceso', en: 'Process' },
        { key: 'nav.store', category: 'navigation', es: 'Tienda', en: 'Store' },
        { key: 'nav.contact', category: 'navigation', es: 'Contacto', en: 'Contact' },
        { key: 'ui.search', category: 'ui', es: 'Buscar', en: 'Search' },
        { key: 'ui.filter', category: 'ui', es: 'Filtrar', en: 'Filter' },
        { key: 'ui.addToCart', category: 'ui', es: 'Agregar al carrito', en: 'Add to cart' },
        { key: 'ui.viewDetails', category: 'ui', es: 'Ver detalles', en: 'View details' },
        { key: 'ui.learnMore', category: 'ui', es: 'Conocer más', en: 'Learn more' },
        { key: 'msg.success', category: 'messages', es: '¡Operación exitosa!', en: 'Operation successful!' },
        { key: 'msg.error', category: 'messages', es: 'Ha ocurrido un error', en: 'An error occurred' },
        { key: 'form.name', category: 'forms', es: 'Nombre', en: 'Name' },
        { key: 'form.email', category: 'forms', es: 'Correo electrónico', en: 'Email' },
        { key: 'form.password', category: 'forms', es: 'Contraseña', en: 'Password' },
        { key: 'form.submit', category: 'forms', es: 'Enviar', en: 'Submit' }
      ]);

    if (translationsError) {
      console.error('Error al insertar traducciones generales:', translationsError);
    } else {
      console.log('Traducciones generales insertadas exitosamente');
    }

    // 11. Insertar usuario administrador predeterminado
    console.log('Insertando usuario administrador...');
    const { error: userError } = await supabase
      .from('users')
      .upsert([
        { id: 'user-001', email: 'admin@atbionano.com', password: 'admin123', name: 'Administrador', role: 'admin' }
      ]);

    if (userError) {
      console.error('Error al insertar usuario administrador:', userError);
    } else {
      console.log('Usuario administrador insertado exitosamente');
    }

    // 12. Verificar que los datos se cargaron correctamente
    const { data: verifyPages, error: verifyPagesError } = await supabase.from('pages').select('*');
    const { data: verifyContents, error: verifyContentsError } = await supabase.from('page_contents').select('*');
    const { data: verifyProducts, error: verifyProductsError } = await supabase.from('products').select('*');

    if (verifyPagesError) {
      console.error('Error al verificar páginas:', verifyPagesError);
    } else {
      console.log(`Páginas encontradas: ${verifyPages.length}`);
    }

    if (verifyContentsError) {
      console.error('Error al verificar contenido:', verifyContentsError);
    } else {
      console.log(`Contenido de páginas encontrado: ${verifyContents.length}`);
    }

    if (verifyProductsError) {
      console.error('Error al verificar productos:', verifyProductsError);
    } else {
      console.log(`Productos encontrados: ${verifyProducts.length}`);
    }

    console.log('¡Base de datos inicializada exitosamente!');

  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
}

initDatabase();