-- ================================================================
-- RESTAURACIÓN COMPLETA - PÁGINA DE PROCESOS (FUNNEL INDUSTRIAL)
-- Bionano A&T | Secciones únicas de convicción y venta
-- ================================================================

DELETE FROM page_contents WHERE page_id = 'page-process';

-- ================================================================
-- ESPAÑOL (ES)
-- Funnel: Hero → Problema → Proceso (pasos) → Sectores → 
--         Fases → Resultados → Certificaciones → Testimonio → FAQ → CTA
-- ================================================================
INSERT INTO page_contents (page_id, language, sections)
VALUES (
  'page-process',
  'es',
  '[
    {
      "id": "proc-hero",
      "type": "hero",
      "order": 0,
      "visible": true,
      "content": {
        "badge": "Procesos Industriales",
        "title": "Protección Total para su Industria",
        "subtitle": "De la amenaza microbiana a la tranquilidad operativa en 4 etapas. Nuestro proceso certificado ha protegido más de 500 instalaciones industriales en 25 países.",
        "backgroundImage": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&fit=crop",
        "ctaText": "Ver Nuestro Proceso",
        "ctaLink": "#process-steps",
        "secondaryCtaText": "Agendar Diagnóstico",
        "secondaryCtaLink": "/#contact",
        "seo": {
          "metaTitle": "Procesos Industriales BNX | Bionano A&T",
          "metaDescription": "Descubre el proceso de implementación de Bionanoaxus BNX para proteger su industria: diagnóstico, diseño, aplicación y seguimiento certificado.",
          "metaKeywords": "proceso industrial, BNX, desinfección industrial, protección antimicrobiana, bionanotecnología"
        }
      }
    },
    {
      "id": "proc-problems",
      "type": "problems",
      "order": 1,
      "visible": true,
      "content": {
        "badge": "El Problema Real",
        "title": "¿Qué Está Costando la Contaminación a su Empresa?",
        "subtitle": "La contaminación microbiana no detectada destruye silenciosamente la rentabilidad de miles de empresas cada año",
        "items": [
          {
            "icon": "TrendingUp",
            "title": "Pérdidas en Cadena de Valor",
            "description": "La contaminación fúngica y bacteriana destruye entre el 15 y el 40% de la producción agrícola e industrial antes de llegar al mercado.",
            "stat": "40%",
            "statLabel": "pérdidas medias por contaminación"
          },
          {
            "icon": "AlertTriangle",
            "title": "Recalls y Sanciones Regulatorias",
            "description": "Un brote de contaminación puede significar el retiro de toda una línea de producción y multas millonarias de organismos sanitarios.",
            "stat": "$2.8M",
            "statLabel": "costo promedio de un recall"
          },
          {
            "icon": "Factory",
            "title": "Resistencia a Productos Convencionales",
            "description": "Las bacterias y hongos desarrollan resistencia a los desinfectantes químicos en 3-6 meses de uso continuo, volviendo ineficaz la protección.",
            "stat": "73%",
            "statLabel": "de cepas resistentes a desinfectantes"
          },
          {
            "icon": "Microscope",
            "title": "Contaminación Cruzada Invisible",
            "description": "El 68% de los brotes de contaminación ocurren en superficies aparentemente limpias que albergan biopelículas microbianas no visibles.",
            "stat": "68%",
            "statLabel": "de brotes en superficies visualmente limpias"
          },
          {
            "icon": "Globe",
            "title": "Barreras a la Exportación",
            "description": "Compradores internacionales exigen certificaciones microbiológicas que muchas plantas no pueden garantizar con productos convencionales.",
            "stat": "1 de 3",
            "statLabel": "exportadores rechazados por estándares micro"
          },
          {
            "icon": "FileCheck",
            "title": "Cumplimiento Normativo Creciente",
            "description": "Las regulaciones sanitarias internacionales son cada vez más estrictas. Quedarse atrás tiene consecuencias legales y comerciales devastadoras.",
            "stat": "180+",
            "statLabel": "nuevas normas sanitarias en 2024"
          }
        ]
      }
    },
    {
      "id": "proc-steps",
      "type": "features",
      "order": 2,
      "visible": true,
      "content": {
        "badge": "Metodología Certificada",
        "title": "Nuestro Proceso de 4 Etapas",
        "subtitle": "Una metodología probada que garantiza resultados medibles desde la primera semana de implementación",
        "items": [
          {
            "icon": "Microscope",
            "title": "Diagnóstico de Riesgo Microbiológico",
            "description": "Realizamos un levantamiento exhaustivo de su instalación mediante análisis de superficies, muestreo de aire y mapeo de puntos críticos de control. Identificamos exactamente qué patógenos están presentes y dónde se encuentran.",
            "duration": "1 a 3 días hábiles",
            "result": "Informe de Riesgo Certificado",
            "details": [
              "Muestreo ambiental con hisopados en 50+ puntos",
              "Análisis microbiológico en laboratorio acreditado",
              "Identificación de cepas por espectrometría MALDI-TOF",
              "Evaluación de biopelículas en superficies",
              "Reporte con mapa de riesgo codificado por colores",
              "Recomendaciones preventivas inmediatas"
            ]
          },
          {
            "icon": "FlaskConical",
            "title": "Diseño de Protocolo Personalizado",
            "description": "Con base en los resultados del diagnóstico, nuestro equipo científico formula un protocolo de tratamiento a la medida de su industria, producto y carga microbiana específica. No existe un tratamiento único para todos.",
            "duration": "2 a 5 días hábiles",
            "result": "Protocolo Certificado por Ingeniero",
            "details": [
              "Selección de la fórmula BNX adecuada al patógeno",
              "Cálculo de concentración óptima por superficie",
              "Diseño de cronograma de aplicación",
              "Definición de EPP y medidas de seguridad",
              "Plan de contingencia ante rebrotes",
              "Documentación compatible con BPM / HACCP / ISO"
            ]
          },
          {
            "icon": "Factory",
            "title": "Implementación Controlada",
            "description": "Nuestro equipo técnico certificado aplica el protocolo diseñado utilizando equipos de nebulización de última generación. Cada aplicación es documentada y registrada en tiempo real para trazabilidad completa.",
            "duration": "1 día a 2 semanas según instalación",
            "result": "Certificado de Aplicación con Sello BNX",
            "details": [
              "Nebulización en frío de ultra bajo volumen (ULV)",
              "Cobertura de superficies difíciles y espacios aéreos",
              "Control de dosificación con sensores digitales",
              "Registro fotográfico y digital de cada zona",
              "Aplicación en horarios de no producción",
              "Sin necesidad de evacuar permanentemente"
            ]
          },
          {
            "icon": "TrendingUp",
            "title": "Monitoreo y Seguimiento Continuo",
            "description": "La implementación no termina con la aplicación. Nuestro programa de seguimiento garantiza que la protección se mantenga en el tiempo mediante monitoreos periódicos y ajustes del protocolo según los resultados.",
            "duration": "Programa mensual / trimestral",
            "result": "Protección Continua Garantizada",
            "details": [
              "Muestreos de verificación post-tratamiento",
              "Dashboard digital con indicadores en tiempo real",
              "Alertas automáticas ante anomalías microbiológicas",
              "Ajuste del protocolo basado en nuevos datos",
              "Informes de cumplimiento para auditorías",
              "Soporte técnico prioritario 24/7"
            ]
          }
        ]
      }
    },
    {
      "id": "proc-sectors",
      "type": "sectors",
      "order": 3,
      "visible": true,
      "content": {
        "title": "Industrias que Protegemos",
        "subtitle": "Nuestra metodología se adapta a los requisitos específicos de cada sector. Hemos trabajado con los estándares más exigentes del mundo.",
        "items": [
          {"icon": "Apple", "title": "Agroindustria", "description": "Protección de cultivos, postcosecha y procesado de alimentos frescos"},
          {"icon": "Warehouse", "title": "Almacenamiento", "description": "Silos, bodegas y cámaras de frío libres de patógenos fúngicos"},
          {"icon": "Factory", "title": "Manufactura", "description": "Líneas de producción que cumplen los estándares BPM y HACCP"},
          {"icon": "Fish", "title": "Acuicultura", "description": "Cultivos de camarón, tilapia y salmón con mínima mortalidad microbiana"},
          {"icon": "HeartPulse", "title": "Salud & Hospitalario", "description": "Ambientes clínicos libres de patógenos resistentes (MRSA, VRE)"},
          {"icon": "Sprout", "title": "Agricultura Orgánica", "description": "Protección certificada para exportación orgánica sin residuos"},
          {"icon": "Building2", "title": "Hoteles & Turismo", "description": "Ambientes seguros con protección invisible y continua"},
          {"icon": "Shirt", "title": "Textil & Confección", "description": "Telas antimicrobianas y protección de área de producción"}
        ]
      }
    },
    {
      "id": "proc-timeline",
      "type": "timeline",
      "order": 4,
      "visible": true,
      "content": {
        "title": "Cronograma de Implementación",
        "subtitle": "De la primera llamada a la protección total: así fluye nuestro proceso",
        "milestones": [
          {"phase": "Semana 1", "time": "Diagnóstico", "desc": "Visita técnica y muestreo exhaustivo de su instalación"},
          {"phase": "Semana 2", "time": "Diseño", "desc": "Protocolo personalizado listo y validado por ingeniería"},
          {"phase": "Semana 3", "time": "Aplicación", "desc": "Implementación certificada con equipos ULV de última generación"},
          {"phase": "Semana 4", "time": "Validación", "desc": "Muestreo post-tratamiento y reporte de resultados"},
          {"phase": "Mensual", "time": "Seguimiento", "desc": "Monitoreo continuo y ajustes para mantener la protección"}
        ]
      }
    },
    {
      "id": "proc-stats",
      "type": "stats",
      "order": 5,
      "visible": true,
      "content": {
        "title": "Los Números No Mienten",
        "subtitle": "Resultados reales medidos en las instalaciones de nuestros clientes activos",
        "stats": [
          {"value": "500+", "label": "Instalaciones Protegidas", "description": "En 25 países de 4 continentes"},
          {"value": "99.99%", "label": "Eficacia Promedio", "description": "Medida en muestreos post-tratamiento"},
          {"value": "58%", "label": "Reducción de Pérdidas", "description": "Promedio en sector agroindustrial"},
          {"value": "0", "label": "Recalls por Contaminación", "description": "En clientes con programa continuo activo"}
        ]
      }
    },
    {
      "id": "proc-certifications",
      "type": "certifications",
      "order": 6,
      "visible": true,
      "content": {
        "title": "Respaldo Normativo Internacional",
        "subtitle": "Nuestros procesos están certificados bajo los estándares más rigurosos del mundo, garantizando que su empresa cumpla con cualquier auditoría",
        "items": [
          {
            "acronym": "USDA",
            "name": "USDA Organic",
            "description": "Certificación del Departamento de Agricultura de EE.UU. que avala que nuestros productos son aptos para uso en agricultura orgánica certificada para exportación.",
            "year": "2021"
          },
          {
            "acronym": "ISO",
            "name": "ISO 9001:2015",
            "description": "Certificación de Sistema de Gestión de Calidad que garantiza la consistencia y trazabilidad de cada lote producido y cada proceso de aplicación.",
            "year": "2020"
          },
          {
            "acronym": "EPA",
            "name": "EPA Registered",
            "description": "Registro ante la Agencia de Protección Ambiental de EE.UU. que confirma la seguridad ambiental del producto y su eficacia contra patógenos declarados.",
            "year": "2022"
          },
          {
            "acronym": "ANLA",
            "name": "ANLA Colombia",
            "description": "Autorización de la Autoridad Nacional de Licencias Ambientales de Colombia, certificando el bajo impacto ecológico del producto y su proceso de fabricación.",
            "year": "2018"
          },
          {
            "acronym": "BPM",
            "name": "Buenas Prácticas de Manufactura",
            "description": "Cumplimiento de las BPM exigidas por el INVIMA para la fabricación de productos de uso sanitario, asegurando calidad desde el origen.",
            "year": "2019"
          },
          {
            "acronym": "HACCP",
            "name": "HACCP Compatible",
            "description": "Nuestros procesos y productos son compatibles con los sistemas de Análisis de Peligros y Puntos Críticos de Control en la industria alimentaria.",
            "year": "2021"
          }
        ]
      }
    },
    {
      "id": "proc-quote",
      "type": "quote",
      "order": 7,
      "visible": true,
      "content": {
        "quote": "Antes de BNX, perdíamos entre el 20 y 25% de nuestra producción de aguacate Hass por antracnosis en postcosecha. Después de implementar el protocolo, las pérdidas cayeron al 3%. El retorno de inversión fue evidente desde el segundo mes.",
        "author": "Carlos Martínez",
        "role": "Gerente de Producción — Finca El Progreso, Colombia",
        "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop"
      }
    },
    {
      "id": "proc-faq",
      "type": "faq",
      "order": 8,
      "visible": true,
      "content": {
        "title": "Preguntas Sobre el Proceso",
        "subtitle": "Todo lo que necesita saber antes de dar el primer paso",
        "ctaText": "¿Tiene más preguntas? Contáctenos",
        "ctaLink": "/#contact",
        "items": [
          {
            "question": "¿Necesito detener mi producción para implementar BNX?",
            "answer": "No necesariamente. En la mayoría de los casos, la aplicación se realiza en horarios de baja actividad (turnos nocturnos, fines de semana o pausas programadas). El tiempo de ventilación post-aplicación es entre 20 y 40 minutos dependiendo del tipo de espacio. Diseñamos el cronograma para minimizar el impacto en su operación."
          },
          {
            "question": "¿Cuánto tiempo pasa antes de ver resultados?",
            "answer": "Los resultados microbiológicos se evidencian desde la primera aplicación. En los muestreos de verificación realizados entre 48 y 72 horas post-aplicación, la reducción de carga microbiana es del 99%+ en superficies tratadas. Los impactos en indicadores operativos (menores pérdidas, mayor vida útil del producto) se observan típicamente en el primer ciclo de producción completo."
          },
          {
            "question": "¿Qué pasa si tenemos una auditoría sanitaria durante el proceso?",
            "answer": "BNX está específicamente diseñado para facilitar las auditorías, no complicarlas. Toda nuestra documentación (certificados de análisis, fichas técnicas, registros de aplicación, muestreos) está preparada en el formato que exigen INVIMA, FDA, BRC, SQF y otros organismos certificadores. Hemos acompañado a más de 80 empresas durante auditorías exitosas."
          },
          {
            "question": "¿Cuál es el costo aproximado de implementación?",
            "answer": "El costo depende del tamaño de la instalación, la carga microbiana y el tipo de protocolo requerido. Trabajamos con modelos de pago flexible: aplicación única, programa mensual o contrato anual. En promedio, el costo del programa BNX representa solo el 3-8% de las pérdidas medias que evita. Solicite una cotización sin costo."
          },
          {
            "question": "¿BNX es compatible con mis productos de limpieza actuales?",
            "answer": "BNX es compatible con la mayoría de protocolos de limpieza estándar. Sin embargo, para maximizar su eficacia, recomendamos aplicarlo después de los procesos de limpieza y desinfección convencionales, no como sustituto de estos en la primera fase. Nuestro equipo evaluará su protocolo actual y le indicará la secuencia óptima."
          },
          {
            "question": "¿Ofrecen soporte técnico continuo después de la implementación?",
            "answer": "Sí, todos nuestros planes incluyen soporte técnico. En el plan Continuo, disponemos de un ingeniero asignado a su cuenta, con acceso a dashboard en tiempo real, alertas automáticas por anomalías y retención de respuesta ante emergencias en menos de 4 horas durante días hábiles."
          }
        ]
      }
    },
    {
      "id": "proc-cta",
      "type": "cta",
      "order": 9,
      "visible": true,
      "content": {
        "emoji": "🛡️",
        "title": "¿Listo para Proteger su Operación?",
        "subtitle": "Solicite un diagnóstico gratuito. Nuestro equipo realizará un análisis preliminar de su instalación sin costo ni compromiso y le entregará un informe con los riesgos identificados.",
        "ctaText": "Solicitar Diagnóstico Gratuito",
        "ctaLink": "/#contact",
        "secondaryCtaText": "Ver Nuestros Productos",
        "secondaryCtaLink": "/store"
      }
    }
  ]'
);

