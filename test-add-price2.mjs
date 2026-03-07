import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAddPrice2() {
  try {
    console.log("Prueba: Agregar precio para prod-002, Galón, 11-20 unidades...");
    
    const { data, error } = await supabase
      .from("prices_by_quantity")
      .insert([
        {
          product_id: "prod-002",
          packaging: "Galón",
          volume: 1,
          unit_type: "L",
          min_quantity: 11,
          max_quantity: 20,
          price_per_unit: 140000,
          currency: "COP"
        }
      ])
      .select();

    if (error) {
      console.error("❌ Error al agregar precio:", error);
    } else {
      console.log("✅ Precio agregado correctamente:", data[0]);
    }

  } catch (error) {
    console.error("Error general:", error);
  }
}

testAddPrice2();