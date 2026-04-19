import fs from 'fs';

const pagesData = {
  "page-home": {
    "es": [{"id": "home-hero", "type": "hero", "order": 0, "content": {"seo": {"metaTitle": "Bionano A&T | Soluciones Bionanotecnológicas", "metaKeywords": "bionanotecnología, BNX, antimicrobiano, fungicida, sostenible, nanotecnología", "metaDescription": "Bionanoaxus (BNX): Innovación en bionanotecnología para protección antimicrobiana y fungicida sostenible."}, "title": "Bionanoaxus (BNX)", "ctaLink": "/store", "ctaText": "Explorar Catálogo", "subtitle": "La revolución bionanotecnológica que cuida su industria y el planeta. Soluciones antimicrobianas y fungicidas de origen orgánico con precisión atómica.", "backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1775964807642_edly1hf8t.webp?v=1775964811213", "secondaryCtaLink": "/technology", "secondaryCtaText": "Nuestra Tecnología"}, "visible": true}, {"id": "home-trust", "type": "trust", "order": 10, "content": {"partners": [{"link": "https://www.agrosavia.co", "name": "AGROSAVIA", "image": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&h=200&fit=crop", "details": ["Investigación aplicada en campo", "Validación de productos BNX", "Certificación agrícola nacional"], "description": "Corporación colombiana de investigación agropecuaria. Aliado estratégico en validación de soluciones para el sector agrícola.", "placeholder": "Investigación Agrícola"}, {"link": "https://www.procolombia.co", "name": "ProColombia", "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop", "details": ["Apoyo en mercados internacionales", "Red de distribución global", "Certificación de exportación"], "description": "Entidad gubernamental que promueve el turismo, la inversión y las exportaciones de Colombia al mundo.", "placeholder": "Promoción Internacional"}, {"link": "https://minciencias.gov.co", "name": "MinCiencias", "image": "https://ik.imagekit.io/wfm4vebzr/perfiles/avatares/avatar_user_default_1775966374482_895o48o2e.webp?v=1775966377623", "details": ["Financiación I+D+i", "Reconocimiento tecnológico", "Respaldo institucional"], "description": "Ministerio de Ciencias que respalda la innovación tecnológica nacional, avalando la investigación de Bionano A&T.", "placeholder": "Ciencia & Innovación"}, {"name": "BioTrade", "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&h=200&fit=crop", "details": ["Certificación de comercio justo", "Red de distribución orgánica", "Mercados premium"], "description": "Red de comercio sostenible que certifica productos de origen biológico para mercados internacionales.", "placeholder": "Comercio Verde"}, {"name": "AgroNet", "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=400&h=200&fit=crop", "details": ["Conectividad rural", "Difusión tecnológica", "Capacitación de productores"], "description": "Plataforma integral de conexión agrícola que facilita el acceso de productores a tecnologías innovadoras.", "placeholder": "Red Agrícola"}, {"name": "EcoInvest", "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop", "details": ["Capital semilla", "Mentoría empresarial", "Acceso a mercados"], "description": "Fondo de inversión especializado en startups de biotecnología y economía circular.", "placeholder": "Inversión Verde"}]}, "visible": true}, {"id": "home-purpose", "type": "features", "order": 20, "content": {"items": [{"icon": "Users", "title": "Misión", "description": "<p>Desarrollar soluciones bionanotecnológicas orgánicas que protejan cultivos, industrias y espacios, eliminando patógenos sin dañar el ecosistema ni la salud humana.</p>"}, {"icon": "Target", "title": "Visión", "description": "Ser líderes globales en biotecnología sostenible para 2030, presentes en más de 50 países con productos certificados internacionalmente."}, {"icon": "Lightbulb", "title": "Innovación", "description": "Combinamos nanotecnología de vanguardia con principios activos orgánicos para crear soluciones que la industria convencional no puede igualar."}]}, "visible": true}, {"id": "home-featured", "type": "featured", "order": 30, "content": {"title": "Producto Estrella", "ctaLink": "/store", "ctaText": "Ver Detalles y Precios", "features": [{"icon": "Shield", "title": "Eficacia Comprobada", "description": "Elimina el 99.99% de bacterias, hongos y virus con una sola aplicación, avalado por estudios de laboratorio internacionales."}, {"icon": "Leaf", "title": "100% Orgánico", "description": "Formulado con extractos naturales y nanopartículas biodegradables. No deja residuos tóxicos ni afecta la cadena alimentaria."}, {"icon": "Droplets", "title": "Múltiples Aplicaciones", "description": "Válido para agricultura, industria alimentaria, hospitales, acuicultura y espacios públicos. Un producto, infinitas soluciones."}], "productName": "Bionanoaxus (BNX)", "productImage": "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&fit=crop", "productDescription": "<p>Nuestra solución insignia de desinfección y protección antimicrobiana de última generación. Formulado con nanopartículas de plata orgánica y extractos botánicos activos, BNX ofrece una eficacia sin precedentes contra bacterias, hongos, virus y esporas, con impacto mínimo sobre el ecosistema.</p>"}, "visible": true}, {"id": "home-products", "type": "products", "order": 40, "content": {"title": "Soluciones para Cada Industria", "ctaLink": "/store", "ctaText": "Ver Catalogo completo", "subtitle": "Descubre nuestra gama completa de productos bionanotecnológicos, diseñados para satisfacer las necesidades específicas de cada sector productivo.", "selectedProductIds": ["prod-003", "prod-001", "prod-002"]}, "visible": true}, {"id": "home-timeline", "type": "timeline", "order": 50, "content": {"title": "Nuestra Historia", "subtitle": "Una trayectoria de innovación constante", "milestones": [{"icon": "Lightbulb", "year": "2015", "title": "Fundación en Colombia", "description": "Nace Bionano A&T con la misión de democratizar la biotecnología sostenible en Latinoamérica."}, {"icon": "FileCheck", "year": "2017", "title": "Primera Patente BNX", "description": "Registro de la primera patente de la fórmula Bionanoaxus ante la Superintendencia de Industria y Comercio."}, {"icon": "TrendingUp", "year": "2019", "title": "Expansión Regional", "description": "Entrada a mercados de México, Perú y Ecuador, consolidando nuestra presencia en América Latina."}, {"icon": "FileCheck", "year": "2021", "title": "Certificación Internacional", "description": "Obtención de certificaciones ISO 9001 y aprobación del USDA para exportación de productos orgánicos."}, {"icon": "TrendingUp", "year": "2023", "title": "Alianzas Globales", "description": "Firma de acuerdos de distribución con socios en Europa y Asia, alcanzando presencia en 25 países."}, {"icon": "Lightbulb", "year": "2025", "title": "Nueva Era Digital", "description": "Lanzamiento de la plataforma digital de pedidos B2B y el laboratorio de investigación de próxima generación."}], "description": "<p>Desde nuestra fundación hemos recorrido un camino de investigación, validación y expansión global, construyendo la plataforma biotecnológica del futuro.</p>"}, "visible": true}, {"id": "home-team", "type": "team", "order": 60, "content": {"title": "Nuestros Líderes", "members": [{"name": "Dr. Carlos Andrade", "role": "CEO & Co-Fundador", "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop", "linkedin": "https://linkedin.com"}, {"name": "Dra. Sofía Ramírez", "role": "Directora Científica", "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop", "linkedin": "https://linkedin.com"}, {"name": "Ing. Ricardo Flores", "role": "Director de Operaciones", "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&fit=crop", "linkedin": "https://linkedin.com"}, {"name": "Mgs. Valentina Cruz", "role": "Directora Comercial", "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop", "linkedin": "https://linkedin.com"}], "subtitle": "Un equipo multidisciplinario de científicos, ingenieros y expertos en negocios internacionales unidos por la pasión de transformar industrias a través de la biotecnología."}, "visible": true}, {"id": "home-ecosystem", "type": "ecosystem", "order": 70, "content": {"items": [{"desc": "Conectamos profesionales del sector biotecnológico y agroindustrial para crear sinergias de alto impacto.", "label": "Red de Innovadores", "title": "Red de Innovadores", "iconPath": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", "description": "Conectamos profesionales del sector biotecnológico y agroindustrial para crear sinergias de alto impacto."}, {"desc": "Impulsamos el desarrollo responsable que equilibra la rentabilidad económica con el cuidado del planeta.", "label": "Crecimiento Sostenible", "title": "Crecimiento Sostenible", "iconPath": "", "description": "Impulsamos el desarrollo responsable que equilibra la rentabilidad económica con el cuidado del planeta."}], "title": "Nuestro Ecosistema", "subtitle": "Conectamos innovadores, empresarios y profesionales para construir un ecosistema de negocios sostenible y tecnológico que impulse la economía verde."}, "visible": true}, {"id": "home-news", "type": "news", "order": 80, "content": {"title": "Noticias y Artículos", "subtitle": "Mantente al tanto de los últimos avances en bionanotecnología, sostenibilidad y los logros de Bionano A&amp;T."}, "visible": true}],
    "en": [{"id": "home-hero", "type": "hero", "order": 0, "content": {"seo": {"metaTitle": "Bionano A&T | Bionanotechnological Solutions", "metaKeywords": "bionanotechnology, BNX, antimicrobial, fungicide, sustainable, nanotechnology", "metaDescription": "Bionanoaxus (BNX): Innovation in bionanotechnology for sustainable antimicrobial and fungicidal protection."}, "title": "Bionanoaxus (BNX)", "ctaLink": "/store", "ctaText": "Explore Catalog", "subtitle": "The bionanotechnology revolution that protects your industry and the planet. Organic antimicrobial and fungicidal solutions with atomic precision.", "backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1775964807642_edly1hf8t.webp?v=1775964811213", "secondaryCtaLink": "/technology", "secondaryCtaText": "Our Technology"}, "visible": true}, {"id": "home-trust", "type": "trust", "order": 10, "content": {"partners": [{"link": "https://www.agrosavia.co", "name": "AGROSAVIA", "image": "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=400&h=200&fit=crop", "details": ["Applied field research", "BNX product validation", "National agricultural certification"], "description": "Colombian corporation for agricultural research. Strategic ally in validating solutions for the agricultural sector.", "placeholder": "Agricultural Research"}, {"link": "https://www.procolombia.co", "name": "ProColombia", "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop", "details": ["International market support", "Global distribution network", "Export certification"], "description": "Government entity promoting tourism, investment and Colombian exports worldwide.", "placeholder": "International Promotion"}, {"link": "https://minciencias.gov.co", "name": "MinCiencias", "image": "https://ik.imagekit.io/wfm4vebzr/perfiles/avatares/avatar_user_default_1775966374482_895o48o2e.webp?v=1775966377623", "details": ["R&D financing", "Technological recognition", "Institutional support"], "description": "Ministry of Sciences that supports national technological innovation, endorsing Bionano A&T research.", "placeholder": "Science & Innovation"}, {"name": "BioTrade", "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=400&h=200&fit=crop", "details": ["Fair trade certification", "Organic distribution network", "Premium markets"], "description": "Sustainable trade network certifying biological origin products for international markets.", "placeholder": "Green Trade"}, {"name": "AgroNet", "image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=400&h=200&fit=crop", "details": ["Rural connectivity", "Technology dissemination", "Producer training"], "description": "Comprehensive agricultural connection platform facilitating producer access to innovative technologies.", "placeholder": "Agricultural Network"}, {"name": "EcoInvest", "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&h=200&fit=crop", "details": ["Seed capital", "Business mentoring", "Market access"], "description": "Investment fund specialized in biotechnology startups and circular economy.", "placeholder": "Green Investment"}]}, "visible": true}, {"id": "home-purpose", "type": "features", "order": 20, "content": {"items": [{"icon": "Users", "title": "Mission", "description": "Develop organic bionanotechnological solutions that protect crops, industries and spaces, eliminating pathogens without harming the ecosystem or human health."}, {"icon": "Target", "title": "Vision", "description": "To be global leaders in sustainable biotechnology by 2030, present in more than 50 countries with internationally certified products."}, {"icon": "Lightbulb", "title": "Innovation", "description": "We combine cutting-edge nanotechnology with organic active ingredients to create solutions that conventional industry cannot match."}]}, "visible": true}, {"id": "home-featured", "type": "featured", "order": 30, "content": {"title": "Star Product", "ctaLink": "/store", "ctaText": "View Details & Pricing", "features": [{"icon": "Shield", "title": "Proven Efficacy", "description": "Eliminates 99.99% of bacteria, fungi and viruses with a single application, backed by international laboratory studies."}, {"icon": "Leaf", "title": "100% Organic", "description": "Formulated with natural extracts and biodegradable nanoparticles. Leaves no toxic residues or food chain impact."}, {"icon": "Droplets", "title": "Multiple Applications", "description": "Valid for agriculture, food industry, hospitals, aquaculture and public spaces. One product, infinite solutions."}], "productName": "Bionanoaxus (BNX)", "productImage": "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&fit=crop", "productDescription": "<p>Our flagship next-generation antimicrobial disinfection and protection solution. Formulated with organic silver nanoparticles and active botanical extracts, BNX offers unprecedented efficacy against bacteria, fungi, viruses and spores, with minimal ecosystem impact.</p>"}, "visible": true}, {"id": "home-products", "type": "products", "order": 40, "content": {"title": "Solutions for Every Industry", "subtitle": "Discover our complete range of bionanotechnological products, designed to meet the specific needs of each productive sector.", "selectedProductIds": ["prod-003", "prod-001", "prod-002"]}, "visible": true}, {"id": "home-timeline", "type": "timeline", "order": 50, "content": {"title": "Our History", "subtitle": "A journey of constant innovation", "milestones": [{"icon": "Lightbulb", "year": "2015", "title": "Founded in Colombia", "description": "Bionano A&T was born with the mission of democratizing sustainable biotechnology in Latin America."}, {"icon": "FileCheck", "year": "2017", "title": "First BNX Patent", "description": "Registration of the first Bionanoaxus formula patent with the Superintendence of Industry and Commerce."}, {"icon": "TrendingUp", "year": "2019", "title": "Regional Expansion", "description": "Entry into markets in Mexico, Peru and Ecuador, consolidating our presence in Latin America."}, {"icon": "FileCheck", "year": "2021", "title": "International Certification", "description": "Obtaining ISO 9001 certifications and USDA approval for export of organic products."}, {"icon": "TrendingUp", "year": "2023", "title": "Global Alliances", "description": "Signing distribution agreements with partners in Europe and Asia, reaching presence in 25 countries."}, {"icon": "Lightbulb", "year": "2025", "title": "New Digital Era", "description": "Launch of the B2B digital ordering platform and the next-generation research laboratory."}], "description": "Since our founding, we have traveled a path of research, validation and global expansion, building the biotechnological platform of the future."}, "visible": true}, {"id": "home-team", "type": "team", "order": 60, "content": {"title": "Our Leaders", "members": [{"name": "Dr. Carlos Andrade", "role": "CEO & Co-Founder", "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop", "linkedin": "https://linkedin.com"}, {"name": "Dr. Sofía Ramírez", "role": "Chief Science Officer", "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop", "linkedin": "https://linkedin.com"}, {"name": "Eng. Ricardo Flores", "role": "Chief Operating Officer", "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&h=400&fit=crop", "linkedin": "https://linkedin.com"}, {"name": "Mgs. Valentina Cruz", "role": "Chief Commercial Officer", "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop", "linkedin": "https://linkedin.com"}], "subtitle": "A multidisciplinary team of scientists, engineers and international business experts united by the passion to transform industries through biotechnology."}, "visible": true}, {"id": "home-ecosystem", "type": "ecosystem", "order": 70, "content": {"items": [{"desc": "We connect professionals from the biotechnological and agroindustrial sector to create high-impact synergies.", "label": "Network of Innovators", "iconPath": "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"}, {"desc": "We promote responsible development that balances economic profitability with caring for the planet.", "label": "Sustainable Growth", "iconPath": ""}], "title": "Our Ecosystem", "subtitle": "We connect innovators, entrepreneurs and professionals to build a sustainable and technological business ecosystem that drives the green economy."}, "visible": true}, {"id": "home-news", "type": "news", "order": 80, "content": {"title": "News & Articles", "subtitle": "Stay up to date with the latest advances in bionanotechnology, sustainability and Bionano A&T achievements."}, "visible": true}]
  },
  "page-technology": {
    "es": [{"id":"tech-hero","type":"hero","order":0,"content":{"seo":{"metaTitle":"Tecnología BNX | Bionano A&T","metaKeywords":"V-Lab, R-Tech, nanotecnología, antimicrobiano, fungicida, BNX","metaDescription":"Descubre la ciencia detrás de Bionanoaxus: nanopartículas orgánicas, V-Lab y R-Tech para protección antimicrobiana de nueva generación."},"title":"Tecnología Bionano A&T","ctaLink":"/store","ctaText":"Ver Nuestros Productos","subtitle":"Donde la ciencia molecular se convierte en soluciones reales. Desarrollamos bionanotecnología que transforma la forma en que el mundo protege sus cultivos, alimentos e industrias.","backgroundImage":"https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1775966716178_ajfz0mem9.webp?v=1775966719587","secondaryCtaLink":"6c2b8381-ad2e-43bb-a2c3-cce614eac317","secondaryCtaText":"Contactar Equipo","secondaryCtaActionType":"popup"},"visible":true},{"id":"tech-features","type":"features","order":1,"content":{"items":[{"icon":"Microscope","title":"V-Lab: Laboratorio Virtual","details":["Simulación molecular 3D de alta precisión","Predicción de eficacia por cepa patógena","Optimización de concentraciones sin ensayos físicos","Integración con bases de datos microbiológicas globales","Resultados reproducibles y auditables"],"description":"Plataforma de modelado molecular en tiempo real que simula el comportamiento de nanopartículas antes de su síntesis. Reducimos ciclos de desarrollo de meses a días."},{"icon":"Atom","title":"R-Tech: Nanorecubrimientos Inteligentes","details":["Adherencia certificada en metales, plásticos y textiles","Liberación controlada del agente activo por contacto","Resistencia a humedad, UV y temperatura extrema","Cobertura homogénea en superficies complejas","Compatible con sistemas de nebulización industrial"],"description":"Sistema propietario de recubrimiento superficial de larga duración con nanopartículas de plata orgánica. Un solo tratamiento protege hasta 12 meses sin reactivaciones."},{"icon":"Shield","title":"BNX: Fórmula Insignia","details":["Eficacia del 99.99% contra 47 cepas documentadas","Tiempo de acción: menos de 30 segundos en superficies","Biodegradación completa en menos de 72 horas","Sin residuos tóxicos en suelos ni agua","Certificado USDA, EPA y ANLA Colombia"],"description":"Formulación líquida de amplio espectro que elimina bacterias, virus, hongos y esporas en contacto, sin generar resistencias microbianas."},{"icon":"Leaf","title":"AgroBio: Protección Agrícola","details":["Compatible con agricultura orgánica certificada","Sin periodo de carencia para cosecha","Reducción del 60% en pérdidas por hongos postcosecha","Aplicación por goteo, foliar o nebulización","Probado en: banano, aguacate, cacao, tomate, fresa"],"description":"Línea específica para el sector agropecuario. Protege cultivos de alto valor comercial contra enfermedades fúngicas sin afectar la biodiversidad del suelo."}],"title":"Nuestra Plataforma Tecnológica","subtitle":"Cuatro pilares científicos que hacen de BNX la solución más avanzada del mercado"},"visible":true},{"id":"tech-stats","type":"stats","order":2,"content":{"stats":[{"label":"Eficacia Antimicrobiana","value":"99.99%","description":"Contra 47 cepas documentadas"},{"label":"Litros Producidos","value":"5M+","description":"Desde nuestra fundación"},{"label":"Países Activos","value":"25+","description":"Red de distribución global"},{"label":"Biodegradación","value":"72h","description":"Descomposición completa"}],"title":"Resultados que Hablan por Sí Solos","subtitle":"Diez años de investigación respaldados por datos reales"},"visible":true},{"id":"tech-bento","type":"bento","order":3,"content":{"items":[{"icon":"FlaskConical","size":"large","title":"I+D Continuo","details":["10 patentes registradas","Equipo de 25 investigadores"],"description":"Nuestro laboratorio nunca se detiene. Cada año lanzamos mejoras a la fórmula basadas en evidencia científica y retroalimentación de clientes en campo."},{"icon":"Globe","size":"normal","title":"Alcance Global","description":"Presentes en 25 países con red de distribución certificada."},{"icon":"Shield","size":"normal","title":"Certificaciones","details":["USDA Organic","EPA Registered","ISO 9001:2015"],"description":"USDA Organic, EPA registrado, ANLA Colombia, ISO 9001 y BPM vigentes."},{"icon":"Zap","size":"normal","title":"Acción Ultrarrápida","description":"Menos de 30 segundos para eliminar el 99.99% de los patógenos objetivo en superficie."},{"icon":"Leaf","size":"large","title":"Cero Impacto Ambiental","details":["Biodegradación total en 72h","Sin bioacumulación"],"description":"Primer desinfectante industrial con huella de carbono negativa, 100% biodegradable y sin acumulación en cadenas tróficas."}],"title":"¿Por Qué Elegirnos?","subtitle":"Ventajas diferenciales que nos posicionan como la tecnología número uno en el mercado"},"visible":true},{"id":"tech-quote","type":"quote","order":4,"content":{"role":"Corporación AgroAndes — Export Division","image":"https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop","quote":"Bionanoaxus no solo resolvió nuestro problema de contaminación fúngica, transformó completamente nuestra cadena de poscosecha. Las pérdidas se redujeron un 58% en el primer ciclo.","author":"Gerente de Operaciones"},"visible":true},{"id":"tech-history","type":"history","order":5,"content":{"title":"Una Década de Innovación","subtitle":"Los hitos que construyeron el futuro de la biotecnología sostenible","milestones":[{"icon":"Lightbulb","year":"2015","title":"Fundación en Medellín","description":"Nace Bionano A&T con un equipo de 5 investigadores y la misión de democratizar la biotecnología."},{"icon":"FileCheck","year":"2017","title":"Patente BNX V1.0","description":"Primera patente de la fórmula Bionanoaxus. Validación en 12 cepas patógenas con eficacia superior al 99%."},{"icon":"TrendingUp","year":"2019","title":"Primer Millón de Litros","description":"Superamos el primer millón de litros producidos. Presencia en Colombia, México, Perú y Ecuador."},{"icon":"FileCheck","year":"2021","title":"Certificación USDA & ISO","description":"Aprobación del USDA para exportación y certificación ISO 9001. Entrada al mercado europeo."},{"icon":"TrendingUp","year":"2023","title":"Expansión Global","description":"Operaciones en 25 países. Acuerdos de distribución con socios en Alemania, Japón y Brasil."},{"icon":"Lightbulb","year":"2025","title":"Era Digital BNX","description":"Lanzamiento de la plataforma B2B, V-Lab virtual y nueva línea AgroBio Premium."}],"description":"Cada año nos ha acercado más a nuestro objetivo: hacer de la biotecnología orgánica el estándar global de protección industrial."},"visible":true},{"id":"tech-faq","type":"faq","order":6,"content":{"items":[{"answer":"Las nanopartículas de plata orgánica de BNX actúan en múltiples frentes: penetran la membrana celular bacteriana, interfieren con la síntesis de ATP e inhiben la replicación del ADN. Esta acción triple impide que los microorganismos desarrollen resistencia, a diferencia de los antibióticos convencionales.","question":"¿Cuál es el mecanismo de acción de BNX contra bacterias?"},{"answer":"Sí. BNX está certificado por el USDA como producto orgánico y no requiere periodo de carencia antes de la cosecha. Sus componentes se biodegradam completamente en el suelo en menos de 72 horas, sin dejar residuos detestables por espectrometría de masas.","question":"¿Es seguro usar BNX cerca de cultivos para consumo humano?"},{"answer":"Los fungicidas químicos convencionales actúan sobre un único sitio de acción, lo que facilita el desarrollo de resistencia. BNX actúa simultáneamente sobre múltiples blancos moleculares, es biodegradable, no genera bioacumulación y no afecta organismos benéficos como polinizadores o microfauna del suelo.","question":"¿Qué diferencia a BNX de los fungicidas convencionales?"},{"answer":"Absolutamente. BNX es miscible en agua en cualquier proporción y no forma precipitados ni obstruye emisores de riego. Se recomienda aplicar entre 2 y 5 mL por litro según la concentración de patógenos objetivo identificados en el análisis de suelo.","question":"¿Se puede aplicar BNX en sistemas de riego por goteo?"},{"answer":"Los estudios de toxicidad oral realizados demuestran que BNX es prácticamente no tóxico en las concentraciones de uso (LD50 > 5000 mg/kg en modelos murinos). No obstante, no está formulado para consumo directo. En caso de ingestión, se recomienda beber agua abundante y contactar al médico.","question":"¿Qué pasa si se consume accidentalmente?"},{"answer":"En condiciones normales de uso industrial, R-Tech mantiene actividad antimicrobiana activa por un período de 6 a 12 meses, dependiendo de la frecuencia de limpieza, temperatura ambiente y exposición a luz UV directa. Se recomienda reaplicación anual en entornos de alta rotación.","question":"¿Cuánto tiempo dura la protección de R-Tech en superficies?"}],"title":"Preguntas Técnicas Frecuentes","subtitle":"Respuestas a las dudas más comunes sobre nuestra tecnología"},"visible":true},{"id":"tech-team","type":"team","order":7,"content":{"title":"El Equipo Científico","members":[{"name":"Dra. Sofía Ramírez","role":"Directora Científica","image":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"},{"name":"Dr. Manuel Herrera","role":"Jefe de Nanotecnología","image":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"},{"name":"Ing. Lucía Vargas","role":"Investigadora Senior BNX","image":"https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop","linkedin":"https://linkedin.com"}],"subtitle":"Investigadores y doctores especializados que dan vida a cada innovación de Bionano A&T."},"visible":true},{"id":"tech-process","type":"timeline","order":8,"content":{"title":"¿Cómo Funciona BNX?","subtitle":"Del laboratorio a su industria en cuatro pasos precisos","milestones":[{"desc":"Producimos nanopartículas de plata orgánica entre 1 y 20 nm, controlando forma y carga superficial para máxima eficacia.","step":"01","time":"dasd","phase":"dsa","title":"Síntesis Nanomolecular"},{"desc":"Combinamos las nanopartículas con extractos vegetales activos (cúrcuma, neem, aloe) que potencian la acción antimicrobiana.","step":"02","title":"Activación Botánica"},{"desc":"Cada lote pasa pruebas de CMI y citotoxicidad antes de aprobarse para producción masiva.","step":"03","title":"Validación de Laboratorio"},{"desc":"El producto llega listo para usar via nebulización, aspersión o inmersión, adaptado a cada industria.","step":"04","title":"Aplicación Industrial"}],"description":"sdfgfdgsfdg"},"visible":true}],
    "en": [
  {
    "id": "tech-hero",
    "type": "hero",
    "order": 0,
    "content": {
      "seo": {
        "metaTitle": "BNX Technology | Bionano A&T",
        "metaKeywords": "V-Lab, R-Tech, nanotechnology, antimicrobial, fungicide, BNX",
        "metaDescription": "Discover the science behind Bionanoaxus: organic nanoparticles, V-Lab and R-Tech for next-generation antimicrobial protection."
      },
      "title": "Bionano A&T Technology",
      "ctaLink": "/store",
      "ctaText": "View Our Products",
      "subtitle": "Where molecular science becomes real solutions. We develop bionanotechnology that transforms how the world protects its crops, food and industries.",
      "backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1775966716178_ajfz0mem9.webp?v=1775966719587",
      "secondaryCtaLink": "6c2b8381-ad2e-43bb-a2c3-cce614eac317",
      "secondaryCtaText": "Contact Team",
      "secondaryCtaActionType": "popup"
    },
    "visible": true
  },
  {
    "id": "tech-features",
    "type": "features",
    "order": 1,
    "content": {
      "items": [
        {
          "icon": "Microscope",
          "title": "V-Lab: Virtual Laboratory",
          "details": [
            "High-precision 3D molecular simulation",
            "Efficacy prediction per pathogen strain",
            "Concentration optimization without physical trials",
            "Integration with global microbiological databases",
            "Reproducible and auditable results"
          ],
          "description": "Real-time molecular modeling platform that simulates nanoparticle behavior before synthesis. We reduce development cycles from months to days."
        },
        {
          "icon": "Atom",
          "title": "R-Tech: Smart Nanocoatings",
          "details": [
            "Adhesion certified on metals, plastics and textiles",
            "Controlled release of active agent on contact",
            "Resistance to humidity, UV and extreme temperature",
            "Homogeneous coverage on complex surfaces",
            "Compatible with industrial nebulization systems"
          ],
          "description": "Proprietary long-duration surface coating system with organic silver nanoparticles. A single treatment protects up to 12 months."
        },
        {
          "icon": "Shield",
          "title": "BNX: Flagship Formula",
          "details": [
            "99.99% efficacy against 47 documented strains",
            "Action time: less than 30 seconds on surfaces",
            "Complete biodegradation in less than 72 hours",
            "No toxic residues in soil or water",
            "USDA, EPA and ANLA Colombia certified"
          ],
          "description": "Broad-spectrum liquid formulation that eliminates bacteria, viruses, fungi and spores on contact, without generating microbial resistance."
        },
        {
          "icon": "Leaf",
          "title": "AgroBio: Agricultural Protection",
          "details": [
            "Compatible with certified organic agriculture",
            "No waiting period before harvest",
            "60% reduction in post-harvest fungal losses",
            "Application by drip, foliar or nebulization",
            "Tested on: banana, avocado, cocoa, tomato, strawberry"
          ],
          "description": "Specific line for the agricultural sector. Protects high-value commercial crops against fungal diseases without affecting soil biodiversity."
        }
      ],
      "title": "Our Technology Platform",
      "subtitle": "Four scientific pillars that make BNX the most advanced solution in the market"
    },
    "visible": true
  },
  {
    "id": "tech-stats",
    "type": "stats",
    "order": 2,
    "content": {
      "stats": [
        {
          "label": "Antimicrobial Efficacy",
          "value": "99.99%",
          "description": "Against 47 documented strains"
        },
        {
          "label": "Liters Produced",
          "value": "5M+",
          "description": "Since our founding"
        },
        {
          "label": "Active Countries",
          "value": "25+",
          "description": "Global distribution network"
        },
        {
          "label": "Biodegradation",
          "value": "72h",
          "description": "Complete decomposition"
        }
      ],
      "title": "Results That Speak for Themselves",
      "subtitle": "Ten years of research backed by real data"
    },
    "visible": true
  },
  {
    "id": "tech-bento",
    "type": "bento",
    "order": 3,
    "content": {
      "items": [
        {
          "icon": "FlaskConical",
          "size": "large",
          "title": "Continuous R&D",
          "details": [
            "10 registered patents",
            "Team of 25 researchers"
          ],
          "description": "Our laboratory never stops. Every year we release formula improvements based on scientific evidence and field customer feedback."
        },
        {
          "icon": "Globe",
          "size": "normal",
          "title": "Global Reach",
          "description": "Present in 25 countries with certified distribution network."
        },
        {
          "icon": "Shield",
          "size": "normal",
          "title": "Certifications",
          "details": [
            "USDA Organic",
            "EPA Registered",
            "ISO 9001:2015"
          ],
          "description": "USDA Organic, EPA registered, ISO 9001 and GMP in force."
        },
        {
          "icon": "Zap",
          "size": "normal",
          "title": "Ultra-Fast Action",
          "description": "Less than 30 seconds to eliminate 99.99% of target pathogens on surface."
        },
        {
          "icon": "Leaf",
          "size": "large",
          "title": "Zero Environmental Impact",
          "details": [
            "Full biodegradation in 72h",
            "No bioaccumulation"
          ],
          "description": "First industrial disinfectant with a negative carbon footprint, 100% biodegradable."
        }
      ],
      "title": "Why Choose Us?",
      "subtitle": "Differential advantages that position us as the number one technology in the market"
    },
    "visible": true
  },
  {
    "id": "tech-quote",
    "type": "quote",
    "order": 4,
    "content": {
      "role": "AgroAndes Corporation — Export Division",
      "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop",
      "quote": "Bionanoaxus did not just solve our fungal contamination problem, it completely transformed our post-harvest chain. Losses were reduced by 58% in the first cycle.",
      "author": "Operations Manager"
    },
    "visible": true
  },
  {
    "id": "tech-history",
    "type": "history",
    "order": 5,
    "content": {
      "title": "A Decade of Innovation",
      "subtitle": "The milestones that built the future of sustainable biotechnology",
      "milestones": [
        {
          "icon": "Lightbulb",
          "year": "2015",
          "title": "Founded in Medellín",
          "description": "Bionano A&T is born with a team of 5 researchers."
        },
        {
          "icon": "FileCheck",
          "year": "2017",
          "title": "BNX V1.0 Patent",
          "description": "First Bionanoaxus formula patent. Validated on 12 pathogenic strains."
        },
        {
          "icon": "TrendingUp",
          "year": "2019",
          "title": "First Million Liters",
          "description": "We surpassed one million liters produced. Presence in 4 countries."
        },
        {
          "icon": "FileCheck",
          "year": "2021",
          "title": "USDA & ISO Certification",
          "description": "USDA approval for export and ISO 9001 certification."
        },
        {
          "icon": "TrendingUp",
          "year": "2023",
          "title": "Global Expansion",
          "description": "Operations in 25 countries with partners in Germany, Japan and Brazil."
        },
        {
          "icon": "Lightbulb",
          "year": "2025",
          "title": "Digital BNX Era",
          "description": "B2B platform launch, virtual V-Lab and new AgroBio Premium line."
        }
      ],
      "description": "Each year has brought us closer to our goal: making organic biotechnology the global standard for industrial protection."
    },
    "visible": true
  },
  {
    "id": "tech-faq",
    "type": "faq",
    "order": 6,
    "content": {
      "items": [
        {
          "answer": "BNX organic silver nanoparticles act on multiple fronts: they penetrate the bacterial cell membrane, interfere with ATP synthesis, and inhibit DNA replication. This triple action prevents microorganisms from developing resistance.",
          "question": "What is the mechanism of action of BNX against bacteria?"
        },
        {
          "answer": "Yes. BNX is USDA certified as an organic product and requires no waiting period before harvest. Its components completely biodegrade in soil in less than 72 hours.",
          "question": "Is it safe to use BNX near food crops?"
        },
        {
          "answer": "Conventional chemical fungicides act on a single site, facilitating resistance development. BNX acts simultaneously on multiple molecular targets, is biodegradable, and does not affect beneficial organisms like pollinators.",
          "question": "What differentiates BNX from conventional fungicides?"
        },
        {
          "answer": "Absolutely. BNX is miscible in water in any proportion and does not form precipitates or clog irrigation emitters. Apply 2-5 mL per liter depending on pathogen concentration.",
          "question": "Can BNX be applied in drip irrigation systems?"
        },
        {
          "answer": "Under normal industrial use conditions, R-Tech maintains active antimicrobial activity for 6 to 12 months, depending on cleaning frequency and UV exposure. Annual reapplication is recommended in high-rotation environments.",
          "question": "How long does R-Tech protection last on surfaces?"
        }
      ],
      "title": "Frequently Asked Technical Questions",
      "subtitle": "Answers to the most common questions about our technology"
    },
    "visible": true
  },
  {
    "id": "tech-team",
    "type": "team",
    "order": 7,
    "content": {
      "title": "The Scientific Team",
      "members": [
        {
          "name": "Dr. Sofía Ramírez",
          "role": "Chief Science Officer",
          "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        },
        {
          "name": "Dr. Manuel Herrera",
          "role": "Head of Nanotechnology",
          "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        },
        {
          "name": "Eng. Lucía Vargas",
          "role": "Senior BNX Researcher",
          "image": "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&fit=crop",
          "linkedin": "https://linkedin.com"
        }
      ],
      "subtitle": "Researchers and specialized scientists who bring every Bionano A&T innovation to life."
    },
    "visible": true
  },
  {
    "id": "tech-process",
    "type": "timeline",
    "order": 8,
    "content": {
      "title": "How Does BNX Work?",
      "subtitle": "From laboratory to your industry in four precise steps",
      "milestones": [
        {
          "desc": "We produce organic silver nanoparticles between 1 and 20 nm, controlling shape and surface charge for maximum efficacy.",
          "step": "01",
          "title": "Nanomolecular Synthesis"
        },
        {
          "desc": "We combine nanoparticles with active plant extracts (turmeric, neem, aloe) that synergistically enhance antimicrobial action.",
          "step": "02",
          "title": "Botanical Activation"
        },
        {
          "desc": "Each batch undergoes MIC tests and cytotoxicity studies before being approved for mass production.",
          "step": "03",
          "title": "Laboratory Validation"
        },
        {
          "desc": "The product arrives ready to use via nebulization, spraying or immersion, adapted to each industry.",
          "step": "04",
          "title": "Industrial Application"
        }
      ]
    },
    "visible": true
  }
]
  },
  "page-processes": {
     "es": [{"id":"proc-hero","type":"hero","order":0,"content":{"seo":{"metaTitle":"Procesos Industriales BNX | Bionano A&T","metaKeywords":"proceso industrial, BNX, desinfección industrial, protección antimicrobiana, bionanotecnología","metaDescription":"Descubre el proceso de implementación de Bionanoaxus BNX para proteger su industria: diagnóstico, diseño, aplicación y seguimiento certificado."},"badge":"Procesos Industriales","title":"Protección Total para su Industria","ctaLink":"#process-steps","ctaText":"Ver Nuestro Proceso","subtitle":"De la amenaza microbiana a la tranquilidad operativa en 4 etapas. Nuestro proceso certificado ha protegido más de 500 instalaciones industriales en 25 países.","backgroundImage":"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&fit=crop","secondaryCtaLink":"/#contact","secondaryCtaText":"Agendar Diagnóstico"},"visible":true},{"id":"proc-problems","type":"problems","order":1,"content":{"badge":"El Problema Real","items":[{"icon":"TrendingUp","stat":"40%","title":"Pérdidas en Cadena de Valor","statLabel":"pérdidas medias por contaminación","description":"La contaminación fúngica y bacteriana destruye entre el 15 y el 40% de la producción agrícola e industrial antes de llegar al mercado."},{"icon":"AlertTriangle","stat":"$2.8M","title":"Recalls y Sanciones Regulatorias","statLabel":"costo promedio de un recall","description":"Un brote de contaminación puede significar el retiro de toda una línea de producción y multas millonarias de organismos sanitarios."},{"icon":"Factory","stat":"73%","title":"Resistencia a Productos Convencionales","statLabel":"de cepas resistentes a desinfectantes","description":"Las bacterias y hongos desarrollan resistencia a los desinfectantes químicos en 3-6 meses de uso continuo, volviendo ineficaz la protección."},{"icon":"Microscope","stat":"68%","title":"Contaminación Cruzada Invisible","statLabel":"de brotes en superficies visualmente limpias","description":"El 68% de los brotes de contaminación ocurren en superficies aparentemente limpias que albergan biopelículas microbianas no visibles."},{"icon":"Globe","stat":"1 de 3","title":"Barreras a la Exportación","statLabel":"exportadores rechazados por estándares micro","description":"Compradores internacionales exigen certificaciones microbiológicas que muchas plantas no pueden garantizar con productos convencionales."},{"icon":"FileCheck","stat":"180+","title":"Cumplimiento Normativo Creciente","statLabel":"nuevas normas sanitarias en 2024","description":"Las regulaciones sanitarias internacionales son cada vez más estrictas. Quedarse atrás tiene consecuencias legales y comerciales devastadoras."}],"title":"¿Qué Está Costando la Contaminación a su Empresa?","subtitle":"La contaminación microbiana no detectada destruye silenciosamente la rentabilidad de miles de empresas cada año"},"visible":true},{"id":"proc-steps","type":"features","order":2,"content":{"badge":"Metodología Certificada","items":[{"icon":"Microscope","title":"Diagnóstico de Riesgo Microbiológico","result":"Informe de Riesgo Certificado","details":["Muestreo ambiental con hisopados en 50+ puntos","Análisis microbiológico en laboratorio acreditado","Identificación de cepas por espectrometría MALDI-TOF","Evaluación de biopelículas en superficies","Reporte con mapa de riesgo codificado por colores","Recomendaciones preventivas inmediatas"],"duration":"1 a 3 días hábiles","description":"Realizamos un levantamiento exhaustivo de su instalación mediante análisis de superficies, muestreo de aire y mapeo de puntos críticos de control. Identificamos exactamente qué patógenos están presentes y dónde se encuentran."},{"icon":"FlaskConical","title":"Diseño de Protocolo Personalizado","result":"Protocolo Certificado por Ingeniero","details":["Selección de la fórmula BNX adecuada al patógeno","Cálculo de concentración óptima por superficie","Diseño de cronograma de aplicación","Definición de EPP y medidas de seguridad","Plan de contingencia ante rebrotes","Documentación compatible con BPM / HACCP / ISO"],"duration":"2 a 5 días hábiles","description":"Con base en los resultados del diagnóstico, nuestro equipo científico formula un protocolo de tratamiento a la medida de su industria, producto y carga microbiana específica. No existe un tratamiento único para todos."},{"icon":"Factory","title":"Implementación Controlada","result":"Certificado de Aplicación con Sello BNX","details":["Nebulización en frío de ultra bajo volumen (ULV)","Cobertura de superficies difíciles y espacios aéreos","Control de dosificación con sensores digitales","Registro fotográfico y digital de cada zona","Aplicación en horarios de no producción","Sin necesidad de evacuar permanentemente"],"duration":"1 día a 2 semanas según instalación","description":"Nuestro equipo técnico certificado aplica el protocolo diseñado utilizando equipos de nebulización de última generación. Cada aplicación es documentada y registrada en tiempo real para trazabilidad completa."},{"icon":"TrendingUp","title":"Monitoreo y Seguimiento Continuo","result":"Protección Continua Garantizada","details":["Muestreos de verificación post-tratamiento","Dashboard digital con indicadores en tiempo real","Alertas automáticas ante anomalías microbiológicas","Ajuste del protocolo basado en nuevos datos","Informes de cumplimiento para auditorías","Soporte técnico prioritario 24/7"],"duration":"Programa mensual / trimestral","description":"La implementación no termina con la aplicación. Nuestro programa de seguimiento garantiza que la protección se mantenga en el tiempo mediante monitoreos periódicos y ajustes del protocolo según los resultados."}],"title":"Nuestro Proceso de 4 Etapas","subtitle":"Una metodología probada que garantiza resultados medibles desde la primera semana de implementación"},"visible":true},{"id":"proc-sectors","type":"sectors","order":3,"content":{"items":[{"icon":"Apple","title":"Agroindustria","description":"Protección de cultivos, postcosecha y procesado de alimentos frescos"},{"icon":"Warehouse","title":"Almacenamiento","description":"Silos, bodegas y cámaras de frío libres de patógenos fúngicos"},{"icon":"Factory","title":"Manufactura","description":"Líneas de producción que cumplen los estándares BPM y HACCP"},{"icon":"Fish","title":"Acuicultura","description":"Cultivos de camarón, tilapia y salmón con mínima mortalidad microbiana"},{"icon":"HeartPulse","title":"Salud & Hospitalario","description":"Ambientes clínicos libres de patógenos resistentes (MRSA, VRE)"},{"icon":"Sprout","title":"Agricultura Orgánica","description":"Protección certificada para exportación orgánica sin residuos"},{"icon":"Building2","title":"Hoteles & Turismo","description":"Ambientes seguros con protección invisible y continua"},{"icon":"Shirt","title":"Textil & Confección","description":"Telas antimicrobianas y protección de área de producción"}],"title":"Industrias que Protegemos","subtitle":"Nuestra metodología se adapta a los requisitos específicos de cada sector. Hemos trabajado con los estándares más exigentes del mundo."},"visible":true},{"id":"proc-timeline","type":"timeline","order":4,"content":{"title":"Cronograma de Implementación","subtitle":"De la primera llamada a la protección total: así fluye nuestro proceso","milestones":[{"desc":"Visita técnica y muestreo exhaustivo de su instalación","time":"Diagnóstico","phase":"Semana 1"},{"desc":"Protocolo personalizado listo y validado por ingeniería","time":"Diseño","phase":"Semana 2"},{"desc":"Implementación certificada con equipos ULV de última generación","time":"Aplicación","phase":"Semana 3"},{"desc":"Muestreo post-tratamiento y reporte de resultados","time":"Validación","phase":"Semana 4"},{"desc":"Monitoreo continuo y ajustes para mantener la protección","time":"Seguimiento","phase":"Mensual"}]},"visible":true},{"id":"proc-stats","type":"stats","order":5,"content":{"stats":[{"label":"Instalaciones Protegidas","value":"500+","description":"En 25 países de 4 continentes"},{"label":"Eficacia Promedio","value":"99.99%","description":"Medida en muestreos post-tratamiento"},{"label":"Reducción de Pérdidas","value":"58%","description":"Promedio en sector agroindustrial"},{"label":"Recalls por Contaminación","value":"0","description":"En clientes con programa continuo activo"}],"title":"Los Números No Mienten","subtitle":"Resultados reales medidos en las instalaciones de nuestros clientes activos"},"visible":true},{"id":"proc-certifications","type":"certifications","order":6,"content":{"items":[{"name":"USDA Organic","year":"2021","acronym":"USDA","description":"Certificación del Departamento de Agricultura de EE.UU. que avala que nuestros productos son aptos para uso en agricultura orgánica certificada para exportación."},{"name":"ISO 9001:2015","year":"2020","acronym":"ISO","description":"Certificación de Sistema de Gestión de Calidad que garantiza la consistencia y trazabilidad de cada lote producido y cada proceso de aplicación."},{"name":"EPA Registered","year":"2022","acronym":"EPA","description":"Registro ante la Agencia de Protección Ambiental de EE.UU. que confirma la seguridad ambiental del producto y su eficacia contra patógenos declarados."},{"name":"ANLA Colombia","year":"2018","acronym":"ANLA","description":"Autorización de la Autoridad Nacional de Licencias Ambientales de Colombia, certificando el bajo impacto ecológico del producto y su proceso de fabricación."},{"name":"Buenas Prácticas de Manufactura","year":"2019","acronym":"BPM","description":"Cumplimiento de las BPM exigidas por el INVIMA para la fabricación de productos de uso sanitario, asegurando calidad desde el origen."},{"name":"HACCP Compatible","year":"2021","acronym":"HACCP","description":"Nuestros procesos y productos son compatibles con los sistemas de Análisis de Peligros y Puntos Críticos de Control en la industria alimentaria."}],"title":"Respaldo Normativo Internacional","subtitle":"Nuestros procesos están certificados bajo los estándares más rigurosos del mundo, garantizando que su empresa cumpla con cualquier auditoría"},"visible":true},{"id":"proc-quote","type":"quote","order":7,"content":{"role":"Gerente de Producción — Finca El Progreso, Colombia","image":"https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop","quote":"Antes de BNX, perdíamos entre el 20 y 25% de nuestra producción de aguacate Hass por antracnosis en postcosecha. Después de implementar el protocolo, las pérdidas cayeron al 3%. El retorno de inversión fue evidente desde el segundo mes.","author":"Carlos Martínez"},"visible":true},{"id":"proc-faq","type":"faq","order":8,"content":{"items":[{"answer":"No necesariamente. En la mayoría de los casos, la aplicación se realiza en horarios de baja actividad (turnos nocturnos, fines de semana o pausas programadas). El tiempo de ventilación post-aplicación es entre 20 y 40 minutos dependiendo del tipo de espacio. Diseñamos el cronograma para minimizar el impacto en su operación.","question":"¿Necesito detener mi producción para implementar BNX?"},{"answer":"Los resultados microbiológicos se evidencian desde la primera aplicación. En los muestreos de verificación realizados entre 48 y 72 horas post-aplicación, la reducción de carga microbiana es del 99%+ en superficies tratadas. Los impactos en indicadores operativos (menores pérdidas, mayor vida útil del producto) se observan típicamente en el primer ciclo de producción completo.","question":"¿Cuánto tiempo pasa antes de ver resultados?"},{"answer":"BNX está específicamente diseñado para facilitar las auditorías, no complicarlas. Toda nuestra documentación (certificados de análisis, fichas técnicas, registros de aplicación, muestreos) está preparada en el formato que exigen INVIMA, FDA, BRC, SQF y otros organismos certificadores. Hemos acompañado a más de 80 empresas durante auditorías exitosas.","question":"¿Qué pasa si tenemos una auditoría sanitaria durante el proceso?"},{"answer":"El costo depende del tamaño de la instalación, la carga microbiana y el tipo de protocolo requerido. Trabajamos con modelos de pago flexible: aplicación única, programa mensual o contrato anual. En promedio, el costo del programa BNX representa solo el 3-8% de las pérdidas medias que evita. Solicite una cotización sin costo.","question":"¿Cuál es el costo aproximado de implementación?"},{"answer":"BNX es compatible con la mayoría de protocolos de limpieza estándar. Sin embargo, para maximizar su eficacia, recomendamos aplicarlo después de los procesos de limpieza y desinfección convencionales, no como sustituto de estos en la primera fase. Nuestro equipo evaluará su protocolo actual y le indicará la secuencia óptima.","question":"¿BNX es compatible con mis productos de limpieza actuales?"},{"answer":"Sí, todos nuestros planes incluyen soporte técnico. En el plan Continuo, disponemos de un ingeniero asignado a su cuenta, con acceso a dashboard en tiempo real, alertas automáticas por anomalías y retención de respuesta ante emergencias en menos de 4 horas durante días hábiles.","question":"¿Ofrecen soporte técnico continuo después de la implementación?"}],"title":"Preguntas Sobre el Proceso","ctaLink":"/#contact","ctaText":"¿Tiene más preguntas? Contáctenos","subtitle":"Todo lo que necesita saber antes de dar el primer paso"},"visible":true},{"id":"proc-cta","type":"cta","order":9,"content":{"icon":"Shield","emoji":"🛡️","title":"¿Listo para Proteger su Operación?","ctaLink":"/#contact","ctaText":"Solicitar Diagnóstico Gratuito","subtitle":"Solicite un diagnóstico gratuito. Nuestro equipo realizará un análisis preliminar de su instalación sin costo ni compromiso y le entregará un informe con los riesgos identificados.","secondaryCtaLink":"/store","secondaryCtaText":"Ver Nuestros Productos"},"visible":true}],
     "en": [{"id":"proc-hero","type":"hero","order":0,"content":{"seo":{"metaTitle":"Industrial Processes BNX | Bionano A&T","metaKeywords":"industrial process, BNX, industrial disinfection, antimicrobial protection, bionanotechnology","metaDescription":"Discover the implementation process of Bionanoaxus BNX to protect your industry: diagnosis, design, application and certified follow-up."},"badge":"Industrial Processes","title":"Total Protection for Your Industry","ctaLink":"#process-steps","ctaText":"See Our Process","subtitle":"From microbial threat to operational peace of mind in 4 stages. Our certified process has protected more than 500 industrial facilities in 25 countries.","backgroundImage":"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&fit=crop","secondaryCtaLink":"/#contact","secondaryCtaText":"Schedule a Diagnosis"},"visible":true},{"id":"proc-problems","type":"problems","order":1,"content":{"badge":"The Real Problem","items":[{"icon":"TrendingUp","stat":"40%","title":"Value Chain Losses","statLabel":"average losses from contamination","description":"Fungal and bacterial contamination destroys between 15 and 40% of agricultural and industrial production before reaching the market."},{"icon":"AlertTriangle","stat":"$2.8M","title":"Regulatory Recalls","statLabel":"average cost of a recall","description":"A contamination outbreak can mean the withdrawal of an entire production line and million-dollar fines from health regulators."},{"icon":"Factory","stat":"73%","title":"Resistance to Conventional Products","statLabel":"strains resistant to disinfectants","description":"Bacteria and fungi develop resistance to chemical disinfectants within 3-6 months of continuous use."},{"icon":"Microscope","stat":"68%","title":"Invisible Cross-Contamination","statLabel":"outbreaks on visually clean surfaces","description":"68% of contamination outbreaks occur on visually clean surfaces that harbor invisible microbial biofilms."},{"icon":"Globe","stat":"1 in 3","title":"Export Barriers","statLabel":"exporters rejected by micro standards","description":"International buyers require microbiological certifications that many plants cannot guarantee with conventional products."},{"icon":"FileCheck","stat":"180+","title":"Rising Regulatory Compliance","statLabel":"new sanitary regulations in 2024","description":"International sanitary regulations are increasingly strict. Falling behind has devastating legal and commercial consequences."}],"title":"What Is Contamination Costing Your Company?","subtitle":"Undetected microbial contamination silently destroys the profitability of thousands of companies every year"},"visible":true},{"id":"proc-steps","type":"features","order":2,"content":{"badge":"Certified Methodology","items":[{"icon":"Microscope","title":"Microbiological Risk Assessment","result":"Certified Risk Report","details":["Environmental swab sampling at 50+ points","Microbiological analysis at accredited laboratory","Strain identification by MALDI-TOF spectrometry","Biofilm evaluation on surfaces","Color-coded risk map report","Immediate preventive recommendations"],"duration":"1 to 3 business days","description":"We conduct a comprehensive survey of your facility through surface analysis, air sampling, and critical control point mapping. We identify exactly which pathogens are present and where they are located."},{"icon":"FlaskConical","title":"Custom Protocol Design","result":"Engineer-Certified Protocol","details":["BNX formula selection suited to pathogen","Optimal concentration calculation per surface","Application schedule design","PPE and safety measures definition","Contingency plan for re-outbreaks","Documentation compatible with GMP / HACCP / ISO"],"duration":"2 to 5 business days","description":"Based on diagnostic results, our scientific team formulates a treatment protocol tailored to your specific industry, product, and microbial load. There is no one-size-fits-all treatment."},{"icon":"Factory","title":"Controlled Implementation","result":"Application Certificate with BNX Seal","details":["Ultra low volume (ULV) cold nebulization","Coverage of hard-to-reach surfaces and air spaces","Dosage control with digital sensors","Photographic and digital record of each zone","Application during non-production hours","No permanent evacuation required"],"duration":"1 day to 2 weeks depending on facility","description":"Our certified technical team applies the designed protocol using state-of-the-art nebulization equipment. Each application is documented and recorded in real time for complete traceability."},{"icon":"TrendingUp","title":"Monitoring and Continuous Follow-up","result":"Guaranteed Continuous Protection","details":["Post-treatment verification sampling","Digital dashboard with real-time indicators","Automatic alerts for microbiological anomalies","Protocol adjustment based on new data","Compliance reports for audits","Priority 24/7 technical support"],"duration":"Monthly / quarterly program","description":"Implementation does not end with the application. Our follow-up program ensures protection is maintained over time through periodic monitoring and protocol adjustments based on results."}],"title":"Our 4-Stage Process","subtitle":"A proven methodology that guarantees measurable results from the first week of implementation"},"visible":true},{"id":"proc-sectors","type":"sectors","order":3,"content":{"items":[{"icon":"Apple","title":"Agroindustry","description":"Crop protection, post-harvest and fresh food processing"},{"icon":"Warehouse","title":"Storage","description":"Silos, warehouses and cold rooms free of fungal pathogens"},{"icon":"Factory","title":"Manufacturing","description":"Production lines meeting GMP and HACCP standards"},{"icon":"Fish","title":"Aquaculture","description":"Shrimp, tilapia and salmon farming with minimal microbial mortality"},{"icon":"HeartPulse","title":"Healthcare","description":"Clinical environments free of resistant pathogens (MRSA, VRE)"},{"icon":"Sprout","title":"Organic Agriculture","description":"Certified protection for organic export without residues"},{"icon":"Building2","title":"Hotels & Tourism","description":"Safe environments with invisible and continuous protection"},{"icon":"Shirt","title":"Textile & Apparel","description":"Antimicrobial fabrics and production area protection"}],"title":"Industries We Protect","subtitle":"Our methodology adapts to the specific requirements of each sector. We have worked with the most demanding standards in the world."},"visible":true},{"id":"proc-timeline","type":"timeline","order":4,"content":{"title":"Implementation Timeline","subtitle":"From the first call to total protection: this is how our process flows","milestones":[{"desc":"Technical visit and comprehensive sampling of your facility","time":"Diagnosis","phase":"Week 1"},{"desc":"Customized protocol ready and validated by engineering","time":"Design","phase":"Week 2"},{"desc":"Certified implementation with latest-gen ULV equipment","time":"Application","phase":"Week 3"},{"desc":"Post-treatment sampling and results report","time":"Validation","phase":"Week 4"},{"desc":"Continuous monitoring and adjustments to maintain protection","time":"Follow-up","phase":"Monthly"}]},"visible":true},{"id":"proc-stats","type":"stats","order":5,"content":{"stats":[{"label":"Protected Facilities","value":"500+","description":"In 25 countries across 4 continents"},{"label":"Average Efficacy","value":"99.99%","description":"Measured in post-treatment sampling"},{"label":"Loss Reduction","value":"58%","description":"Average in agroindustrial sector"},{"label":"Recalls from Contamination","value":"0","description":"In clients with active continuous program"}],"title":"The Numbers Do Not Lie","subtitle":"Real results measured at the facilities of our active clients"},"visible":true},{"id":"proc-certifications","type":"certifications","order":6,"content":{"items":[{"name":"USDA Organic","year":"2021","acronym":"USDA","description":"Certification from the U.S. Department of Agriculture validating that our products are suitable for use in certified organic agriculture for export."},{"name":"ISO 9001:2015","year":"2020","acronym":"ISO","description":"Quality Management System certification guaranteeing the consistency and traceability of each batch produced and each application process."},{"name":"EPA Registered","year":"2022","acronym":"EPA","description":"Registration with the U.S. Environmental Protection Agency confirming the environmental safety of the product and its efficacy against declared pathogens."},{"name":"ANLA Colombia","year":"2018","acronym":"ANLA","description":"Authorization from the National Environmental Licensing Authority of Colombia, certifying the low ecological impact of the product."},{"name":"Good Manufacturing Practices","year":"2019","acronym":"GMP","description":"GMP compliance required by INVIMA for the manufacture of sanitary use products, ensuring quality from the source."},{"name":"HACCP Compatible","year":"2021","acronym":"HACCP","description":"Our processes and products are compatible with Hazard Analysis and Critical Control Point systems in the food industry."}],"title":"International Regulatory Backing","subtitle":"Our processes are certified under the most rigorous standards in the world, ensuring your company can pass any audit"},"visible":true},{"id":"proc-quote","type":"quote","order":7,"content":{"role":"Production Manager — Finca El Progreso, Colombia","image":"https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=400&fit=crop","quote":"Before BNX, we were losing between 20 and 25% of our Hass avocado production to post-harvest anthracnose. After implementing the protocol, losses dropped to 3%. The return on investment was evident from the second month.","author":"Carlos Martínez"},"visible":true},{"id":"proc-faq","type":"faq","order":8,"content":{"items":[{"answer":"Not necessarily. In most cases, application is done during low-activity hours (night shifts, weekends, or scheduled pauses). Post-application ventilation time is between 20 and 40 minutes depending on the space type. We design the schedule to minimize impact on your operation.","question":"Do I need to stop production to implement BNX?"},{"answer":"Microbiological results are evident from the first application. In verification samples taken 48-72 hours post-application, the reduction in microbial load is 99%+ on treated surfaces. Impacts on operational indicators are typically observed in the first complete production cycle.","question":"How long before I see results?"},{"answer":"BNX is specifically designed to facilitate audits, not complicate them. All our documentation is ready in the format required by FDA, BRC, SQF and other certification bodies. We have accompanied over 80 companies through successful audits.","question":"What if we have a health audit during the process?"},{"answer":"Cost depends on facility size, microbial load and required protocol type. We work with flexible payment models: single application, monthly program or annual contract. On average, the BNX program cost represents only 3-8% of the average losses it prevents.","question":"What is the approximate cost of implementation?"},{"answer":"BNX is compatible with most standard cleaning protocols. However, to maximize efficacy, we recommend applying it after conventional cleaning and disinfection processes. Our team will evaluate your current protocol and indicate the optimal sequence.","question":"Is BNX compatible with my current cleaning products?"},{"answer":"Yes, all our plans include technical support. In the Continuous plan, we have an engineer assigned to your account, with access to a real-time dashboard, automatic anomaly alerts, and emergency response in less than 4 hours on business days.","question":"Do you offer continuous technical support after implementation?"}],"title":"Questions About the Process","ctaLink":"/#contact","ctaText":"Have more questions? Contact us","subtitle":"Everything you need to know before taking the first step"},"visible":true},{"id":"proc-cta","type":"cta","order":9,"content":{"icon":"Shield","emoji":"🛡️","title":"Ready to Protect Your Operation?","ctaLink":"/#contact","ctaText":"Request Free Diagnosis","subtitle":"Request a free diagnosis. Our team will conduct a preliminary analysis of your facility at no cost or commitment and deliver a report with identified risks.","secondaryCtaLink":"/store","secondaryCtaText":"View Our Products"},"visible":true}]
  },
  "page-store": {
     "es": [
  {
    "id": "store-hero",
    "type": "hero",
    "order": 0,
    "content": {
      "seo": {
        "metaTitle": "Tienda Bionano AYT - Compra Productos Biotecnológicos",
        "metaKeywords": "comprar agricultura, productos biotecnológicos, fertilizantes orgánicos, tienda online, bionano ayt",
        "metaDescription": "Compra ahora productos biotecnológicos para agricultura. Fertilizantes orgánicos, soluciones especializadas y equipos agrícolas. Envío rápido y garantizado."
      },
      "badge": "Tienda Bionano AYT",
      "title": "¡Compra Ahora!",
      "ctaText": "Ver Productos",
      "subtitle": "Soluciones biotecnológicas de alta calidad para tus cultivos. Productos certificados y envío garantizado.",
      "backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1776031695614_qavrsa8l6.webp?v=1776031698130",
      "secondaryCtaLink": "0d1a8625-06ee-4da1-8f24-fad8d5ac5a01",
      "secondaryCtaText": "Cotizar personalizado",
      "secondaryCtaActionType": "popup"
    },
    "visible": true
  },
  {
    "id": "store-flipcards",
    "type": "flipcards",
    "order": 10,
    "content": {
      "items": [
        {
          "icon": "Shield",
          "title": "Certificado",
          "description": "Todos los productos estan certificados y aprobados por el SENASA"
        },
        {
          "icon": "Truck",
          "title": "Envio Rapido",
          "description": "Envios nacionales en menos de 48 horas a todo el país"
        },
        {
          "icon": "CheckCircle",
          "title": "Garantia",
          "description": "Garantia total de 30 dias en todos nuestros productos"
        },
        {
          "icon": "Users",
          "title": "Asesoría",
          "description": "Asesoría técnica personalizada por profesionales expertos"
        },
        {
          "icon": "Package",
          "title": "Stock",
          "description": "Stock permanente disponible para entrega inmediata"
        },
        {
          "icon": "Award",
          "title": "Calidad",
          "description": "Calidad premium garantizada en cada uno de nuestros productos"
        }
      ]
    },
    "visible": true
  },
  {
    "id": "store-products",
    "type": "products",
    "order": 20,
    "content": {
      "title": "Soluciones para Cada Industria",
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
    "id": "clientes-1776113880083",
    "type": "clientes",
    "order": 30,
    "content": {
      "items": [],
      "title": "Nuestros Clientes Satisfechos",
      "subtitle": "Empresas líderes de distintos sectores apuestan por nuestras soluciones biotecnológicas.",
      "selectedMemberIds": [
        "eco-004",
        "eco-003",
        "eco-001",
        "eco-002"
      ]
    },
    "visible": true
  },
  {
    "id": "store-cta",
    "type": "cta",
    "order": 40,
    "content": {
      "icon": "ShoppingCart",
      "title": "¿Necesitas Ayuda?",
      "ctaText": "Contactar Ahora",
      "subtitle": "Nuestro equipo de expertos esta listo para asesorarte y ayudarte a elegir el producto ideal para tus necesidades.",
      "secondaryCtaText": "WhatsApp"
    },
    "visible": true
  }
],
     "en": [
  {
    "id": "store-hero",
    "type": "hero",
    "order": 0,
    "content": {
      "seo": {
        "metaTitle": "Bionano AYT Store - Buy Biotechnological Products",
        "metaKeywords": "buy agriculture, biotechnological products, organic fertilizers, online store, bionano ayt",
        "metaDescription": "Shop now for biotechnological agricultural products. Organic fertilizers, specialized solutions and agricultural equipment. Fast and guaranteed shipping."
      },
      "badge": "Bionano AYT Store",
      "title": "Shop Now!",
      "ctaText": "View Products",
      "subtitle": "High-quality biotechnological solutions for your crops. Certified products and guaranteed shipping.",
      "backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1776031695614_qavrsa8l6.webp?v=1776031698130",
      "secondaryCtaLink": "0d1a8625-06ee-4da1-8f24-fad8d5ac5a01",
      "secondaryCtaText": "Contact Us",
      "secondaryCtaActionType": "popup"
    },
    "visible": true
  },
  {
    "id": "store-flipcards",
    "type": "flipcards",
    "order": 10,
    "content": {
      "items": [
        {
          "icon": "Shield",
          "title": "Certified",
          "description": "All products are certified and approved by SENASA"
        },
        {
          "icon": "Truck",
          "title": "Fast Shipping",
          "description": "National shipments in less than 48 hours throughout the country"
        },
        {
          "icon": "CheckCircle",
          "title": "Warranty",
          "description": "30-day full warranty on all our products"
        },
        {
          "icon": "Users",
          "title": "Advisory",
          "description": "Personalized technical advice by expert professionals"
        },
        {
          "icon": "Package",
          "title": "Stock",
          "description": "Permanent stock available for immediate delivery"
        },
        {
          "icon": "Award",
          "title": "Quality",
          "description": "Guaranteed premium quality in each of our products"
        }
      ]
    },
    "visible": true
  },
  {
    "id": "store-products",
    "type": "products",
    "order": 20,
    "content": {
      "selectedProductIds": [
        "prod-003",
        "prod-001",
        "prod-002"
      ]
    },
    "visible": true
  },
  {
    "id": "store-trust",
    "type": "trust",
    "order": 30,
    "content": {
      "title": "Our Customers Trust Us",
      "partners": [
        {
          "logo": "/images/partners/agroperu.png",
          "name": "Agro Peru SAC",
          "description": "Leading agricultural distribution company"
        },
        {
          "logo": "/images/partners/senasa.png",
          "name": "SENASA",
          "description": "National Agrarian Health Organization"
        },
        {
          "logo": "/images/partners/incagro.png",
          "name": "Inca Agro",
          "description": "Organic products exporter"
        },
        {
          "logo": "/images/partners/agroandina.png",
          "name": "Agro Andina",
          "description": "Andean Farmers Association"
        }
      ],
      "subtitle": "Companies and farmers from all over Peru already use our products",
      "selectedMemberIds": [
        "eco-003",
        "eco-001",
        "eco-002",
        "eco-004"
      ]
    },
    "visible": true
  },
  {
    "id": "clientes-1776113880083",
    "type": "clientes",
    "order": 40,
    "content": {
      "items": [],
      "title": "Nueva Sección",
      "subtitle": "Descripción de ejemplo para la nueva sección.",
      "selectedMemberIds": [
        "eco-004",
        "eco-003",
        "eco-001",
        "eco-002"
      ]
    },
    "visible": true
  },
  {
    "id": "store-cta",
    "type": "cta",
    "order": 50,
    "content": {
      "icon": "ShoppingCart",
      "title": "Need Help?",
      "ctaText": "Contact Now",
      "subtitle": "Our team of experts is ready to advise you and help you choose the ideal product for your needs.",
      "secondaryCtaText": "WhatsApp"
    },
    "visible": true
  }
]
  },
  "page-ecosystem": {
     "es": [
  {
    "id": "ecosystem-hero",
    "type": "hero",
    "order": 0,
    "content": {
      "title": "Nuestro Ecosistema",
      "height": "300px",
      "subtitle": "Conectamos ciencia, tecnología y negocios para un futuro sostenible.",
      "backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1776113359487_6svdef9eu.webp?v=1776113362528"
    },
    "visible": true
  },
  {
    "id": "ecosystem-stats",
    "type": "stats",
    "order": 1,
    "content": {
      "stats": [
        {
          "label": "Aliados Activos",
          "value": "50+"
        },
        {
          "label": "Países Alcanzados",
          "value": "12"
        },
        {
          "label": "Sostenibilidad",
          "value": "100%"
        },
        {
          "label": "Soporte",
          "value": "24/7"
        }
      ],
      "title": "Creciendo Juntos"
    },
    "visible": true
  },
  {
    "id": "ecosystem-catalog",
    "type": "category-filter",
    "order": 2,
    "content": {
      "title": "Directorio de Miembros",
      "subtitle": "Explora los innovadores y empresas que están transformando la industria."
    },
    "visible": true
  }
],
     "en": [
  {
    "id": "ecosystem-hero",
    "type": "hero",
    "order": 0,
    "content": {
      "title": "Our Ecosystem",
      "height": "300px",
      "subtitle": "Connecting science, technology, and business for a sustainable future.",
      "backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1776113359487_6svdef9eu.webp?v=1776113362528"
    },
    "visible": true
  },
  {
    "id": "ecosystem-stats",
    "type": "stats",
    "order": 1,
    "content": {
      "stats": [
        {
          "label": "Active Allies",
          "value": "50+"
        },
        {
          "label": "Countries Reached",
          "value": "12"
        },
        {
          "label": "Sustainability",
          "value": "100%"
        },
        {
          "label": "Support",
          "value": "24/7"
        }
      ],
      "title": "Growing Together"
    },
    "visible": true
  },
  {
    "id": "ecosystem-catalog",
    "type": "category-filter",
    "order": 2,
    "content": {
      "title": "Members Directory",
      "subtitle": "Explore the innovators and companies that are transforming the industry."
    },
    "visible": true
  }
]
  },
  "page-blog": {
     "es": [
  {
    "id": "blog-hero-section",
    "type": "hero-blog",
    "order": 100,
    "content": {
      "badge": "Blog",
      "title": "Actualidad y Ciencia",
      "subtitle": "Explora las últimas innovaciones en bioseguridad, nanotecnología y desarrollo sostenible.",
      "backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1776047672996_x214zn12o.webp?v=1776047682724"
    },
    "visible": true
  },
  {
    "id": "blog-posts-section",
    "type": "blog-posts",
    "order": 1000,
    "content": {},
    "visible": true
  }
],
     "en": [
  {
    "id": "blog-hero-section",
    "type": "hero-blog",
    "order": 100,
    "content": {
      "badge": "Blog",
      "title": "News & Science",
      "subtitle": "Explore the latest innovations in biosecurity, nanotechnology, and sustainable development.",
      "backgroundImage": "https://ik.imagekit.io/er9yvpay6/perfiles/banners/banner_user_default_1776047672996_x214zn12o.webp?v=1776047682724"
    },
    "visible": true
  },
  {
    "id": "blog-posts-section",
    "type": "blog-posts",
    "order": 1000,
    "content": {},
    "visible": true
  }
]
  }
};

const sqlPath = "d:/Softwares/BionanoAYT/bionano-api/sql/seed.sql";
let sqlContent = fs.readFileSync(sqlPath, 'utf8');

// The SQL statements have line breaks. So regex matching isn't as trivial.
// Another approach, let's just make the script write a new seed.sql completely for these pages,
// or we can just append an UPDATE or REPLACE INTO statement at the end of seed.sql.
// Since 'page_contents' probably has (page_id, language) as a primary or unique key, 
// a "REPLACE INTO page_contents (page_id, language, sections) VALUES (...)" at the end
// of the file would overwrite the previous values because the file is executed sequentially.
// Looking at the table, it uses INSERT IGNORE.

// Let's create an UPDATE statements script
let updateSql = '\n-- UPDATES GENERADOS POR SCRIPT\n';
for (const [pageId, langs] of Object.entries(pagesData)) {
  for (const [lang, sections] of Object.entries(langs)) {
    const jsonStr = JSON.stringify(sections, null, 2).replace(/'/g, "''");
    updateSql += \`UPDATE page_contents SET sections = '\${jsonStr}' WHERE page_id = '\${pageId}' AND language = '\${lang}';\n\`;
  }
}

fs.appendFileSync(sqlPath, updateSql, 'utf8');
console.log("SQL APPENDED TO SEED FILE");
