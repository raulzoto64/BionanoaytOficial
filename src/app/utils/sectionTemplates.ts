export const DEFAULT_SECTION_TEMPLATES = [
  {
    name: 'Banner Principal (Hero)',
    type: 'hero',
    content: {
      es: {
        title: 'Innovación en <strong>Biotecnología</strong>',
        subtitle: 'Transformando el futuro de la industria con soluciones sostenibles.',
        ctaText: 'Ver Productos',
        ctaLink: '/store',
        ctaActionType: 'route',
        backgroundImage: 'https://images.unsplash.com/photo-1532187875605-1ef6c237a1e0?auto=format&fit=crop&q=80'
      },
      en: {
        title: 'Innovation in <strong>Biotechnology</strong>',
        subtitle: 'Transforming the future of industry with sustainable solutions.',
        ctaText: 'View Products',
        ctaLink: '/store',
        ctaActionType: 'route',
        backgroundImage: 'https://images.unsplash.com/photo-1532187875605-1ef6c237a1e0?auto=format&fit=crop&q=80'
      }
    }
  },
  {
    name: 'Hero Blog (Especializado)',
    type: 'hero-blog',
    content: {
      es: { title: 'Actualidad y Ciencia', subtitle: 'Descubre los últimos avances de Bionano.', badge: 'Blog' },
      en: { title: 'News and Science', subtitle: 'Discover the latest advances from Bionano.', badge: 'Blog' }
    }
  },
  {
    name: 'Estadísticas y Métricas',
    type: 'stats',
    content: {
      es: {
        title: 'Nuestros Logros',
        stats: [
          { value: '500+', label: 'Clientes Felices' },
          { value: '15+', label: 'Años de Experiencia' }
        ]
      },
      en: {
        title: 'Our Achievements',
        stats: [
          { value: '500+', label: 'Happy Clients' },
          { value: '15+', label: 'Years of Experience' }
        ]
      }
    }
  },
  {
    name: 'Directorio del Ecosistema',
    type: 'category-filter',
    content: {
      es: { title: 'Miembros de Nuestra Red', subtitle: 'Filtra por categoría.' },
      en: { title: 'Our Network Members', subtitle: 'Filter by category.' }
    }
  },
  {
    name: 'Ecosistema / Red (Features)',
    type: 'ecosystem',
    content: {
       es: { title: 'Nuestra Red de Ecosistema', items: [{ title: 'Item 1', icon: 'FlaskConical' }] },
       en: { title: 'Our Ecosystem Network', items: [{ title: 'Item 1', icon: 'FlaskConical' }] }
    }
  },
  {
    name: 'Llamado a la Acción (CTA)',
    type: 'cta',
    content: {
      es: { title: '¿Listo para el siguiente paso?', ctaText: 'Contáctanos', ctaLink: '/contact', ctaActionType: 'route' },
      en: { title: 'Ready for the next step?', ctaText: 'Contact Us', ctaLink: '/contact', ctaActionType: 'route' }
    }
  },
  {
    name: 'Bento Grid (Elegirnos)',
    type: 'bento',
    content: {
      es: { title: 'Elegirnos', items: [{ title: 'Tecnología', icon: 'Cpu', size: 'large' }] },
      en: { title: 'Choose us', items: [{ title: 'Technology', icon: 'Cpu', size: 'large' }] }
    }
  },
  {
    name: 'Sección Destacados (Featured)',
    type: 'featured',
    content: {
      es: { title: 'Innovación', productName: 'Bionano Alpha', productDescription: 'El estándar de oro.', features: [{ title: 'Rápido', icon: 'Zap' }] },
      en: { title: 'Innovation', productName: 'Bionano Alpha', productDescription: 'The gold standard.', features: [{ title: 'Fast', icon: 'Zap' }] }
    }
  },
  {
    name: 'Certificaciones',
    type: 'certifications',
    content: {
      es: { title: 'Calidad Certificada', items: [{ title: 'ISO 9001', icon: 'BadgeCheck' }] },
      en: { title: 'Certified Quality', items: [{ title: 'ISO 9001', icon: 'BadgeCheck' }] }
    }
  },
  {
    name: 'Línea de Tiempo',
    type: 'timeline',
    content: {
      es: { title: 'Historia', milestones: [{ year: '2023', title: 'Hito 1' }] },
      en: { title: 'History', milestones: [{ year: '2023', title: 'Milestone 1' }] }
    }
  },
  {
    name: 'Catálogo de Productos',
    type: 'products',
    content: {
      es: { title: 'Productos', subtitle: 'Explora nuestra gama.' },
      en: { title: 'Products', subtitle: 'Explore our range.' }
    }
  },
  {
    name: 'Tarjetas Giratorias',
    type: 'flipcards',
    content: {
      es: { items: [{ title: 'Info', icon: 'Info', description: 'Gira para ver más.' }] },
      en: { items: [{ title: 'Info', icon: 'Info', description: 'Flip to see more.' }] }
    }
  },
  {
    name: 'Logos de Clientes',
    type: 'clientes',
    content: {
      es: { title: 'Nuestros Clientes' },
      en: { title: 'Our Clients' }
    }
  },
  {
    name: 'Noticias / Blog',
    type: 'blog',
    content: {
      es: { title: 'Últimas Noticias' },
      en: { title: 'Latest News' }
    }
  }
];
