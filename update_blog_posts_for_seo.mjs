import { supabase, supabaseAPI } from './supabase-client.mjs';

async function updateBlogPostsForSEO() {
  try {
    console.log('=== Updating Blog Posts for SEO ===\n');

    // Get all existing posts
    const { data: posts, error: getPostsError } = await supabase
      .from('blog_posts')
      .select('id, slug');

    if (getPostsError) {
      console.error('❌ Error getting posts:', getPostsError);
      return;
    }

    console.log(`🔍 Found ${posts.length} existing posts`);

    // Updated content for each post
    const updatedPosts = [
      {
        slug: 'nanotecnologia-para-la-deteccion-de-enfermedades',
        translations: {
          es: {
            title: 'Nanotecnología para la Detección Temprana de Enfermedades: Avances Revolucionarios',
            excerpt: 'Descubre cómo la nanotecnología está transformando el diagnóstico médico con sensores ultrasensibles que detectan enfermedades en etapas iniciales.',
            content: `
<h2>Introducción a la Nanotecnología en Medicina</h2>
<p>La nanotecnología ha abierto nuevas fronteras en la detección temprana de enfermedades. Los nanosensores modernos pueden identificar biomarcadores a niveles moleculares, permitiendo diagnósticos más precisos y tratamientos más efectivos.</p>

<h3>¿Qué son los Nanosensores?</h3>
<p>Los nanosensores son dispositivos miniaturizados, generalmente entre 1 y 100 nanómetros de tamaño, que interactúan con moléculas biológicas. Su alta sensibilidad les permite detectar incluso concentraciones extremadamente bajas de proteínas, células o ácidos nucleicos.</p>

<h3>Principales Aplicaciones Clínicas</h3>
<p>Estos dispositivos revolucionarios se están utilizando en:</p>
<ul>
  <li><strong>Detección de cáncer:</strong> Identificación de células cancerosas en sangre o fluidos corporales</li>
  <li><strong>Diagnóstico cardíaco:</strong> Detección de marcadores de enfermedades cardiovasculares</li>
  <li><strong>Monitoreo viral:</strong> Detección rápida de patógenos como el COVID-19</li>
  <li><strong>Neurociencia:</strong> Evaluación de trastornos como el Alzheimer y el Parkinson</li>
</ul>

<h3>Ventajas Overwhelming</h3>
<p>La nanotecnología ofrece beneficios significativos:</p>
<ul>
  <li>Precisión milimétrica en la detección de biomarcadores</li>
  <li>Reducción de la invasividad de los procedimientos</li>
  <li>Ahorro en costos de diagnóstico</li>
  <li>Mejora en las tasas de supervivencia</li>
</ul>

<h3>Futuro de la Nanomedicina</h3>
<p>La investigación continua en:</p>
<ul>
  <li>Sistemas de diagnóstico personalizado</li>
  <li>Nanosensores implantables</li>
  <li>Integración con inteligencia artificial para análisis predictivo</li>
  <li>Dispositivos portátiles para monitoreo doméstico</li>
</ul>

<p>La nanotecnología está transformando la medicina como la conocemos, abriendo un futuro donde las enfermedades se detectarán y tratarán antes de que aparezcan los síntomas.</p>
`,
            meta_title: 'Nanotecnología para Detección Temprana de Enfermedades - Avances Revolucionarios',
            meta_description: 'Descubre cómo la nanotecnología está transformando el diagnóstico médico con sensores ultrasensibles que detectan enfermedades en etapas iniciales.',
            meta_keywords: 'nanotecnologia, detección temprana, nanosensores, medicina, diagnóstico, cáncer, enfermedades'
          },
          en: {
            title: 'Nanotechnology for Early Disease Detection: Revolutionary Advances',
            excerpt: 'Discover how nanotechnology is transforming medical diagnosis with ultra-sensitive sensors that detect diseases in early stages.',
            content: `
<h2>Introduction to Nanotechnology in Medicine</h2>
<p>Nanotechnology has opened new frontiers in early disease detection. Modern nanosensors can identify biomarkers at molecular levels, enabling more precise diagnoses and more effective treatments.</p>

<h3>What are Nanosensors?</h3>
<p>Nanosensors are miniaturized devices, typically between 1 and 100 nanometers in size, that interact with biological molecules. Their high sensitivity allows them to detect even extremely low concentrations of proteins, cells, or nucleic acids.</p>

<h3>Main Clinical Applications</h3>
<p>These revolutionary devices are being used in:</p>
<ul>
  <li><strong>Cancer detection:</strong> Identification of cancer cells in blood or bodily fluids</li>
  <li><strong>Cardiac diagnosis:</strong> Detection of cardiovascular disease markers</li>
  <li><strong>Viral monitoring:</strong> Rapid detection of pathogens like COVID-19</li>
  <li><strong>Neuroscience:</strong> Evaluation of disorders like Alzheimer's and Parkinson's</li>
</ul>

<h3>Overwhelming Advantages</h3>
<p>Nanotechnology offers significant benefits:</p>
<ul>
  <li>Millimeter precision in biomarker detection</li>
  <li>Reduction in invasive procedures</li>
  <li>Cost savings in diagnosis</li>
  <li>Improvement in survival rates</li>
</ul>

<h3>The Future of Nanomedicine</h3>
<p>Research continues in:</p>
<ul>
  <li>Personalized diagnostic systems</li>
  <li>Implantable nanosensors</li>
  <li>Integration with artificial intelligence for predictive analysis</li>
  <li>Portable devices for home monitoring</li>
</ul>

<p>Nanotechnology is transforming medicine as we know it, opening a future where diseases will be detected and treated before symptoms appear.</p>
`,
            meta_title: 'Nanotechnology for Early Disease Detection - Revolutionary Advances',
            meta_description: 'Discover how nanotechnology is transforming medical diagnosis with ultra-sensitive sensors that detect diseases in early stages.',
            meta_keywords: 'nanotechnology, early detection, nanosensors, medicine, diagnosis, cancer, diseases'
          }
        }
      },
      {
        slug: 'sostenibilidad-en-la-industria-quimica',
        translations: {
          es: {
            title: 'Sostenibilidad en la Industria Química: Retos y Oportunidades para un Futuro Verde',
            excerpt: 'Explora cómo la industria química está adoptando prácticas sostenibles para reducir su impacto ambiental y generar valor social.',
            content: `
<h2>El Desafío de la Industria Química Sostenible</h2>
<p>La industria química es fundamental para la economía global, pero también es una de las más intensivas en recursos. La adopción de prácticas sostenibles se ha convertido en un imperativo para garantizar la viabilidad a largo plazo.</p>

<h3>Tecnologías Innovadoras para la Sostenibilidad</h3>
<p>Empresas líderes están implementando soluciones revolucionarias:</p>
<ul>
  <li><strong>Procesos catalíticos avanzados:</strong> Reducción de emisiones de CO2 en un 30%</li>
  <li><strong>Reciclaje de solventes:</strong> Reutilización de materiales para disminuir residuos</li>
  <li><strong>Energía verde:</strong> Uso de energía solar y eólica en plantas industriales</li>
  <li><strong>Productos biodegradables:</strong> Alternativas a los plásticos tradicionales</li>
</ul>

<h3>Economía Circular en la Química</h3>
<p>La adopción de la economía circular está transformando la industria:</p>
<ul>
  <li>Desarrollo de productos biodegradables</li>
  <li>Reciclaje de materiales de alta calidad</li>
  <li>Reutilización de solventes y catalizadores</li>
  <li>Reducción del consumo de agua</li>
</ul>

<h3>Casos de Éxito</h3>
<p>La introducción de nanotecnología en la producción de productos químicos especializados ha permitido:</p>
<ul>
  <li>Reducción del consumo de energía en un 35%</li>
  <li>Disminución de residuos tóxicos en un 45%</li>
  <li>Ahorro de costos operativos significativos</li>
  <li>Mejora de la imagen corporativa</li>
</ul>

<h3>Futuro Sostenible</h3>
<p>Las tendencias clave para la industria química incluyen:</p>
<ul>
  <li>Integración de AI para optimización de procesos</li>
  <li>Desarrollo de baterías sostenibles</li>
  <li>Uso de materiales biológicos</li>
  <li>Certificaciones ambientales más rigurosas</li>
</ul>

<p>La industria química tiene la oportunidad de liderar la transición hacia una economía verde, combinando innovación tecnológica con responsabilidad ambiental.</p>
`,
            meta_title: 'Sostenibilidad en la Industria Química - Retos y Oportunidades',
            meta_description: 'Explora cómo la industria química está adoptando prácticas sostenibles para reducir su impacto ambiental.',
            meta_keywords: 'sostenibilidad, industria química, procesos verdes, innovación, economía circular'
          },
          en: {
            title: 'Sustainability in the Chemical Industry: Challenges and Opportunities for a Green Future',
            excerpt: 'Explore how the chemical industry is adopting sustainable practices to reduce its environmental impact and generate social value.',
            content: `
<h2>The Challenge of Sustainable Chemical Industry</h2>
<p>The chemical industry is fundamental to the global economy but is also one of the most resource-intensive. Adopting sustainable practices has become imperative for long-term viability.</p>

<h3>Innovative Technologies for Sustainability</h3>
<p>Leading companies are implementing revolutionary solutions:</p>
<ul>
  <li><strong>Advanced catalytic processes:</strong> 30% reduction in CO2 emissions</li>
  <li><strong>Solvent recycling:</strong> Material reuse to reduce waste</li>
  <li><strong>Green energy:</strong> Solar and wind power in industrial plants</li>
  <li><strong>Biodegradable products:</strong> Alternatives to traditional plastics</li>
</ul>

<h3>Circular Economy in Chemistry</h3>
<p>The adoption of circular economy is transforming the industry:</p>
<ul>
  <li>Development of biodegradable products</li>
  <li>High-quality material recycling</li>
  <li>Reuse of solvents and catalysts</li>
  <li>Water consumption reduction</li>
</ul>

<h3>Success Stories</h3>
<p>The introduction of nanotechnology in the production of specialty chemicals has allowed:</p>
<ul>
  <li>35% reduction in energy consumption</li>
  <li>45% reduction in toxic waste</li>
  <li>Significant operational cost savings</li>
  <li>Improved corporate image</li>
</ul>

<h3>Sustainable Future</h3>
<p>Key trends for the chemical industry include:</p>
<ul>
  <li>AI integration for process optimization</li>
  <li>Development of sustainable batteries</li>
  <li>Use of biological materials</li>
  <li>More rigorous environmental certifications</li>
</ul>

<p>The chemical industry has the opportunity to lead the transition to a green economy, combining technological innovation with environmental responsibility.</p>
`,
            meta_title: 'Sustainability in the Chemical Industry - Challenges and Opportunities',
            meta_description: 'Explore how the chemical industry is adopting sustainable practices to reduce its environmental impact.',
            meta_keywords: 'sustainability, chemical industry, green processes, innovation, circular economy'
          }
        }
      }
    ];

    let postsUpdated = 0;
    for (const updatedPost of updatedPosts) {
      const existingPost = posts.find(post => post.slug === updatedPost.slug);
      if (!existingPost) {
        console.log(`🔍 Post with slug "${updatedPost.slug}" not found, skipping...`);
        continue;
      }

      try {
        // Update translations for both languages
        for (const lang of ['es', 'en']) {
          await supabaseAPI.updateBlogPostTranslation(
            existingPost.id,
            lang,
            updatedPost.translations[lang]
          );
          console.log(`✅ Updated ${lang.toUpperCase()} translation for post: ${updatedPost.translations[lang].title}`);
        }

        postsUpdated++;
      } catch (error) {
        console.error(`❌ Error updating post "${updatedPost.slug}":`, error);
      }
    }

    console.log(`\n=== Done! Updated ${postsUpdated} posts for SEO ===`);
    console.log(`✅ Posts now have comprehensive, well-structured content following Google guidelines`);

  } catch (error) {
    console.error('Error updating blog posts for SEO:', error);
  }
}

updateBlogPostsForSEO().then(() => process.exit(0));