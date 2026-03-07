import { supabaseAPI } from './src/app/data/supabase.ts';

async function testProductDetail() {
  try {
    const testSlugs = ["bionanoaxus-bnx", "z-klean-limpiador", "nanofert-plus"];
    
    for (const slug of testSlugs) {
      console.log(`\nProbando slug: ${slug}`);
      
      // Obtener producto por slug
      const productData = await supabaseAPI.getProductBySlug(slug);
      console.log("Producto obtenido:", productData);
      
      if (productData) {
        // Obtener precios
        const pricesData = await supabaseAPI.getPricesByProduct(productData.id);
        console.log(`Precios encontrados: ${pricesData.length}`);
        
        // Obtener embases
        const packagingsData = await supabaseAPI.getAvailablePackagings(productData.id);
        console.log(`Embases disponibles: ${packagingsData.length}`, packagingsData);
        
        // Si hay precios, probar cálculo
        if (packagingsData.length > 0) {
          const packaging = packagingsData[0];
          const price = await supabaseAPI.calculatePrice(productData.id, 1, packaging);
          console.log(`Precio calculado para 1 unidad de ${packaging}:`, price);
        }
      }
    }
  } catch (error) {
    console.error("Error en la prueba:", error);
  }
}

testProductDetail();