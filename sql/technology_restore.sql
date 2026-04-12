-- ================================================================
-- RESTAURACIÓN COMPLETA DE TECNOLOGÍA - Bionano A&T
-- Secciones: hero, features (4 cards), stats, faq, quote, bento, history, team, timeline
-- ================================================================

DELETE FROM page_contents WHERE page_id = 'page-technology';

-- ================================================================
-- ESPAÑOL (ES)
-- ================================================================
INSERT INTO page_contents (page_id, language, sections)
VALUES (
  'page-technology',
  'es',
  '[
    {
      "id": "tech-hero",
      "type": "hero",
      "order": 0,
      "visible": true,
      "content": {
        "title": "Tecnología Bionano A&T",
        "subtitle": "Donde la ciencia molecular se convierte en soluciones reales. Desarrollamos bionanotecnología que transforma la forma en que el mundo protege sus cultivos, alimentos e industrias.",
        "backgroundImage": "https://images.unsplash.com/photo-1532187863486-abf9c3445558?q=80&w=2000&fit=crop",
        "ctaText": "Ver Nuestros Productos",
        "ctaLink": "/store",
        "secondaryCtaText": "Contactar Equipo",
        "secondaryCtaLink": "/#contact",
        "seo": {
          "metaTitle": "Tecnología BNX | Bionano A&T",
          "metaDescription": "Descubre la ciencia detrás de Bionanoaxus: nanopartículas orgánicas, V-Lab y R-Tech para protección antimicrobiana de nueva generación.",
          "metaKeywords": "V-Lab, R-Tech, nanotecnología, antimicrobiano, fungicida, BNX"
        }
      }
    },
    {
      "id": "tech-features",
      "type": "features",
      "order": 1,
      "visible": true,
      "content": {
        "title": "Nuestra Plataforma Tecnológica",
        "subtitle": "Cuatro pilares científicos que hacen de BNX la solución más avanzada del mercado",
        "items": [
          {
            "icon": "Microscope",
            "title": "V-Lab: Laboratorio Virtual",
            "description": "Plataforma de modelado molecular en tiempo real que simula el comportamiento de nanopartículas antes de su síntesis. Reducimos ciclos de desarrollo de meses a días.",
            "details": [
              "Simulación molecular 3D de alta precisión",
              "Predicción de eficacia por cepa patógena",
              "Optimización de concentraciones sin ensayos físicos",
              "Integración con bases de datos microbiológicas globales",
              "Resultados reproducibles y auditables"
            ]
          },
          {
            "icon": "Atom",
            "title": "R-Tech: Nanorecubrimientos Inteligentes",
            "description": "Sistema propietario de recubrimiento superficial de larga duración con nanopartículas de plata orgánica. Un solo tratamiento protege hasta 12 meses sin reactivaciones.",
            "details": [
              "Adherencia certificada en metales, plásticos y textiles",
              "Liberación controlada del agente activo por contacto",
              "Resistencia a humedad, UV y temperatura extrema",
              "Cobertura homogénea en superficies complejas",
              "Compatible con sistemas de nebulización industrial"
            ]
          },
          {
            "icon": "Shield",
            "title": "BNX: Fórmula Insignia",
            "description": "Formulación líquida de amplio espectro que elimina bacterias, virus, hongos y esporas en contacto, sin generar resistencias microbianas.",
            "details": [
              "Eficacia del 99.99% contra 47 cepas documentadas",
              "Tiempo de acción: menos de 30 segundos en superficies",
              "Biodegradación completa en menos de 72 horas",
              "Sin residuos tóxicos en suelos ni agua",
              "Certificado USDA, EPA y ANLA Colombia"
            ]
          },
          {
            "icon": "Leaf",
            "title": "AgroBio: Protección Agrícola",
            "description": "Línea específica para el sector agropecuario. Protege cultivos de alto valor comercial contra enfermedades fúngicas sin afectar la biodiversidad del suelo.",
            "details": [
              "Compatible con agricultura orgánica certificada",
              "Sin periodo de carencia para cosecha",
              "Reducción del 60% en pérdidas por hongos postcosecha",
              "Aplicación por goteo, foliar o nebulización",
              "Probado en: banano, aguacate, cacao, tomate, fresa"
            ]
          }
        ]
      }
    },
    {
      "id": "tech-stats",
      "type": "stats",
      "order": 2,
      "visible": true,
      "content": {
        "title": "Resultados que Hablan por Sí Solos",
        "subtitle": "Diez años de investigación respaldados por datos reales",
        "stats": [
          {
            "value": "99.99%",
            "label": "Eficacia Antimicrobiana",
            "description": "Contra 47 cepas documentadas"
          },
          {
            "value": "5M+",
            "label": "Litros Producidos",
            "description": "Desde nuestra fundación"
          },
          {
            "value": "25+",
            "label": "Países Activos",
            "description": "Red de distribución global"
          },
          {
            "value": "72h",
            "label": "Biodegradación",
            "description": "Descomposición completa"
          }
        ]
      }
    },
    {
      "id": "tech-bento",
      "type": "bento",
      "order": 3,
      "visible": true,
      "content": {
        "title": "¿Por Qué Elegirnos?",
        "subtitle": "Ventajas diferenciales que nos posicionan como la tecnología número uno en el mercado",
        "items": [
          {
            "icon": "FlaskConical",
            "title": "I+D Continuo",
            "description": "Nuestro laboratorio nunca se detiene. Cada año lanzamos mejoras a la fórmula basadas en evidencia científica y retroalimentación de clientes en campo.",
            "size": "large",
            "details": [
              "10 patentes registradas",
              "Equipo de 25 investigadores"
            ]
          },
          {
            "icon": "Globe",
            "title": "Alcance Global",
            "description": "Presentes en 25 países con red de distribución certificada.",
            "size": "normal"
          },
          {
            "icon": "Shield",
            "title": "Certificaciones",
            "description": "USDA Organic, EPA registrado, ANLA Colombia, ISO 9001 y BPM vigentes.",
            "size": "normal",
            "details": [
              "USDA Organic",
              "EPA Registered",
              "ISO 9001:2015"
            ]
          },
          {
            "icon": "Zap",
            "title": "Acción Ultrarrápida",
            "description": "Menos de 30 segundos para eliminar el 99.99% de los patógenos objetivo en superficie.",
            "size": "normal"
          },
          {
            "icon": "Leaf",
            "title": "Cero Impacto Ambiental",
            "description": "Primer desinfectante industrial con huella de carbono negativa, 100% biodegradable y sin acumulación en cadenas tróficas.",
            "size": "large",
            "details": [
              "Biodegradación total en 72h",
              "Sin bioacumulación"
            ]
          }
        ]
      }
    },
    {
      "id": "tech-quote",
      "type": "quote",
      "order": 4,
      "visible": true,
      "content": {
        "quote": "Bionanoaxus no solo resolvió nuestro problema de contaminación fúngica, transformó completamente nuestra cadena de poscosecha. Las pérdidas se redujeron un 58% en el primer ciclo.",
        "author": "Gerente de Operaciones",
        "role": "Corporación AgroAndes — Export Division",
        "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop"
      }
    },
    {
      "id": "tech-history",
      "type": "history",
      "order": 5,
      "visible": true,
      "content": {
        "title": "Una Década de Innovación",
        "subtitle": "Los hitos que construyeron el futuro de la biotecnología sostenible",
        "description": "Cada año nos ha acercado más a nuestro objetivo: hacer de la biotecnología orgánica el estándar global de protección industrial.",
        "milestones": [
          {
            "year": "2015",
            "title": "Fundación en Medellín",
            "description": "Nace Bionano A&T con un equipo de 5 investigadores y la misión de democratizar la biotecnología.",
            "icon": "Lightbulb"
          },
          {
            "year": "2017",
            "title": "Patente BNX V1.0",
            "description": "Primera patente de la fórmula Bionanoaxus. Validación en 12 cepas patógenas con eficacia superior al 99%.",
            "icon": "FileCheck"
          },
          {
            "year": "2019",
            "title": "Primer Millón de Litros",
            "description": "Superamos el primer millón de litros producidos. Presencia en Colombia, México, Perú y Ecuador.",
            "icon": "TrendingUp"
          },
          {
            "year": "2021",
            "title": "Certificación USDA & ISO",
            "description": "Aprobación del USDA para exportación y certificación ISO 9001. Entrada al mercado europeo.",
            "icon": "FileCheck"
          },
          {
            "year": "2023",
            "title": "Expansión Global",
            "description": "Operaciones en 25 países. Acuerdos de distribución con socios en Alemania, Japón y Brasil.",
            "icon": "TrendingUp"
          },
          {
            "year": "2025",
            "title": "Era Digital BNX",
            "description": "Lanzamiento de la plataforma B2B, V-Lab virtual y nueva línea AgroBio Premium.",
            "icon": "Lightbulb"
          }
        ]
      }
    },
    {
      "id": "tech-faq",
      "type": "faq",
      "order": 6,
      "visible": true,
      "content": {
        "title": "Preguntas Técnicas Frecuentes",
        "subtitle": "Respuestas a las dudas más comunes sobre nuestra tecnología",
        "items": [
          {
            "question": "¿Cuál es el mecanismo de acción de BNX contra bacterias?",
            "answer": "Las nanopartículas de plata orgánica de BNX actúan en múltiples frentes: penetran la membrana celular bacteriana, interfieren con la síntesis de ATP e inhiben la replicación del ADN. Esta acción triple impide que los microorganismos desarrollen resistencia, a diferencia de los antibióticos convencionales."
          },
          {
            "question": "¿Es seguro usar BNX cerca de cultivos para consumo humano?",
            "answer": "Sí. BNX está certificado por el USDA como producto orgánico y no requiere periodo de carencia antes de la cosecha. Sus componentes se biodegradam completamente en el suelo en menos de 72 horas, sin dejar residuos detestables por espectrometría de masas."
          },
          {
            "question": "¿Qué diferencia a BNX de los fungicidas convencionales?",
            "answer": "Los fungicidas químicos convencionales actúan sobre un único sitio de acción, lo que facilita el desarrollo de resistencia. BNX actúa simultáneamente sobre múltiples blancos moleculares, es biodegradable, no genera bioacumulación y no afecta organismos benéficos como polinizadores o microfauna del suelo."
          },
          {
            "question": "¿Se puede aplicar BNX en sistemas de riego por goteo?",
            "answer": "Absolutamente. BNX es miscible en agua en cualquier proporción y no forma precipitados ni obstruye emisores de riego. Se recomienda aplicar entre 2 y 5 mL por litro según la concentración de patógenos objetivo identificados en el análisis de suelo."
          },
          {
            "question": "¿Qué pasa si se consume accidentalmente?",
            "answer": "Los estudios de toxicidad oral realizados demuestran que BNX es prácticamente no tóxico en las concentraciones de uso (LD50 > 5000 mg/kg en modelos murinos). No obstante, no está formulado para consumo directo. En caso de ingestión, se recomienda beber agua abundante y contactar al médico."
          },
          {
            "question": "¿Cuánto tiempo dura la protección de R-Tech en superficies?",
            "answer": "En condiciones normales de uso industrial, R-Tech mantiene actividad antimicrobiana activa por un período de 6 a 12 meses, dependiendo de la frecuencia de limpieza, temperatura ambiente y exposición a luz UV directa. Se recomienda reaplicación anual en entornos de alta rotación."
          }
        ]
      }
    },
    {
      "id": "tech-team",
      "type": "team",
      "order": 7,
      "visible": true,
      "content": {
        "title": "El Equipo Científico",
        "subtitle": "Investigadores y doctores especializados que dan vida a cada innovación de Bionano A&T.",
        "members": [
          {
            "name": "Dra. Sofía Ramírez",
            "role": "Directora Científica",
            "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop",
            "linkedin": "https://linkedin.com"
          },
          {
            "name": "Dr. Manuel Herrera",
            "role": "Jefe de Nanotecnología",
            "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop",
            "linkedin": "https://linkedin.com"
          },
          {
            "name": "Ing. Lucía Vargas",
            "role": "Investigadora Senior BNX",
            "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop",
            "linkedin": "https://linkedin.com"
          }
        ]
      }
    },
    {
      "id": "tech-process",
      "type": "timeline",
      "order": 8,
      "visible": true,
      "content": {
        "title": "¿Cómo Funciona BNX?",
        "subtitle": "Del laboratorio a su industria en cuatro pasos precisos",
        "milestones": [
          {
            "step": "01",
            "title": "Síntesis Nanomolecular",
            "desc": "Producimos nanopartículas de plata orgánica entre 1 y 20 nm, controlando forma y carga superficial para máxima eficacia."
          },
          {
            "step": "02",
            "title": "Activación Botánica",
            "desc": "Combinamos las nanopartículas con extractos vegetales activos (cúrcuma, neem, aloe) que potencian la acción antimicrobiana."
          },
          {
            "step": "03",
            "title": "Validación de Laboratorio",
            "desc": "Cada lote pasa pruebas de CMI y citotoxicidad antes de aprobarse para producción masiva."
          },
          {
            "step": "04",
            "title": "Aplicación Industrial",
            "desc": "El producto llega listo para usar via nebulización, aspersión o inmersión, adaptado a cada industria."
          }
        ]
      }
    }
  ]'
);

