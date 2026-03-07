import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://jzmdfoptxmqywihyhoty.supabase.co';
const supabaseKey = 'sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15';
const supabase = createClient(supabaseUrl, supabaseKey);

async function getCategories() {
  try {
    const { data: categories, error } = await supabase.from('categories').select('*');
    if (error) throw error;
    console.log('Categories:', JSON.stringify(categories, null, 2));
    
    const { data: translations, error: transError } = await supabase.from('category_translations').select('*');
    if (transError) throw transError;
    console.log('Category Translations:', JSON.stringify(translations, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

getCategories();