-- ================================================================
-- INGLÉS (EN)
-- ================================================================
INSERT INTO page_contents (page_id, language, sections)
VALUES (
  'page-process',
  'en',
  $$[
    {
      "id": "proc-hero",
      "type": "hero",
      "order": 0,
      "visible": true,
      "content": {
        "badge": "Industrial Processes",
        "title": "Total Protection for Your Industry",
        "subtitle": "From microbial threat to operational peace of mind in 4 stages. Our certified process has protected more than 500 industrial facilities in 25 countries.",
        "backgroundImage": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&fit=crop",
        "ctaText": "See Our Process",
        "ctaLink": "#process-steps",
        "secondaryCtaText": "Schedule a Diagnosis",
        "secondaryCtaLink": "/#contact",
        "seo": {
          "metaTitle": "Industrial Processes BNX | Bionano A&T",
          "metaDescription": "Discover the implementation process of Bionanoaxus BNX to protect your industry: diagnosis, design, application and certified follow-up.",
          "metaKeywords": "industrial process, BNX, industrial disinfection, antimicrobial protection, bionanotechnology"
        }
      }
    },
    {
      "id": "proc-problems",
      "type": "problems",
      "order": 1,
      "visible": true,
      "content": {
        "badge": "The Real Problem",
        "title": "What Is Contamination Costing Your Company?",
        "subtitle": "Undetected microbial contamination silently destroys the profitability of thousands of companies every year",
        "items": [
          {"icon": "TrendingUp", "title": "Value Chain Losses", "description": "Fungal and bacterial contamination destroys between 15 and 40% of agricultural and industrial production before reaching the market.", "stat": "40%", "statLabel": "average losses from contamination"},
          {"icon": "AlertTriangle", "title": "Regulatory Recalls", "description": "A contamination outbreak can mean the withdrawal of an entire production line and million-dollar fines from health regulators.", "stat": "$2.8M", "statLabel": "average cost of a recall"},
          {"icon": "Factory", "title": "Resistance to Conventional Products", "description": "Bacteria and fungi develop resistance to chemical disinfectants within 3-6 months of continuous use.", "stat": "73%", "statLabel": "strains resistant to disinfectants"},
          {"icon": "Microscope", "title": "Invisible Cross-Contamination", "description": "68% of contamination outbreaks occur on visually clean surfaces that harbor invisible microbial biofilms.", "stat": "68%", "statLabel": "outbreaks on visually clean surfaces"},
          {"icon": "Globe", "title": "Export Barriers", "description": "International buyers require microbiological certifications that many plants cannot guarantee with conventional products.", "stat": "1 in 3", "statLabel": "exporters rejected by micro standards"},
          {"icon": "FileCheck", "title": "Rising Regulatory Compliance", "description": "International sanitary regulations are increasingly strict. Falling behind has devastating legal and commercial consequences.", "stat": "180+", "statLabel": "new sanitary regulations in 2024"}
        ]
      }
    },
    {
      "id": "proc-steps",
      "type": "features",
      "order": 2,
      "visible": true,
      "content": {
        "badge": "Certified Methodology",
        "title": "Our 4-Stage Process",
        "subtitle": "A proven methodology that guarantees measurable results from the first week of implementation",
        "items": [
          {
            "icon": "Microscope",
            "title": "Microbiological Risk Assessment",
            "description": "We conduct a comprehensive survey of your facility through surface analysis, air sampling, and critical control point mapping. We identify exactly which pathogens are present and where they are located.",
            "duration": "1 to 3 business days",
            "result": "Certified Risk Report",
            "details": ["Environmental swab sampling at 50+ points", "Microbiological analysis at accredited laboratory", "Strain identification by MALDI-TOF spectrometry", "Biofilm evaluation on surfaces", "Color-coded risk map report", "Immediate preventive recommendations"]
          },
          {
            "icon": "FlaskConical",
            "title": "Custom Protocol Design",
            "description": "Based on diagnostic results, our scientific team formulates a treatment protocol tailored to your specific industry, product, and microbial load. There is no one-size-fits-all treatment.",
            "duration": "2 to 5 business days",
            "result": "Engineer-Certified Protocol",
            "details": ["BNX formula selection suited to pathogen", "Optimal concentration calculation per surface", "Application schedule design", "PPE and safety measures definition", "Contingency plan for re-outbreaks", "Documentation compatible with GMP / HACCP / ISO"]
          },
          {
            "icon": "Factory",
            "title": "Controlled Implementation",
            "description": "Our certified technical team applies the designed protocol using state-of-the-art nebulization equipment. Each application is documented and recorded in real time for complete traceability.",
            "duration": "1 day to 2 weeks depending on facility",
            "result": "Application Certificate with BNX Seal",
            "details": ["Ultra low volume (ULV) cold nebulization", "Coverage of hard-to-reach surfaces and air spaces", "Dosage control with digital sensors", "Photographic and digital record of each zone", "Application during non-production hours", "No permanent evacuation required"]
          },
          {
            "icon": "TrendingUp",
            "title": "Monitoring and Continuous Follow-up",
            "description": "Implementation does not end with the application. Our follow-up program ensures protection is maintained over time through periodic monitoring and protocol adjustments based on results.",
            "duration": "Monthly / quarterly program",
            "result": "Guaranteed Continuous Protection",
            "details": ["Post-treatment verification sampling", "Digital dashboard with real-time indicators", "Automatic alerts for microbiological anomalies", "Protocol adjustment based on new data", "Compliance reports for audits", "Priority 24/7 technical support"]
          }
        ]
      }
    },
    {
      "id": "proc-sectors",
      "type": "sectors",
      "order": 3,
      "visible": true,
      "content": {
        "title": "Industries We Protect",
        "subtitle": "Our methodology adapts to the specific requirements of each sector. We have worked with the most demanding standards in the world.",
        "items": [
          {"icon": "Apple", "title": "Agroindustry", "description": "Crop protection, post-harvest and fresh food processing"},
          {"icon": "Warehouse", "title": "Storage", "description": "Silos, warehouses and cold rooms free of fungal pathogens"},
          {"icon": "Factory", "title": "Manufacturing", "description": "Production lines meeting GMP and HACCP standards"},
          {"icon": "Fish", "title": "Aquaculture", "description": "Shrimp, tilapia and salmon farming with minimal microbial mortality"},
          {"icon": "HeartPulse", "title": "Healthcare", "description": "Clinical environments free of resistant pathogens (MRSA, VRE)"},
          {"icon": "Sprout", "title": "Organic Agriculture", "description": "Certified protection for organic export without residues"},
          {"icon": "Building2", "title": "Hotels & Tourism", "description": "Safe environments with invisible and continuous protection"},
          {"icon": "Shirt", "title": "Textile & Apparel", "description": "Antimicrobial fabrics and production area protection"}
        ]
      }
    },
    {
      "id": "proc-timeline",
      "type": "timeline",
      "order": 4,
      "visible": true,
      "content": {
        "title": "Implementation Timeline",
        "subtitle": "From the first call to total protection: this is how our process flows",
        "milestones": [
          {"phase": "Week 1", "time": "Diagnosis", "desc": "Technical visit and comprehensive sampling of your facility"},
          {"phase": "Week 2", "time": "Design", "desc": "Customized protocol ready and validated by engineering"},
          {"phase": "Week 3", "time": "Application", "desc": "Certified implementation with latest-gen ULV equipment"},
          {"phase": "Week 4", "time": "Validation", "desc": "Post-treatment sampling and results report"},
          {"phase": "Monthly", "time": "Follow-up", "desc": "Continuous monitoring and adjustments to maintain protection"}
        ]
      }
    },
    {
      "id": "proc-stats",
      "type": "stats",
      "order": 5,
      "visible": true,
      "content": {
        "title": "The Numbers Do Not Lie",
        "subtitle": "Real results measured at the facilities of our active clients",
        "stats": [
          {"value": "500+", "label": "Protected Facilities", "description": "In 25 countries across 4 continents"},
          {"value": "99.99%", "label": "Average Efficacy", "description": "Measured in post-treatment sampling"},
          {"value": "58%", "label": "Loss Reduction", "description": "Average in agroindustrial sector"},
          {"value": "0", "label": "Recalls from Contamination", "description": "In clients with active continuous program"}
        ]
      }
    },
    {
      "id": "proc-certifications",
      "type": "certifications",
      "order": 6,
      "visible": true,
      "content": {
        "title": "International Regulatory Backing",
        "subtitle": "Our processes are certified under the most rigorous standards in the world, ensuring your company can pass any audit",
        "items": [
          {"acronym": "USDA", "name": "USDA Organic", "description": "Certification from the U.S. Department of Agriculture validating that our products are suitable for use in certified organic agriculture for export.", "year": "2021"},
          {"acronym": "ISO", "name": "ISO 9001:2015", "description": "Quality Management System certification guaranteeing the consistency and traceability of each batch produced and each application process.", "year": "2020"},
          {"acronym": "EPA", "name": "EPA Registered", "description": "Registration with the U.S. Environmental Protection Agency confirming the environmental safety of the product and its efficacy against declared pathogens.", "year": "2022"},
          {"acronym": "ANLA", "name": "ANLA Colombia", "description": "Authorization from the National Environmental Licensing Authority of Colombia, certifying the low ecological impact of the product.", "year": "2018"},
          {"acronym": "GMP", "name": "Good Manufacturing Practices", "description": "GMP compliance required by INVIMA for the manufacture of sanitary use products, ensuring quality from the source.", "year": "2019"},
          {"acronym": "HACCP", "name": "HACCP Compatible", "description": "Our processes and products are compatible with Hazard Analysis and Critical Control Point systems in the food industry.", "year": "2021"}
        ]
      }
    },
    {
      "id": "proc-quote",
      "type": "quote",
      "order": 7,
      "visible": true,
      "content": {
        "quote": "Before BNX, we were losing between 20 and 25% of our Hass avocado production to post-harvest anthracnose. After implementing the protocol, losses dropped to 3%. The return on investment was evident from the second month.",
        "author": "Carlos Martínez",
        "role": "Production Manager — Finca El Progreso, Colombia",
        "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop"
      }
    },
    {
      "id": "proc-faq",
      "type": "faq",
      "order": 8,
      "visible": true,
      "content": {
        "title": "Questions About the Process",
        "subtitle": "Everything you need to know before taking the first step",
        "ctaText": "Have more questions? Contact us",
        "ctaLink": "/#contact",
        "items": [
          {"question": "Do I need to stop production to implement BNX?", "answer": "Not necessarily. In most cases, application is done during low-activity hours (night shifts, weekends, or scheduled pauses). Post-application ventilation time is between 20 and 40 minutes depending on the space type. We design the schedule to minimize impact on your operation."},
          {"question": "How long before I see results?", "answer": "Microbiological results are evident from the first application. In verification samples taken 48-72 hours post-application, the reduction in microbial load is 99%+ on treated surfaces. Impacts on operational indicators are typically observed in the first complete production cycle."},
          {"question": "What if we have a health audit during the process?", "answer": "BNX is specifically designed to facilitate audits, not complicate them. All our documentation is ready in the format required by FDA, BRC, SQF and other certification bodies. We have accompanied over 80 companies through successful audits."},
          {"question": "What is the approximate cost of implementation?", "answer": "Cost depends on facility size, microbial load and required protocol type. We work with flexible payment models: single application, monthly program or annual contract. On average, the BNX program cost represents only 3-8% of the average losses it prevents."},
          {"question": "Is BNX compatible with my current cleaning products?", "answer": "BNX is compatible with most standard cleaning protocols. However, to maximize efficacy, we recommend applying it after conventional cleaning and disinfection processes. Our team will evaluate your current protocol and indicate the optimal sequence."},
          {"question": "Do you offer continuous technical support after implementation?", "answer": "Yes, all our plans include technical support. In the Continuous plan, we have an engineer assigned to your account, with access to a real-time dashboard, automatic anomaly alerts, and emergency response in less than 4 hours on business days."}
        ]
      }
    },
    {
      "id": "proc-cta",
      "type": "cta",
      "order": 9,
      "visible": true,
      "content": {
        "emoji": "🛡️",
        "title": "Ready to Protect Your Operation?",
        "subtitle": "Request a free diagnosis. Our team will conduct a preliminary analysis of your facility at no cost or commitment and deliver a report with identified risks.",
        "ctaText": "Request Free Diagnosis",
        "ctaLink": "/#contact",
        "secondaryCtaText": "View Our Products",
        "secondaryCtaLink": "/store"
      }
    }
  ]$$
);
