import { supabase, supabaseAPI } from './supabase-client.mjs';

async function addMoreBlogPosts() {
  try {
    console.log('=== Adding More Blog Posts ===\n');

    // Get category IDs
    const { data: categories, error: getCategoriesError } = await supabase
      .from('blog_categories')
      .select('id, slug');

    if (getCategoriesError) {
      console.error('❌ Error getting categories:', getCategoriesError);
      return;
    }

    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.slug] = category.id;
    });

    console.log('🔍 Found categories:', Object.keys(categoryMap));

    // Check existing posts
    const { data: existingPosts, error: getPostsError } = await supabase
      .from('blog_posts')
      .select('slug');

    if (getPostsError) {
      console.error('❌ Error getting posts:', getPostsError);
      return;
    }

    const existingSlugs = new Set(existingPosts.map(p => p.slug));
    console.log(`🔍 Found ${existingPosts.length} existing posts`);

    // New posts to add
    const newPosts = [
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
`,
            meta_title: 'New Biosecurity Standards in Research Laboratories',
            meta_description: 'How the pandemic transformed biosecurity practices in research environments.',
            meta_keywords: 'biosecurity, laboratories, research, pandemic, protocols'
          }
        },
        categories: ['bioseguridad', 'industria-20'] // Biosecurity and Industry 4.0
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
`,
            meta_title: 'IoT and Industrial Biosecurity',
            meta_description: 'How IoT revolutionizes biosecurity in industrial environments.',
            meta_keywords: 'iot, biosecurity, industry 4.0, sensors, connectivity'
          }
        },
        categories: ['industria-20', 'tecnologia'] // Industry 4.0 and Technology
      },
      {
        slug: 'nanomateriales-sostenibles-en-construccion',
        author: 'Arq. Sofia Mendez',
        cover_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=600&fit=crop',
        status: 'published',
        featured: true,
        translations: {
          es: {
            title: 'Nanomateriales Sostenibles en la Construcción Moderna',
            excerpt: 'Cómo los nanomateriales están transformando la construcción con materiales más duraderos y ecológicos.',
            content: `
<h2>Materiales del Futuro</h2>
<p>Los nanomateriales están revolucionando la industria de la construcción con propiedades sorprendentes. Desde pinturas autolimpiantes hasta concreto reforzado con nanofibras, la innovación es constante.</p>
`,
            meta_title: 'Nanomateriales Sostenibles en Construcción',
            meta_description: 'How nanomaterials are transforming construction with durable and eco-friendly materials.',
            meta_keywords: 'nanomateriales, construccion, sostenibilidad, materiales innovadores'
          },
          en: {
            title: 'Sustainable Nanomaterials in Modern Construction',
            excerpt: 'How nanomaterials are transforming construction with more durable and eco-friendly materials.',
            content: `
<h2>The Materials of the Future</h2>
<p>Nanomaterials are revolutionizing the construction industry with amazing properties. From self-cleaning paints to nanofiber-reinforced concrete, innovation is constant.</p>
`,
            meta_title: 'Sustainable Nanomaterials in Modern Construction',
            meta_description: 'How nanomaterials are transforming construction with durable and eco-friendly materials.',
            meta_keywords: 'nanomaterials, construction, sustainability, innovative materials'
          }
        },
        categories: ['tecnologia', 'sostenibilidad'] // Technology and Sustainability
      }
    ];

    let postsAdded = 0;
    for (const postData of newPosts) {
      if (existingSlugs.has(postData.slug)) {
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
      for (const categorySlug of postData.categories) {
        if (categoryMap[categorySlug]) {
          await supabaseAPI.addBlogPostCategory(post.id, categoryMap[categorySlug]);
        }
      }
      
      postsAdded++;
      console.log(`✅ Post "${postData.translations.es.title}" created with ID: ${post.id}`);
    }

    // Verify the new posts were added
    const { data: updatedPosts, error: updatedPostsError } = await supabase
      .from('blog_posts')
      .select('slug');

    if (updatedPostsError) {
      console.error('❌ Error verifying new posts:', updatedPostsError);
    } else {
      console.log(`\n✅ Total posts now: ${updatedPosts.length}`);
    }

    console.log(`\n=== Done! Added ${postsAdded} new posts ===`);

  } catch (error) {
    console.error('Error adding more blog posts:', error);
  }
}

addMoreBlogPosts().then(() => process.exit(0));