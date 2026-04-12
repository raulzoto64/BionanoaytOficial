-- ================================================================
-- RESTAURACIÓN COMPLETA DE LA HOME - Bionano A&T
-- Todas las secciones con contenido de producción, bilingüe.
-- Ejecutar en el SQL Editor de Supabase.
-- ================================================================

-- Limpiar solo la home para no afectar otras páginas
DELETE FROM page_contents WHERE page_id = 'page-home';

-- ================================================================
-- VERSIÓN ESPAÑOL (ES)
-- Orden de secciones:
-- 0. hero        → Hero principal
-- 1. trust       → Barra de aliados
-- 2. features    → Propósito (3 pilares)
-- 3. featured    → Producto destacado (BNX)
-- 4. products    → Catálogo de productos
-- 5. timeline    → Historia / Hitos
-- 6. team        → Equipo directivo
-- 7. news        → Noticias destacadas
-- 8. ecosystem   → Ecosistema / Aliados
-- ================================================================
INSERT INTO page_contents (page_id, language, sections)
VALUES (
  'page-home',
  'es',
  '[
    {
      "id": "home-hero",
      "type": "hero",
      "order": 0,
      "visible": true,
      "content": {
        "title": "Bionanoaxus (BNX)",
        "subtitle": "La revolución bionanotecnológica que cuida su industria y el planeta. Soluciones antimicrobianas y fungicidas de origen orgánico con precisión atómica.",
        "backgroundImage": "https://sb-jzmdfoptxmqywihyhoty.supabase.co/storage/v1/object/public/site_assets/hero-bg.jpg",
        "ctaText": "Explorar Catálogo",
        "ctaLink": "/store",
        "secondaryCtaText": "Nuestra Tecnología",
        "secondaryCtaLink": "/technology",
        "seo": {
          "metaTitle": "Bionano A&T | Soluciones Bionanotecnológicas",
          "metaDescription": "Bionanoaxus (BNX): Innovación en bionanotecnología para protección antimicrobiana y fungicida sostenible.",
          "metaKeywords": "bionanotecnología, BNX, antimicrobiano, fungicida, sostenible, nanotecnología"
        }
      }
    },
    {
      "id": "home-trust",
      "type": "trust",
      "order": 1,
      "visible": true,
      "content": {
        "partners": [
          {
            "name": "AGROSAVIA",
            "placeholder": "Investigación Agrícola",
            "image": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&h=200&fit=crop",
            "link": "https://www.agrosavia.co",
            "description": "Corporación colombiana de investigación agropecuaria. Aliado estratégico en validación de soluciones para el sector agrícola.",
            "details": ["Investigación aplicada en campo", "Validación de productos BNX", "Certificación agrícola nacional"]
          },
          {
            "name": "ProColombia",
            "placeholder": "Promoción Internacional",
            "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop",
            "link": "https://www.procolombia.co",
            "description": "Entidad gubernamental que promueve el turismo, la inversión y las exportaciones de Colombia al mundo.",
            "details": ["Apoyo en mercados internacionales", "Red de distribución global", "Certificación de exportación"]
          },
          {
            "name": "MinCiencias",
            "placeholder": "Ciencia & Innovación",
            "image": "https://images.unsplash.com/photo-1532187863486-abf9c3445558?q=80&w=400&h=200&fit=crop",
            "link": "https://minciencias.gov.co",
            "description": "Ministerio de Ciencias que respalda la innovación tecnológica nacional, avalando la investigación de Bionano A&T.",
            "details": ["Financiación I+D+i", "Reconocimiento tecnológico", "Respaldo institucional"]
          },
          {
            "name": "BioTrade",
            "placeholder": "Comercio Verde",
            "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&h=200&fit=crop",
            "description": "Red de comercio sostenible que certifica productos de origen biológico para mercados internacionales.",
            "details": ["Certificación de comercio justo", "Red de distribución orgánica", "Mercados premium"]
          },
          {
            "name": "AgroNet",
            "placeholder": "Red Agrícola",
            "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=400&h=200&fit=crop",
            "description": "Plataforma integral de conexión agrícola que facilita el acceso de productores a tecnologías innovadoras.",
            "details": ["Conectividad rural", "Difusión tecnológica", "Capacitación de productores"]
          },
          {
            "name": "EcoInvest",
            "placeholder": "Inversión Verde",
            "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop",
            "description": "Fondo de inversión especializado en startups de biotecnología y economía circular.",
            "details": ["Capital semilla", "Mentoría empresarial", "Acceso a mercados"]
          }
        ]
      }
    },
    {
      "id": "home-purpose",
      "type": "features",
      "order": 2,
      "visible": true,
      "content": {
        "items": [
          {
            "icon": "Users",
            "title": "Misión",
            "description": "Desarrollar soluciones bionanotecnológicas orgánicas que protejan cultivos, industrias y espacios, eliminando patógenos sin dañar el ecosistema ni la salud humana."
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
      }
    },
    {
      "id": "home-featured",
      "type": "featured",
      "order": 3,
      "visible": true,
      "content": {
        "title": "Producto Estrella",
        "productName": "Bionanoaxus (BNX)",
        "productDescription": "Nuestra solución insignia de desinfección y protección antimicrobiana de última generación. Formulado con nanopartículas de plata orgánica y extractos botánicos activos, BNX ofrece una eficacia sin precedentes contra bacterias, hongos, virus y esporas, con impacto mínimo sobre el ecosistema.",
        "productImage": "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&fit=crop",
        "ctaText": "Ver Detalles y Precios",
        "ctaLink": "/store",
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
        ]
      }
    },
    {
      "id": "home-products",
      "type": "products",
      "order": 4,
      "visible": true,
      "content": {
        "title": "Soluciones para Cada Industria",
        "subtitle": "Descubre nuestra gama completa de productos bionanotecnológicos, diseñados para satisfacer las necesidades específicas de cada sector productivo."
      }
    },
    {
      "id": "home-timeline",
      "type": "timeline",
      "order": 5,
      "visible": true,
      "content": {
        "title": "Nuestra Historia",
        "subtitle": "Una trayectoria de innovación constante",
        "description": "Desde nuestra fundación hemos recorrido un camino de investigación, validación y expansión global, construyendo la plataforma biotecnológica del futuro.",
        "milestones": [
          {
            "year": "2015",
            "title": "Fundación en Colombia",
            "description": "Nace Bionano A&T con la misión de democratizar la biotecnología sostenible en Latinoamérica.",
            "icon": "Lightbulb"
          },
          {
            "year": "2017",
            "title": "Primera Patente BNX",
            "description": "Registro de la primera patente de la fórmula Bionanoaxus ante la Superintendencia de Industria y Comercio.",
            "icon": "FileCheck"
          },
          {
            "year": "2019",
            "title": "Expansión Regional",
            "description": "Entrada a mercados de México, Perú y Ecuador, consolidando nuestra presencia en América Latina.",
            "icon": "TrendingUp"
          },
          {
            "year": "2021",
            "title": "Certificación Internacional",
            "description": "Obtención de certificaciones ISO 9001 y aprobación del USDA para exportación de productos orgánicos.",
            "icon": "FileCheck"
          },
          {
            "year": "2023",
            "title": "Alianzas Globales",
            "description": "Firma de acuerdos de distribución con socios en Europa y Asia, alcanzando presencia en 25 países.",
            "icon": "TrendingUp"
          },
          {
            "year": "2025",
            "title": "Nueva Era Digital",
            "description": "Lanzamiento de la plataforma digital de pedidos B2B y el laboratorio de investigación de próxima generación.",
            "icon": "Lightbulb"
          }
        ]
      }
    },
    {
      "id": "home-team",
      "type": "team",
      "order": 6,
      "visible": true,
      "content": {
        "title": "Nuestros Líderes",
        "subtitle": "Un equipo multidisciplinario de científicos, ingenieros y expertos en negocios internacionales unidos por la pasión de transformar industrias a través de la biotecnología.",
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
        ]
      }
    },
    {
      "id": "home-news",
      "type": "news",
      "order": 7,
      "visible": true,
      "content": {
        "title": "Noticias y Artículos",
        "subtitle": "Mantente al tanto de los últimos avances en bionanotecnología, sostenibilidad y los logros de Bionano A&T."
      }
    },
    {
      "id": "home-ecosystem",
      "type": "ecosystem",
      "order": 8,
      "visible": true,
      "content": {
        "title": "Nuestro Ecosistema",
        "subtitle": "Conectamos innovadores, empresarios y profesionales para construir un ecosistema de negocios sostenible y tecnológico que impulse la economía verde.",
        "items": [
          {
            "label": "Red de Innovadores",
            "desc": "Conectamos profesionales del sector biotecnológico y agroindustrial para crear sinergias de alto impacto.",
            "iconPath": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          },
          {
            "label": "Crecimiento Sostenible",
            "desc": "Impulsamos el desarrollo responsable que equilibra la rentabilidad económica con el cuidado del planeta.",
            "iconPath": "M13 10V3L4 14h7v7l9-11h-7z"
          }
        ]
      }
    }
  ]'
);

