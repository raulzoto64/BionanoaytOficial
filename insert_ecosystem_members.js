import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function insertEcosystemMembers() {
  try {
    console.log('Insertando miembros del ecosistema...');

    // Miembros del ecosistema
    const ecosystemMembers = [
      {
        id: 'eco-001',
        slug: 'biotecnologia-innovadora',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1576834976341-53b1b975c6f9?w=800',
        sector: 'Biotecnología',
        social_media: {
          facebook: 'https://facebook.com/biotecnologia',
          twitter: 'https://twitter.com/biotecnologia',
          instagram: 'https://instagram.com/biotecnologia',
          linkedin: 'https://linkedin.com/company/biotecnologia',
          website: 'https://biotecnologia.com'
        },
        youtube_videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
        short_videos: ['https://www.youtube.com/embed/9bZkp7q19f0']
      },
      {
        id: 'eco-002',
        slug: 'sostenibilidad-ambiental',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1580053234218-74eb4ae03a44?w=800',
        sector: 'Sostenibilidad',
        social_media: {
          facebook: 'https://facebook.com/sostenibilidad',
          twitter: 'https://twitter.com/sostenibilidad',
          instagram: 'https://instagram.com/sostenibilidad',
          linkedin: 'https://linkedin.com/company/sostenibilidad',
          website: 'https://sostenibilidad.com'
        },
        youtube_videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
        short_videos: ['https://www.youtube.com/embed/9bZkp7q19f0']
      },
      {
        id: 'eco-003',
        slug: 'nanotecnologia-applicada',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1601839215170-6ce5854968d6?w=800',
        sector: 'Nanotecnología',
        social_media: {
          facebook: 'https://facebook.com/nanotecnologia',
          twitter: 'https://twitter.com/nanotecnologia',
          instagram: 'https://instagram.com/nanotecnologia',
          linkedin: 'https://linkedin.com/company/nanotecnologia',
          website: 'https://nanotecnologia.com'
        },
        youtube_videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
        short_videos: ['https://www.youtube.com/embed/9bZkp7q19f0']
      },
      {
        id: 'eco-004',
        slug: 'agricultura-moderna',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800',
        sector: 'Agricultura',
        social_media: {
          facebook: 'https://facebook.com/agricultura',
          twitter: 'https://twitter.com/agricultura',
          instagram: 'https://instagram.com/agricultura',
          linkedin: 'https://linkedin.com/company/agricultura',
          website: 'https://agricultura.com'
        },
        youtube_videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
        short_videos: ['https://www.youtube.com/embed/9bZkp7q19f0']
      }
    ];

    // Insertar miembros del ecosistema
    const { error: membersError } = await supabase
      .from('ecosystem_members')
      .upsert(ecosystemMembers);

    if (membersError) {
      console.error('Error al insertar miembros del ecosistema:', membersError);
    } else {
      console.log('Miembros del ecosistema insertados exitosamente');
    }

    // Traducciones de los miembros del ecosistema
    const ecosystemMemberTranslations = [
      {
        member_id: 'eco-001',
        language: 'es',
        name: 'Biotecnología Innovadora',
        description: 'Empresa líder en desarrollo de soluciones biotecnológicas para la agricultura y la salud. Especializada en productos naturales y sostenibles que promueven el bienestar de los cultivos y el medio ambiente.'
      },
      {
        member_id: 'eco-001',
        language: 'en',
        name: 'Innovative Biotech',
        description: 'Leading company in the development of biotechnological solutions for agriculture and health. Specialized in natural and sustainable products that promote crop and environmental well-being.'
      },
      {
        member_id: 'eco-002',
        language: 'es',
        name: 'Sostenibilidad Ambiental',
        description: 'Especialistas en consultoría y soluciones para la gestión sostenible de recursos naturales. Ayudamos a las empresas a reducir su impacto ambiental a través de tecnologías eco-friendly.'
      },
      {
        member_id: 'eco-002',
        language: 'en',
        name: 'Environmental Sustainability',
        description: 'Specialists in consulting and solutions for sustainable management of natural resources. We help companies reduce their environmental impact through eco-friendly technologies.'
      },
      {
        member_id: 'eco-003',
        language: 'es',
        name: 'Nanotecnología Aplicada',
        description: 'Investigación y desarrollo de nanomateriales para aplicaciones industriales y médicas. Nuestros productos aprovechan las propiedades únicas de las nanopartículas para resolver problemas complejos.'
      },
      {
        member_id: 'eco-003',
        language: 'en',
        name: 'Applied Nanotechnology',
        description: 'Research and development of nanomaterials for industrial and medical applications. Our products leverage the unique properties of nanoparticles to solve complex problems.'
      },
      {
        member_id: 'eco-004',
        language: 'es',
        name: 'Agricultura Moderna',
        description: 'Tecnologías digitales y biológicas para mejorar la productividad y sostenibilidad agrícola. Ofrecemos soluciones integrales para el manejo eficiente de cultivos y ganadería.'
      },
      {
        member_id: 'eco-004',
        language: 'en',
        name: 'Modern Agriculture',
        description: 'Digital and biological technologies to improve agricultural productivity and sustainability. We offer comprehensive solutions for efficient crop and livestock management.'
      }
    ];

    // Insertar traducciones de los miembros del ecosistema
    const { error: translationsError } = await supabase
      .from('ecosystem_member_translations')
      .upsert(ecosystemMemberTranslations);

    if (translationsError) {
      console.error('Error al insertar traducciones de miembros del ecosistema:', translationsError);
    } else {
      console.log('Traducciones de miembros del ecosistema insertadas exitosamente');
    }

    // Verificar que los datos se cargaron correctamente
    const { data: verifyMembers, error: verifyMembersError } = await supabase.from('ecosystem_members').select('*');
    const { data: verifyTranslations, error: verifyTranslationsError } = await supabase.from('ecosystem_member_translations').select('*');

    if (verifyMembersError) {
      console.error('Error al verificar miembros del ecosistema:', verifyMembersError);
    } else {
      console.log(`Miembros del ecosistema encontrados: ${verifyMembers.length}`);
    }

    if (verifyTranslationsError) {
      console.error('Error al verificar traducciones de miembros del ecosistema:', verifyTranslationsError);
    } else {
      console.log(`Traducciones de miembros del ecosistema encontradas: ${verifyTranslations.length}`);
    }

    console.log('¡Datos de miembros del ecosistema insertados exitosamente!');

  } catch (error) {
    console.error('Error al insertar datos de miembros del ecosistema:', error);
  }
}

insertEcosystemMembers();