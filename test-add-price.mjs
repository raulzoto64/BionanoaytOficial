import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAddPrice() {
  try {
    console.log("Prueba 1: Agregar precio para prod-002, Botella mediana, 1-5 unidades...");
    
    const { data, error } = await supabase
      .from("prices_by_quantity")
      .insert([
        {
          product_id: "prod-002",
          packaging: "Botella mediana",
          volume: 1,
          unit_type: "L",
          min_quantity: 1,
          max_quantity: 5,
          price_per_unit: 65000,
          currency: "COP"
        }
      ])
      .select();

    if (error) {
      console.error("❌ Error al agregar precio:", error);
    } else {
      console.log("✅ Precio agregado correctamente:", data[0]);
    }

    console.log("\nPrueba 2: Agregar precio para prod-002, Galón, 1-10 unidades...");
    
    const { data: data2, error: error2 } = await supabase
      .from("prices_by_quantity")
      .insert([
        {
          product_id: "prod-002",
          packaging: "Galón",
          volume: 1,
          unit_type: "L",
          min_quantity: 1,
          max_quantity: 10,
          price_per_unit: 150000,
          currency: "COP"
        }
      ])
      .select();

    if (error2) {
      console.error("❌ Error al agregar precio:", error2);
    } else {
      console.log("✅ Precio agregado correctamente:", data2[0]);
    }

  } catch (error) {
    console.error("Error general:", error);
  }
}

testAddPrice();