import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://jzmdfoptxmqywihyhoty.supabase.co', 'sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15');

async function addFeaturedColumn() {
  try {
    const { error } = await supabase.rpc('add_column', {
      table_name: 'products',
      column_name: 'featured',
      column_type: 'boolean',
      default_value: 'false'
    });

    if (error) {
      console.error('Error adding column:', error);
    } else {
      console.log('Featured column added successfully');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function addFeaturedColumnAlternative() {
  // Try using SQL directly
  const { error } = await supabase
    .from('products')
    .upsert([], {
      onConflict: 'id',
      returning: 'minimal'
    })
    .then(() => {
      // This is a workaround to check if column exists first
      return supabase.from('products').select('featured').limit(1);
    })
    .catch(async (err) => {
      if (err.message.includes('column "featured" does not exist')) {
        console.log('Column does not exist, creating...');
        return supabase.rpc('execute_sql', {
          sql: 'ALTER TABLE products ADD COLUMN featured BOOLEAN DEFAULT false;'
        });
      }
      return Promise.reject(err);
    });

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Column check/creation completed');
  }
}

async function checkProductsTable() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Products table data:', data);
  }
}

async function setSomeProductsAsFeatured() {
  // Set first 3 products as featured
  const { data, error } = await supabase
    .from('products')
    .update({ featured: true })
    .eq('id', 'prod-001')
    .or('id.eq.prod-002,id.eq.prod-003');

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Set featured products successfully');
  }
}

async function main() {
  await addFeaturedColumnAlternative();
  await checkProductsTable();
  await setSomeProductsAsFeatured();
}

main();