import { supabaseAPI } from './src/app/data/supabase.ts';

async function testGetPrices() {
  try {
    console.log("Prueba de consulta de precios por producto (prod-001)...");
    
    // Intentar obtener precios para prod-001
    const prices = await supabaseAPI.getPricesByProduct("prod-001");
    console.log("Precios para prod-001:", prices);
    
    if (prices.length > 0) {
      console.log(`Se encontraron ${prices.length} precios`);
    } else {
      console.log("No se encontraron precios");
    }
    
    // Intentar obtener embases disponibles para prod-001
    const packagings = await supabaseAPI.getAvailablePackagings("prod-001");
    console.log("Embases disponibles:", packagings);
    
  } catch (error) {
    console.error("Error en la prueba:", error);
  }
}

testGetPrices();