import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://jzmdfoptxmqywihyhoty.supabase.co', 'sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15');

async function addImagesColumn() {
  try {
    // Crear archivo SQL temporal
    const sql = "ALTER TABLE products ADD COLUMN images JSONB DEFAULT '[]'::jsonb;";
    const tempFile = 'temp_sql.sql';
    const fs = await import('fs');
    
    fs.writeFileSync(tempFile, sql);
    
    console.log('Archivo SQL creado:', tempFile);
    console.log('');
    console.log('Para agregar la columna images a la tabla products:');
    console.log('');
    console.log('1. Abre la consola SQL de Supabase:');
    console.log('   https://supabase.com/dashboard/project/jzmdfoptxmqywihyhoty/sql');
    console.log('');
    console.log('2. Copia y pega el siguiente SQL:');
    console.log('');
    console.log(sql);
    console.log('');
    console.log('3. Ejecuta el SQL.');
    console.log('');
    console.log('Once you run this, the application will work correctly.');
  } catch (error) {
    console.error('Error:', error);
  }
}

addImagesColumn();