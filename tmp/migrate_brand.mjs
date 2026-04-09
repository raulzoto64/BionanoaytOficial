import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function migrateFooter() {
  console.log('Iniciando migración de marca en el Footer...');
  
  const { data: footerSettings, error: fetchError } = await supabase
    .from('footer_settings')
    .select('*')
    .single();

  if (fetchError || !footerSettings) {
    console.error('Error al obtener footer_settings:', fetchError?.message);
    return;
  }

  // Convertir a string para reemplazo global
  let settingsStr = JSON.stringify(footerSettings);
  const updatedStr = settingsStr.replace(/Bionanoaxus/g, 'BionanoAyT');

  if (settingsStr === updatedStr) {
    console.log('No se encontraron menciones de Bionanoaxus en el Footer.');
    return;
  }

  const updatedSettings = JSON.parse(updatedStr);
  delete updatedSettings.id; // Evitar conflictos de ID en el update
  delete updatedSettings.created_at;

  const { error: updateError } = await supabase
    .from('footer_settings')
    .update(updatedSettings)
    .eq('id', footerSettings.id);

  if (updateError) {
    console.error('Error al actualizar footer_settings:', updateError.message);
  } else {
    console.log('¡Marca actualizada exitosamente en la Base de Datos!');
  }
}

migrateFooter();
