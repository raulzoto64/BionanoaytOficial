import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testPrices() {
  try {
    console.log("Probando consulta de precios...");
    
    // Obtener todos los precios
    const { data: prices, error: pricesError } = await supabase
      .from("prices_by_quantity")
      .select("*");
      
    if (pricesError) {
      console.error("Error al obtener precios:", pricesError);
    } else {
      console.log("Precios obtenidos:", prices);
      console.log(`Total de precios: ${prices.length}`);
      
      if (prices.length > 0) {
        console.log("\nDetalles de los precios:");
        prices.forEach(price => {
          console.log(`- Producto: ${price.product_id}, Embase: ${price.packaging}, Cantidad: ${price.min_quantity}-${price.max_quantity}, Precio: ${price.price_per_unit} ${price.currency}`);
        });
      }
    }
    
    // Obtener productos
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*");
      
    if (productsError) {
      console.error("Error al obtener productos:", productsError);
    } else {
      console.log("\nProductos existentes:");
      products.forEach(product => {
        console.log(`- ID: ${product.id}, Slug: ${product.slug}, Nombre: ${product.name}`);
      });
    }
    
  } catch (error) {
    console.error("Error general:", error);
  }
}

testPrices();