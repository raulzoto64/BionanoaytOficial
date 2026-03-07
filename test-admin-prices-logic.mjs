import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAdminPricesLogic() {
  try {
    console.log("=== Probando la lógica de AdminPrices.tsx ===");
    
    // Simular selección de producto (prod-001)
    console.log("\n1. Seleccionando producto prod-001...");
    const productId = "prod-001";
    
    // Obtener precios actuales
    console.log("\n2. Obtener precios actuales para prod-001...");
    const { data: currentPrices, error: getError } = await supabase
      .from("prices_by_quantity")
      .select("*")
      .eq("product_id", productId);
    
    if (getError) {
      console.error("❌ Error al obtener precios:", getError);
      return;
    }
    
    console.log(`✅ Precios encontrados: ${currentPrices.length}`);
    
    // Simular creación de nuevo precio
    console.log("\n3. Creando nuevo precio para prod-001...");
    const newPrice = {
      product_id: productId,
      packaging: "Cilindro",
      volume: 1,
      unit_type: "L",
      min_quantity: 1,
      max_quantity: 5,
      price_per_unit: 200000,
      currency: "COP"
    };
    
    const { data: createdPrice, error: createError } = await supabase
      .from("prices_by_quantity")
      .insert([newPrice])
      .select()
      .single();
    
    if (createError) {
      console.error("❌ Error al crear precio:", createError);
    } else {
      console.log("✅ Precio creado correctamente:", createdPrice);
    }
    
    // Simular actualización de precio
    console.log("\n4. Actualizando precio...");
    if (currentPrices.length > 0) {
      const priceToUpdate = currentPrices[0];
      const updatedPrice = {
        ...priceToUpdate,
        price_per_unit: priceToUpdate.price_per_unit + 1000
      };
      
      const { data: result, error: updateError } = await supabase
        .from("prices_by_quantity")
        .update(updatedPrice)
        .eq("id", priceToUpdate.id)
        .select()
        .single();
        
      if (updateError) {
        console.error("❌ Error al actualizar precio:", updateError);
      } else {
        console.log("✅ Precio actualizado correctamente:", result);
      }
    }
    
    console.log("\n=== Lógica de AdminPrices.tsx probada exitosamente ===");

  } catch (error) {
    console.error("❌ Error general:", error);
  }
}

testAdminPricesLogic();