-- ================================================================
-- INGLÉS (EN)
-- ================================================================
INSERT INTO page_contents (page_id, language, sections)
VALUES (
  'page-technology',
  'en',
  '[
    {
      "id": "tech-hero",
      "type": "hero",
      "order": 0,
      "visible": true,
      "content": {
        "title": "Bionano A&T Technology",
        "subtitle": "Where molecular science becomes real solutions. We develop bionanotechnology that transforms how the world protects its crops, food and industries.",
        "backgroundImage": "https://images.unsplash.com/photo-1532187863486-abf9c3445558?q=80&w=2000&fit=crop",
        "ctaText": "View Our Products",
        "ctaLink": "/store",
        "secondaryCtaText": "Contact Team",
        "secondaryCtaLink": "/#contact",
        "seo": {
          "metaTitle": "BNX Technology | Bionano A&T",
          "metaDescription": "Discover the science behind Bionanoaxus: organic nanoparticles, V-Lab and R-Tech for next-generation antimicrobial protection.",
          "metaKeywords": "V-Lab, R-Tech, nanotechnology, antimicrobial, fungicide, BNX"
        }
      }
    },
    {
      "id": "tech-features",
      "type": "features",
      "order": 1,
      "visible": true,
      "content": {
        "title": "Our Technology Platform",
        "subtitle": "Four scientific pillars that make BNX the most advanced solution in the market",
        "items": [
          {
            "icon": "Microscope",
            "title": "V-Lab: Virtual Laboratory",
            "description": "Real-time molecular modeling platform that simulates nanoparticle behavior before synthesis. We reduce development cycles from months to days.",
            "details": [
              "High-precision 3D molecular simulation",
              "Efficacy prediction per pathogen strain",
              "Concentration optimization without physical trials",
              "Integration with global microbiological databases",
              "Reproducible and auditable results"
            ]
          },
          {
            "icon": "Atom",
            "title": "R-Tech: Smart Nanocoatings",
            "description": "Proprietary long-duration surface coating system with organic silver nanoparticles. A single treatment protects up to 12 months.",
            "details": [
              "Adhesion certified on metals, plastics and textiles",
              "Controlled release of active agent on contact",
              "Resistance to humidity, UV and extreme temperature",
              "Homogeneous coverage on complex surfaces",
              "Compatible with industrial nebulization systems"
            ]
          },
          {
            "icon": "Shield",
            "title": "BNX: Flagship Formula",
            "description": "Broad-spectrum liquid formulation that eliminates bacteria, viruses, fungi and spores on contact, without generating microbial resistance.",
            "details": [
              "99.99% efficacy against 47 documented strains",
              "Action time: less than 30 seconds on surfaces",
              "Complete biodegradation in less than 72 hours",
              "No toxic residues in soil or water",
              "USDA, EPA and ANLA Colombia certified"
            ]
          },
          {
            "icon": "Leaf",
            "title": "AgroBio: Agricultural Protection",
            "description": "Specific line for the agricultural sector. Protects high-value commercial crops against fungal diseases without affecting soil biodiversity.",
            "details": [
              "Compatible with certified organic agriculture",
              "No waiting period before harvest",
              "60% reduction in post-harvest fungal losses",
              "Application by drip, foliar or nebulization",
              "Tested on: banana, avocado, cocoa, tomato, strawberry"
            ]
          }
        ]
      }
    },
    {
      "id": "tech-stats",
      "type": "stats",
      "order": 2,
      "visible": true,
      "content": {
        "title": "Results That Speak for Themselves",
        "subtitle": "Ten years of research backed by real data",
        "stats": [
          {"value": "99.99%", "label": "Antimicrobial Efficacy", "description": "Against 47 documented strains"},
          {"value": "5M+", "label": "Liters Produced", "description": "Since our founding"},
          {"value": "25+", "label": "Active Countries", "description": "Global distribution network"},
          {"value": "72h", "label": "Biodegradation", "description": "Complete decomposition"}
        ]
      }
    },
    {
      "id": "tech-bento",
      "type": "bento",
      "order": 3,
      "visible": true,
      "content": {
        "title": "Why Choose Us?",
        "subtitle": "Differential advantages that position us as the number one technology in the market",
        "items": [
          {
            "icon": "FlaskConical",
            "title": "Continuous R&D",
            "description": "Our laboratory never stops. Every year we release formula improvements based on scientific evidence and field customer feedback.",
            "size": "large",
            "details": ["10 registered patents", "Team of 25 researchers"]
          },
          {"icon": "Globe", "title": "Global Reach", "description": "Present in 25 countries with certified distribution network.", "size": "normal"},
          {"icon": "Shield", "title": "Certifications", "description": "USDA Organic, EPA registered, ISO 9001 and GMP in force.", "size": "normal", "details": ["USDA Organic", "EPA Registered", "ISO 9001:2015"]},
          {"icon": "Zap", "title": "Ultra-Fast Action", "description": "Less than 30 seconds to eliminate 99.99% of target pathogens on surface.", "size": "normal"},
          {"icon": "Leaf", "title": "Zero Environmental Impact", "description": "First industrial disinfectant with a negative carbon footprint, 100% biodegradable.", "size": "large", "details": ["Full biodegradation in 72h", "No bioaccumulation"]}
        ]
      }
    },
    {
      "id": "tech-quote",
      "type": "quote",
      "order": 4,
      "visible": true,
      "content": {
        "quote": "Bionanoaxus did not just solve our fungal contamination problem, it completely transformed our post-harvest chain. Losses were reduced by 58% in the first cycle.",
        "author": "Operations Manager",
        "role": "AgroAndes Corporation — Export Division",
        "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop"
      }
    },
    {
      "id": "tech-history",
      "type": "history",
      "order": 5,
      "visible": true,
      "content": {
        "title": "A Decade of Innovation",
        "subtitle": "The milestones that built the future of sustainable biotechnology",
        "description": "Each year has brought us closer to our goal: making organic biotechnology the global standard for industrial protection.",
        "milestones": [
          {"year": "2015", "title": "Founded in Medellín", "description": "Bionano A&T is born with a team of 5 researchers.", "icon": "Lightbulb"},
          {"year": "2017", "title": "BNX V1.0 Patent", "description": "First Bionanoaxus formula patent. Validated on 12 pathogenic strains.", "icon": "FileCheck"},
          {"year": "2019", "title": "First Million Liters", "description": "We surpassed one million liters produced. Presence in 4 countries.", "icon": "TrendingUp"},
          {"year": "2021", "title": "USDA & ISO Certification", "description": "USDA approval for export and ISO 9001 certification.", "icon": "FileCheck"},
          {"year": "2023", "title": "Global Expansion", "description": "Operations in 25 countries with partners in Germany, Japan and Brazil.", "icon": "TrendingUp"},
          {"year": "2025", "title": "Digital BNX Era", "description": "B2B platform launch, virtual V-Lab and new AgroBio Premium line.", "icon": "Lightbulb"}
        ]
      }
    },
    {
      "id": "tech-faq",
      "type": "faq",
      "order": 6,
      "visible": true,
      "content": {
        "title": "Frequently Asked Technical Questions",
        "subtitle": "Answers to the most common questions about our technology",
        "items": [
          {"question": "What is the mechanism of action of BNX against bacteria?", "answer": "BNX organic silver nanoparticles act on multiple fronts: they penetrate the bacterial cell membrane, interfere with ATP synthesis, and inhibit DNA replication. This triple action prevents microorganisms from developing resistance."},
          {"question": "Is it safe to use BNX near food crops?", "answer": "Yes. BNX is USDA certified as an organic product and requires no waiting period before harvest. Its components completely biodegrade in soil in less than 72 hours."},
          {"question": "What differentiates BNX from conventional fungicides?", "answer": "Conventional chemical fungicides act on a single site, facilitating resistance development. BNX acts simultaneously on multiple molecular targets, is biodegradable, and does not affect beneficial organisms like pollinators."},
          {"question": "Can BNX be applied in drip irrigation systems?", "answer": "Absolutely. BNX is miscible in water in any proportion and does not form precipitates or clog irrigation emitters. Apply 2-5 mL per liter depending on pathogen concentration."},
          {"question": "How long does R-Tech protection last on surfaces?", "answer": "Under normal industrial use conditions, R-Tech maintains active antimicrobial activity for 6 to 12 months, depending on cleaning frequency and UV exposure. Annual reapplication is recommended in high-rotation environments."}
        ]
      }
    },
    {
      "id": "tech-team",
      "type": "team",
      "order": 7,
      "visible": true,
      "content": {
        "title": "The Scientific Team",
        "subtitle": "Researchers and specialized scientists who bring every Bionano A&T innovation to life.",
        "members": [
          {"name": "Dr. Sofía Ramírez", "role": "Chief Science Officer", "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop", "linkedin": "https://linkedin.com"},
          {"name": "Dr. Manuel Herrera", "role": "Head of Nanotechnology", "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop", "linkedin": "https://linkedin.com"},
          {"name": "Eng. Lucía Vargas", "role": "Senior BNX Researcher", "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop", "linkedin": "https://linkedin.com"}
        ]
      }
    },
    {
      "id": "tech-process",
      "type": "timeline",
      "order": 8,
      "visible": true,
      "content": {
        "title": "How Does BNX Work?",
        "subtitle": "From laboratory to your industry in four precise steps",
        "milestones": [
          {"step": "01", "title": "Nanomolecular Synthesis", "desc": "We produce organic silver nanoparticles between 1 and 20 nm, controlling shape and surface charge for maximum efficacy."},
          {"step": "02", "title": "Botanical Activation", "desc": "We combine nanoparticles with active plant extracts (turmeric, neem, aloe) that synergistically enhance antimicrobial action."},
          {"step": "03", "title": "Laboratory Validation", "desc": "Each batch undergoes MIC tests and cytotoxicity studies before being approved for mass production."},
          {"step": "04", "title": "Industrial Application", "desc": "The product arrives ready to use via nebulization, spraying or immersion, adapted to each industry."}
        ]
      }
    }
  ]'
);
