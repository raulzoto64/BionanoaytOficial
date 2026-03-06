const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    console.log("Probando conexión a Supabase...");
    
    // Testear productos
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*");
      
    if (productsError) {
      console.error("Error al obtener productos:", productsError);
    } else {
      console.log("Productos obtenidos:", products);
    }
    
    // Testear traducciones de productos
    const { data: productTranslations, error: translationsError } = await supabase
      .from("product_translations")
      .select("*");
      
    if (translationsError) {
      console.error("Error al obtener traducciones de productos:", translationsError);
    } else {
      console.log("Traducciones de productos:", productTranslations);
    }
    
    // Testear categorías
    const { data: categories, error: categoriesError } = await supabase
      .from("categories")
      .select("*");
      
    if (categoriesError) {
      console.error("Error al obtener categorías:", categoriesError);
    } else {
      console.log("Categorías:", categories);
    }
    
  } catch (error) {
    console.error("Error general:", error);
  }
}

testConnection();