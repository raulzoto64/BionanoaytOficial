import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://jzmdfoptxmqywihyhoty.supabase.co', 'sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15');

async function insertMissingPageContents() {
  const pages = ['page-technology', 'page-process'];
  const languages = ['es', 'en'];

  for (const pageId of pages) {
    for (const language of languages) {
      console.log('Insertando contenido para página ' + pageId + ' en ' + language + '...');
      const { error } = await supabase
        .from('page_contents')
        .upsert({
          page_id: pageId,
          language: language,
          sections: []
        });

      if (error) {
        console.error('Error al insertar contenido para ' + pageId + ' - ' + language + ':', error);
      } else {
        console.log('Contenido insertado exitosamente para ' + pageId + ' - ' + language);
      }
    }
  }

  // Verificar que todos los registros estén presentes
  const { data: allContents, error: getAllError } = await supabase
    .from('page_contents')
    .select('*');

  if (getAllError) {
    console.error('Error al obtener todos los contenidos:', getAllError);
  } else {
    console.log('Contenidos encontrados:', allContents.length);
    console.log('Detalles:', allContents);
  }
}

insertMissingPageContents();