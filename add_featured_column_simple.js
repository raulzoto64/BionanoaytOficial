import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://jzmdfoptxmqywihyhoty.supabase.co', 'sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15');

async function addFeaturedColumn() {
  try {
    // First, let's try to check if the column exists
    const { data: checkData, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('Error checking table:', checkError);
      return;
    }

    console.log('Table exists, trying to add column...');

    // Try to add the column using RPC or direct SQL
    // Since supabase doesn't provide a direct API for ALTER TABLE, we'll use a different approach
    
    // Instead of trying to modify the table structure directly, let's use the upsert method
    // to add the featured column to existing products
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return;
    }

    console.log('Fetched', products.length, 'products');

    // Update each product to add the featured field
    for (const product of products) {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          ...product,
          featured: false
        })
        .eq('id', product.id);

      if (updateError) {
        console.error('Error updating product', product.id, updateError);
      } else {
        console.log('Updated product', product.id, 'with featured: false');
      }
    }

    // Now check if the column was actually added
    const { data: checkData2, error: checkError2 } = await supabase
      .from('products')
      .select('id, featured')
      .limit(1);

    if (checkError2) {
      console.error('Error checking if column exists:', checkError2);
    } else if (checkData2 && checkData2.length > 0) {
      console.log('Success! Featured column exists in products table');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

async function setSomeProductsAsFeatured() {
  // Set first 3 products as featured
  const productsToUpdate = ['prod-001', 'prod-002', 'prod-003'];
  
  for (const productId of productsToUpdate) {
    const { error } = await supabase
      .from('products')
      .update({ featured: true })
      .eq('id', productId);

    if (error) {
      console.error('Error updating product', productId, error);
    } else {
      console.log('Updated product', productId, 'to featured');
    }
  }
}

async function checkTable() {
  const { data: tableData, error: tableError } = await supabase
    .from('products')
    .select('*');

  if (tableError) {
    console.error('Error checking table:', tableError);
  } else {
    console.log('Products table after changes:', tableData);
  }
}

async function main() {
  await addFeaturedColumn();
  await setSomeProductsAsFeatured();
  await checkTable();
}

main();