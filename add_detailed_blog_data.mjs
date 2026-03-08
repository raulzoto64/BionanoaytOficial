import { supabase, supabaseAPI } from './supabase-client.mjs';

async function addDetailedBlogData() {
  try {
    console.log('=== Adding Detailed Blog Data ===\n');

    console.log('1. Adding blog categories...');
    
    const categories = [
      {
        slug: 'tecnologia',
        order: 1,
        status: 'active',
        translations: {
          es: { 
            name: 'Tecnología', 
            description: 'Artículos sobre tecnologías de bioseguridad y nanotecnología, incluyendo innovaciones en materiales, procesos y aplicaciones.' 
          },
          en: { 
            name: 'Technology', 
            description: 'Articles about biosecurity and nanotechnology, including innovations in materials, processes and applications.' 
          }
        }
      },
      {
        slug: 'sostenibilidad',
        order: 2,
        status: 'active',
        translations: {
          es: { 
            name: 'Sostenibilidad', 
            description: 'Contenido sobre prácticas sostenibles en la industria, reducción de huella carbono y desarrollo circular.' 
          },
          en: { 
            name: 'Sustainability', 
            description: 'Content about sustainable practices in industry, carbon footprint reduction and circular development.' 
          }
        }
      },
      {
        slug: 'innovacion',
        order: 3,
        status: 'active',
        translations: {
          es: { 
            name: 'Innovación', 
            description: 'Noticias y análisis sobre innovaciones en bioseguridad, nanotecnología y procesos industriales.' 
          },
          en: { 
            name: 'Innovation', 
            description: 'News and analysis about innovations in biosecurity, nanotechnology and industrial processes.' 
          }
        }
      },
      {
        slug: 'bioseguridad',
        order: 4,
        status: 'active',
        translations: {
          es: { 
            name: 'Bioseguridad', 
            description: 'Tendencias y prácticas en bioseguridad para entornos médicos, laboratorios y la industria.' 
          },
          en: { 
            name: 'Biosecurity', 
            description: 'Trends and practices in biosecurity for medical, laboratory and industrial environments.' 
          }
        }
      },
      {
        slug: 'industria-20',
        order: 5,
        status: 'active',
        translations: {
          es: { 
            name: 'Industria 4.0', 
            description: 'Transformación digital y automatización en la industria moderna con enfoque en bioseguridad.' 
          },
          en: { 
            name: 'Industry 4.0', 
            description: 'Digital transformation and automation in modern industry with focus on biosecurity.' 
          }
        }
      }
    ];

    const categoryIds = [];
    for (const categoryData of categories) {
      const category = await supabaseAPI.createBlogCategory({
        slug: categoryData.slug,
        order: categoryData.order,
        status: categoryData.status
      });
      
      for (const lang of ['es', 'en']) {
        await supabaseAPI.updateBlogCategoryTranslation(category.id, lang, categoryData.translations[lang]);
      }
      
      categoryIds.push(category.id);
      console.log(`   ✅ Category "${categoryData.translations.es.name}" created with ID: ${category.id}`);
    }

    console.log('\n2. Adding blog posts...');
    
    const posts = [
      {
        slug: 'nanotecnologia-para-la-deteccion-de-enfermedades',
        author: 'Dr. María González',
        cover_image: 'https://images.unsplash.com/photo-1613376092414-e2e899933505?w=1200&h=600&fit=crop',
        status: 'published',
        featured: true,
        translations: {
          es: {
            title: 'Nanotecnología para la Detección Temprana de Enfermedades',
            excerpt: 'Cómo los nanosensores están revolucionando el diagnóstico médico con detección de biomarcadores a nivel celular.',
            content: `
<h2>Introducción</h2>
<p>La nanotecnología ha abierto nuevas fronteras en el campo de la salud, especialmente en la detección temprana de enfermedades. Los nanosensores de última generación permiten identificar biomarcadores a niveles moleculares, lo que hace posible diagnosticar enfermedades como el cáncer en etapas iniciales.</p>

<h2>Tecnología de Nanosensores</h2>
<p>Los sensores basados en nanoestructuras de óxidos metálicos tienen una sensibilidad excepcional para detectar partículas biomoleculares en fluidos corporales. Estos dispositivos pueden identificar incluso concentraciones extremadamente bajas de proteínas, células oácidos nucleicos.</p>

<h2>Aplicaciones en la Práctica</h2>
<p>En los hospitales, estas tecnologías ya se están usando para detectar:</p>
<ul>
  <li>Cáncer de mama en etapas precoces</li>
  <li>Enfermedades cardiovasculares</li>
  <li>Infecciones virales como el COVID-19</li>
  <li>Desórdenes neurológicos como el Alzheimer</li>
</ul>

<h2>Ventajas Clave</h2>
<p>La nanotecnología ofrece beneficios significativos:</p>
<ul>
  <li>Detección temprana con alta precisión</li>
  <li>Minimización de la invasividad de los procedimientos</li>
  <li>Reducción de costos en el diagnóstico</li>
  <li>Mejora de la tasa de supervivencia</li>
</ul>

<h2>Futuro de la Nanomedicina</h2>
<p>La investigación en curso está desarrollando sistemas de diagnóstico personalizado que combinarán nanosensores con inteligencia artificial para una detección aún más precisa y análisis predictivo de enfermedades.</p>
`,
            meta_title: 'Nanotecnología para Detección Temprana de Enfermedades',
            meta_description: 'Cómo los nanosensores revolucionan el diagnóstico médico con detección de biomarcadores a nivel celular.',
            meta_keywords: 'nanotecnologia, deteccion, enfermedades, diagnostico, nanosensores'
          },
          en: {
            title: 'Nanotechnology for Early Disease Detection',
            excerpt: 'How nanosensors are revolutionizing medical diagnostics with biomarker detection at the cellular level.',
            content: `
<h2>Introduction</h2>
<p>Nanotechnology has opened new frontiers in healthcare, especially in early disease detection. State-of-the-art nanosensors can identify biomarkers at molecular levels, enabling early detection of diseases like cancer.</p>

<h2>Nanosensor Technology</h2>
<p>Sensors based on metallic oxide nanostructures have exceptional sensitivity to detect biomolecular particles in body fluids. These devices can identify even extremely low concentrations of proteins, cells, or nucleic acids.</p>

<h2>Practical Applications</h2>
<p>In hospitals, these technologies are already being used to detect:</p>
<ul>
  <li>Early-stage breast cancer</li>
  <li>Cardiovascular diseases</li>
  <li>Viral infections like COVID-19</li>
  <li>Neurological disorders like Alzheimer's</li>
</ul>

<h2>Key Advantages</h2>
<p>Nanotechnology offers significant benefits:</p>
<ul>
  <li>Early detection with high precision</li>
  <li>Minimization of invasive procedures</li>
  <li>Reduced diagnostic costs</li>
  <li>Improved survival rates</li>
</ul>

<h2>The Future of Nanomedicine</h2>
<p>Ongoing research is developing personalized diagnostic systems that combine nanosensors with artificial intelligence for even more precise detection and predictive disease analysis.</p>
`,
            meta_title: 'Nanotechnology for Early Disease Detection',
            meta_description: 'How nanosensors revolutionize medical diagnostics with cellular-level biomarker detection.',
            meta_keywords: 'nanotechnology, detection, diseases, diagnosis, nanosensors'
          }
        },
        categories: [0, 3] // Technology and Biosecurity
      },
      {
        slug: 'sostenibilidad-en-la-industria-quimica',
        author: 'Ing. Carlos Rodríguez',
        cover_image: 'https://images.unsplash.com/photo-1553877616-108d85556133?w=1200&h=600&fit=crop',
        status: 'published',
        featured: true,
        translations: {
          es: {
            title: 'Sostenibilidad en la Industria Química: Retos y Oportunidades',
            excerpt: 'Cómo la industria química está adoptando prácticas sostenibles para reducir su impacto ambiental.',
            content: `
<h2>El Desafío de la Industria Química</h2>
<p>La industria química es fundamental para la economía global, pero también es una de las más intensivas en recursos y generadora de residuos. La adopción de prácticas sostenibles se ha convertido en un imperativo para garantizar la viabilidad a largo plazo.</p>

<h2>Tecnologías Innovadoras</h2>
<p>Empresas líderes están implementando tecnologías revolucionarias:</p>
<ul>
  <li>Procesos catalíticos avanzados para reducir emisiones</li>
  <li>Reciclaje de solventes y materiales</li>
  <li>Generación de energía verde en plantas industriales</li>
  <li>Desarrollo de productos biodegradables</li>
</ul>

<h2>Ejemplos de Éxito</h2>
<p>La introducción de la tecnología de óxidos metálicos nanoestructurados ha permitido reducir el consumo de energía en un 30% y los residuos tóxicos en un 40% en procesos de fabricación de productos químicos especializados.</p>

<h2>Economía Circular en la Química</h2>
<p>La adopción de la economía circular está transformando la industria:</p>
<ul>
  <li>Desarrollo de productos biodegradables</li>
  <li>Reciclaje de materiales de alta calidad</li>
  <li>Reutilización de solventes y catalizadores</li>
  <li>Reducción del consumo de agua</li>
</ul>

<h2>Perspectivas Futuras</h2>
<p>La combinación de nanotecnología y energías renovables promete una transformación completa de la industria química hacia un modelo más sostenible y eficiente.</p>
`,
            meta_title: 'Sostenibilidad en la Industria Química',
            meta_description: 'How the chemical industry is adopting sustainable practices to reduce environmental impact.',
            meta_keywords: 'sostenibilidad, industria quimica, procesos verdes, innovacion, economia circular'
          },
          en: {
            title: 'Sustainability in the Chemical Industry: Challenges and Opportunities',
            excerpt: 'How the chemical industry is adopting sustainable practices to reduce its environmental impact.',
            content: `
<h2>The Chemical Industry Challenge</h2>
<p>The chemical industry is fundamental to the global economy but also one of the most resource-intensive and waste-generating sectors. Adopting sustainable practices has become imperative for long-term viability.</p>

<h2>Innovative Technologies</h2>
<p>Leading companies are implementing revolutionary technologies:</p>
<ul>
  <li>Advanced catalytic processes to reduce emissions</li>
  <li>Solvent and material recycling</li>
  <li>Green energy generation in industrial plants</li>
  <li>Development of biodegradable products</li>
</ul>

<h2>Success Examples</h2>
<p>The introduction of nanostructured metal oxide technology has reduced energy consumption by 30% and toxic waste by 40% in specialty chemicals manufacturing processes.</p>

<h2>Circular Economy in Chemistry</h2>
<p>The adoption of circular economy is transforming the industry:</p>
<ul>
  <li>Development of biodegradable products</li>
  <li>High-quality material recycling</li>
  <li>Reuse of solvents and catalysts</li>
  <li>Water consumption reduction</li>
</ul>

<h2>Future Prospects</h2>
<p>The combination of nanotechnology and renewable energies promises a complete transformation of the chemical industry towards a more sustainable and efficient model.</p>
`,
            meta_title: 'Sustainability in the Chemical Industry',
            meta_description: 'How the chemical industry adopts sustainable practices to reduce environmental impact.',
            meta_keywords: 'sustainability, chemical industry, green processes, innovation, circular economy'
          }
        },
        categories: [1, 2] // Sustainability and Innovation
      },
      {
        slug: 'bioseguridad-en-laboratorios-de-research',
        author: 'Dra. Ana López',
        cover_image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&h=600&fit=crop',
        status: 'published',
        featured: false,
        translations: {
          es: {
            title: 'Nuevas Normas de Bioseguridad en Laboratorios de Investigación',
            excerpt: 'Cómo la pandemia ha transformado las prácticas de bioseguridad en entornos de investigación.',
            content: `
<h2>Transfomación Post-Pandemia</h2>
<p>La pandemia de COVID-19 ha demostrado la importancia crítica de las medidas de bioseguridad en laboratorios de investigación. Las normativas internacionales han sido actualizadas para reflejar los nuevos desafíos.</p>

<h2>Equipamiento Esencial</h2>
<p>Los laboratorios de alto nivel ahora implementan:</p>
<ul>
  <li>Cabinetes de bioseguridad de clase III</li>
  <li>Sistemas de ventilación de alta eficiencia (HEPA)</li>
  <li>Detección automatizada de riesgos biológicos</li>
  <li>Protocolos de descontaminación avanzados</li>
</ul>

<h2>Prácticas Optimizadas</h2>
<p>Las nuevas normativas incluyen:</p>
<ul>
  <li>Monitoreo continuo de entornos</li>
  <li>Gestión de residuos biológicos</li>
  <li>Capacitación regular de personal</li>
  <li>Protocolos de respuesta a emergencias</li>
</ul>

<h2>Tecnologías de Vanguardia</h2>
<p>La integración de sensores inteligentes y sistemas de monitorización en tiempo real está transformando la bioseguridad en laboratorios. Estos sistemas pueden detectar peligros antes de que ocurran incidentes.</p>

<h2>Conclusiones</h2>
<p>La bioseguridad en laboratorios no es solo una norma, sino una inversión en seguridad y ética. Las nuevas tecnologías y prácticas están protegendo tanto al personal como al entorno.</p>
`,
            meta_title: 'Nuevas Normas de Bioseguridad en Laboratorios',
            meta_description: 'How the pandemic transformed biosecurity practices in research environments.',
            meta_keywords: 'bioseguridad, laboratorios, investigacion, pandemica, protocolos'
          },
          en: {
            title: 'New Biosecurity Standards in Research Laboratories',
            excerpt: 'How the pandemic transformed biosecurity practices in research environments.',
            content: `
<h2>Post-Pandemic Transformation</h2>
<p>The COVID-19 pandemic has demonstrated the critical importance of biosecurity measures in research laboratories. International regulations have been updated to reflect new challenges.</p>

<h2>Essential Equipment</h2>
<p>High-level laboratories now implement:</p>
<ul>
  <li>Class III biosafety cabinets</li>
  <li>High-efficiency ventilation systems (HEPA)</li>
  <li>Automated biological risk detection</li>
  <li>Advanced decontamination protocols</li>
</ul>

<h2>Optimized Practices</h2>
<p>New regulations include:</p>
<ul>
  <li>Continuous environmental monitoring</li>
  <li>Biological waste management</li>
  <li>Regular staff training</li>
  <li>Emergency response protocols</li>
</ul>

<h2>Cutting-Edge Technologies</h2>
<p>The integration of smart sensors and real-time monitoring systems is transforming biosecurity in laboratories. These systems can detect hazards before incidents occur.</p>

<h2>Conclusions</h2>
<p>Laboratory biosecurity is not just a regulation; it's an investment in safety and ethics. New technologies and practices are protecting both personnel and the environment.</p>
`,
            meta_title: 'New Biosecurity Standards in Research Laboratories',
            meta_description: 'How the pandemic transformed biosecurity practices in research environments.',
            meta_keywords: 'biosecurity, laboratories, research, pandemic, protocols'
          }
        },
        categories: [3, 4] // Biosecurity and Industry 4.0
      },
      {
        slug: 'iot-y-bioseguridad-industrial',
        author: 'Ing. Pedro Martínez',
        cover_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop',
        status: 'published',
        featured: false,
        translations: {
          es: {
            title: 'IoT y Bioseguridad Industrial: Conectividad para la Seguridad',
            excerpt: 'Cómo la Internet of Things está revolucionando la bioseguridad en entornos industriales.',
            content: `
<h2>La Revolución de la IoT en la Industria</h2>
<p>La Internet of Things (IoT) está transformando la manera en que se gestionan los riesgos de bioseguridad en entornos industriales. Sensores inteligentes y sistemas conectados están optimizando la seguridad.</p>

<h2>Aplicaciones de la IoT en Bioseguridad</h2>
<p>Las tecnologías IoT se están usando para:</p>
<ul>
  <li>Monitoreo de entornos en tiempo real</li>
  <li>Detección temprana de contaminaciones</li>
  <li>Gestión automática de residuos</li>
  <li>Alertas y notificaciones instantáneas</li>
</ul>

<h2>Sistemas Inteligentes de Detección</h2>
<p>Los sensores IoT están integrados con analíticos avanzados para:</p>
<ul>
  <li>Identificar patrones de riesgo</li>
  <li>Predecir fallos de equipo</li>
  <li>Optimizar la eficiencia operativa</li>
  <li>Reducir el tiempo de respuesta</li>
</ul>

<h2>Beneficios Económicos y Operativos</h2>
<p>La adopción de IoT en bioseguridad ha demostrado:</p>
<ul>
  <li>Reducción de accidentes en un 40%</li>
  <li>Ahorro de costos en mantenimiento</li>
  <li>Mejora de la productividad</li>
  <li>Cumplimiento normativo automatizado</li>
</ul>

<h2>Futuro de la Bioseguridad Conectada</h2>
<p>La combinación de IoT con inteligencia artificial y blockchain promete un sistema de bioseguridad aún más robusto y eficiente para la industria 4.0.</p>
`,
            meta_title: 'IoT y Bioseguridad Industrial',
            meta_description: 'How IoT is revolutionizing biosecurity in industrial environments.',
            meta_keywords: 'iot, bioseguridad, industria 4.0, sensores, conectividad'
          },
          en: {
            title: 'IoT and Industrial Biosecurity: Connectivity for Safety',
            excerpt: 'How the Internet of Things is revolutionizing biosecurity in industrial environments.',
            content: `
<h2>The IoT Revolution in Industry</h2>
<p>The Internet of Things (IoT) is transforming how biosecurity risks are managed in industrial environments. Smart sensors and connected systems are optimizing safety.</p>

<h2>IoT Applications in Biosecurity</h2>
<p>IoT technologies are being used for:</p>
<ul>
  <li>Real-time environmental monitoring</li>
  <li>Early contamination detection</li>
  <li>Automated waste management</li>
  <li>Instant alerts and notifications</li>
</ul>

<h2>Smart Detection Systems</h2>
<p>IoT sensors are integrated with advanced analytics to:</p>
<ul>
  <li>Identify risk patterns</li>
  <li>Predict equipment failures</li>
  <li>Optimize operational efficiency</li>
  <li>Reduce response time</li>
</ul>

<h2>Economic and Operational Benefits</h2>
<p>IoT adoption in biosecurity has demonstrated:</p>
<ul>
  <li>40% reduction in accidents</li>
  <li>Maintenance cost savings</li>
  <li>Improved productivity</li>
  <li>Automated regulatory compliance</li>
</ul>

<h2>The Future of Connected Biosecurity</h2>
<p>The combination of IoT with artificial intelligence and blockchain promises an even more robust and efficient biosecurity system for Industry 4.0.</p>
`,
            meta_title: 'IoT and Industrial Biosecurity',
            meta_description: 'How IoT revolutionizes biosecurity in industrial environments.',
            meta_keywords: 'iot, biosecurity, industry 4.0, sensors, connectivity'
          }
        },
        categories: [4, 0] // Industry 4.0 and Technology
      }
    ];

    for (const postData of posts) {
      const post = await supabaseAPI.createBlogPost({
        slug: postData.slug,
        author: postData.author,
        cover_image: postData.cover_image,
        status: postData.status,
        featured: postData.featured
      });
      
      for (const lang of ['es', 'en']) {
        await supabaseAPI.updateBlogPostTranslation(post.id, lang, postData.translations[lang]);
      }
      
      // Assign categories
      for (const categoryIndex of postData.categories) {
        await supabaseAPI.addBlogPostCategory(post.id, categoryIds[categoryIndex]);
      }
      
      console.log(`   ✅ Post "${postData.translations.es.title}" created with ID: ${post.id}`);
    }

    console.log('\n=== Blog Data Added Successfully ===');
    console.log(`   ✅ ${categories.length} categories created`);
    console.log(`   ✅ ${posts.length} posts created`);

  } catch (error) {
    console.error('Error adding blog data:', error);
    process.exit(1);
  }
}

// Run the script
addDetailedBlogData().then(() => process.exit(0));