-- ================================================================
-- VERSIÓN INGLÉS (EN)
-- ================================================================
INSERT INTO page_contents (page_id, language, sections)
VALUES (
  'page-home',
  'en',
  '[
    {
      "id": "home-hero",
      "type": "hero",
      "order": 0,
      "visible": true,
      "content": {
        "title": "Bionanoaxus (BNX)",
        "subtitle": "The bionanotechnology revolution that protects your industry and the planet. Organic antimicrobial and fungicidal solutions with atomic precision.",
        "backgroundImage": "https://sb-jzmdfoptxmqywihyhoty.supabase.co/storage/v1/object/public/site_assets/hero-bg.jpg",
        "ctaText": "Explore Catalog",
        "ctaLink": "/store",
        "secondaryCtaText": "Our Technology",
        "secondaryCtaLink": "/technology",
        "seo": {
          "metaTitle": "Bionano A&T | Bionanotechnological Solutions",
          "metaDescription": "Bionanoaxus (BNX): Innovation in bionanotechnology for sustainable antimicrobial and fungicidal protection.",
          "metaKeywords": "bionanotechnology, BNX, antimicrobial, fungicide, sustainable, nanotechnology"
        }
      }
    },
    {
      "id": "home-trust",
      "type": "trust",
      "order": 1,
      "visible": true,
      "content": {
        "partners": [
          {
            "name": "AGROSAVIA",
            "placeholder": "Agricultural Research",
            "image": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&h=200&fit=crop",
            "link": "https://www.agrosavia.co",
            "description": "Colombian corporation for agricultural research. Strategic ally in validating solutions for the agricultural sector.",
            "details": ["Applied field research", "BNX product validation", "National agricultural certification"]
          },
          {
            "name": "ProColombia",
            "placeholder": "International Promotion",
            "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop",
            "link": "https://www.procolombia.co",
            "description": "Government entity promoting tourism, investment and Colombian exports worldwide.",
            "details": ["International market support", "Global distribution network", "Export certification"]
          },
          {
            "name": "MinCiencias",
            "placeholder": "Science & Innovation",
            "image": "https://images.unsplash.com/photo-1532187863486-abf9c3445558?q=80&w=400&h=200&fit=crop",
            "link": "https://minciencias.gov.co",
            "description": "Ministry of Sciences that supports national technological innovation, endorsing Bionano A&T research.",
            "details": ["R&D financing", "Technological recognition", "Institutional support"]
          },
          {
            "name": "BioTrade",
            "placeholder": "Green Trade",
            "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&h=200&fit=crop",
            "description": "Sustainable trade network certifying biological origin products for international markets.",
            "details": ["Fair trade certification", "Organic distribution network", "Premium markets"]
          },
          {
            "name": "AgroNet",
            "placeholder": "Agricultural Network",
            "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=400&h=200&fit=crop",
            "description": "Comprehensive agricultural connection platform facilitating producer access to innovative technologies.",
            "details": ["Rural connectivity", "Technology dissemination", "Producer training"]
          },
          {
            "name": "EcoInvest",
            "placeholder": "Green Investment",
            "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop",
            "description": "Investment fund specialized in biotechnology startups and circular economy.",
            "details": ["Seed capital", "Business mentoring", "Market access"]
          }
        ]
      }
    },
    {
      "id": "home-purpose",
      "type": "features",
      "order": 2,
      "visible": true,
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
      }
    },
    {
      "id": "home-featured",
      "type": "featured",
      "order": 3,
      "visible": true,
      "content": {
        "title": "Star Product",
        "productName": "Bionanoaxus (BNX)",
        "productDescription": "Our flagship next-generation antimicrobial disinfection and protection solution. Formulated with organic silver nanoparticles and active botanical extracts, BNX offers unprecedented efficacy against bacteria, fungi, viruses and spores, with minimal ecosystem impact.",
        "productImage": "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&fit=crop",
        "ctaText": "View Details & Pricing",
        "ctaLink": "/store",
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
        ]
      }
    },
    {
      "id": "home-products",
      "type": "products",
      "order": 4,
      "visible": true,
      "content": {
        "title": "Solutions for Every Industry",
        "subtitle": "Discover our complete range of bionanotechnological products, designed to meet the specific needs of each productive sector."
      }
    },
    {
      "id": "home-timeline",
      "type": "timeline",
      "order": 5,
      "visible": true,
      "content": {
        "title": "Our History",
        "subtitle": "A journey of constant innovation",
        "description": "Since our founding, we have traveled a path of research, validation and global expansion, building the biotechnological platform of the future.",
        "milestones": [
          {
            "year": "2015",
            "title": "Founded in Colombia",
            "description": "Bionano A&T was born with the mission of democratizing sustainable biotechnology in Latin America.",
            "icon": "Lightbulb"
          },
          {
            "year": "2017",
            "title": "First BNX Patent",
            "description": "Registration of the first Bionanoaxus formula patent with the Superintendence of Industry and Commerce.",
            "icon": "FileCheck"
          },
          {
            "year": "2019",
            "title": "Regional Expansion",
            "description": "Entry into markets in Mexico, Peru and Ecuador, consolidating our presence in Latin America.",
            "icon": "TrendingUp"
          },
          {
            "year": "2021",
            "title": "International Certification",
            "description": "Obtaining ISO 9001 certifications and USDA approval for export of organic products.",
            "icon": "FileCheck"
          },
          {
            "year": "2023",
            "title": "Global Alliances",
            "description": "Signing distribution agreements with partners in Europe and Asia, reaching presence in 25 countries.",
            "icon": "TrendingUp"
          },
          {
            "year": "2025",
            "title": "New Digital Era",
            "description": "Launch of the B2B digital ordering platform and the next-generation research laboratory.",
            "icon": "Lightbulb"
          }
        ]
      }
    },
    {
      "id": "home-team",
      "type": "team",
      "order": 6,
      "visible": true,
      "content": {
        "title": "Our Leaders",
        "subtitle": "A multidisciplinary team of scientists, engineers and international business experts united by the passion to transform industries through biotechnology.",
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
        ]
      }
    },
    {
      "id": "home-news",
      "type": "news",
      "order": 7,
      "visible": true,
      "content": {
        "title": "News & Articles",
        "subtitle": "Stay up to date with the latest advances in bionanotechnology, sustainability and Bionano A&T achievements."
      }
    },
    {
      "id": "home-ecosystem",
      "type": "ecosystem",
      "order": 8,
      "visible": true,
      "content": {
        "title": "Our Ecosystem",
        "subtitle": "We connect innovators, entrepreneurs and professionals to build a sustainable and technological business ecosystem that drives the green economy.",
        "items": [
          {
            "label": "Network of Innovators",
            "desc": "We connect professionals from the biotechnological and agroindustrial sector to create high-impact synergies.",
            "iconPath": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          },
          {
            "label": "Sustainable Growth",
            "desc": "We promote responsible development that balances economic profitability with caring for the planet.",
            "iconPath": "M13 10V3L4 14h7v7l9-11h-7z"
          }
        ]
      }
    }
  ]'
);
