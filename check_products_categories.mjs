import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://jzmdfoptxmqywihyhoty.supabase.co';
const supabaseKey = 'sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15';
const supabase = createClient(supabaseUrl, supabaseKey);

async function getProducts() {
  try {
    const { data: products, error } = await supabase.from('products').select('id, slug, category');
    if (error) throw error;
    console.log('Products with categories:', JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

getProducts();