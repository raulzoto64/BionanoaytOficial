import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkProd002Prices() {
  try {
    console.log("Obteniendo todos los precios para prod-002...");
    
    const { data, error } = await supabase
      .from("prices_by_quantity")
      .select("*")
      .eq("product_id", "prod-002");

    if (error) {
      console.error("Error al obtener precios:", error);
      return;
    }

    console.log("\nPrecios encontrados para prod-002:");
    data.forEach((price) => {
      console.log(`- Embalse: ${price.packaging}`);
      console.log(`  Cantidad: ${price.min_quantity} - ${price.max_quantity || '∞'}`);
      console.log(`  Precio: ${price.price_per_unit} COP`);
      console.log(`  ID: ${price.id}`);
      console.log();
    });

  } catch (error) {
    console.error("Error general:", error);
  }
}

checkProd002Prices();