import { supabase, supabaseAPI } from './supabase-client.mjs';

async function addBlogDataSafe() {
  try {
    console.log('=== Adding Blog Data (Safe Version) ===\n');

    console.log('1. Checking existing categories...');
    
    // Check existing categories
    const { data: existingCategories, error: getCategoriesError } = await supabase
      .from('blog_categories')
      .select('id, slug');

    if (getCategoriesError) {
      console.error('❌ Error getting categories:', getCategoriesError);
      return;
    }

    const existingCategorySlugs = new Set(existingCategories.map(c => c.slug));
    console.log(`🔍 Found ${existingCategories.length} existing categories: ${[...existingCategorySlugs]}`);

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
      if (existingCategorySlugs.has(categoryData.slug)) {
        const existingCategory = existingCategories.find(c => c.slug === categoryData.slug);
        categoryIds.push(existingCategory.id);
        console.log(`🔄 Category "${categoryData.translations.es.name}" already exists, skipping...`);
        continue;
      }

      const category = await supabaseAPI.createBlogCategory({
        slug: categoryData.slug,
        order: categoryData.order,
        status: categoryData.status
      });
      
      for (const lang of ['es', 'en']) {
        await supabaseAPI.updateBlogCategoryTranslation(category.id, lang, categoryData.translations[lang]);
      }
      
      categoryIds.push(category.id);
      console.log(`✅ Category "${categoryData.translations.es.name}" created with ID: ${category.id}`);
    }

    console.log('\n2. Checking existing posts...');
    
    const { data: existingPosts, error: getPostsError } = await supabase
      .from('blog_posts')
      .select('id, slug');

    if (getPostsError) {
      console.error('❌ Error getting posts:', getPostsError);
      return;
    }

    const existingPostSlugs = new Set(existingPosts.map(p => p.slug));
    console.log(`🔍 Found ${existingPosts.length} existing posts`);

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
`,
            meta_title: 'Sustainability in the Chemical Industry',
            meta_description: 'How the chemical industry adopts sustainable practices to reduce environmental impact.',
            meta_keywords: 'sustainability, chemical industry, green processes, innovation, circular economy'
          }
        },
        categories: [1, 2] // Sustainability and Innovation
      }
    ];

    for (const postData of posts) {
      if (existingPostSlugs.has(postData.slug)) {
        console.log(`🔄 Post "${postData.translations.es.title}" already exists, skipping...`);
        continue;
      }

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
      
      console.log(`✅ Post "${postData.translations.es.title}" created with ID: ${post.id}`);
    }

    console.log('\n=== Blog Data Added Successfully ===');
    console.log(`✅ Categories: ${categoryIds.length}`);
    console.log(`✅ Posts: ${posts.filter(p => !existingPostSlugs.has(p.slug)).length} new posts added`);

  } catch (error) {
    console.error('Error adding blog data:', error);
    process.exit(1);
  }
}

addBlogDataSafe().then(() => process.exit(0));