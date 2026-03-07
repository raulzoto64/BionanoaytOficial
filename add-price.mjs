import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function addPrice() {
  try {
    console.log("Agregando precio para prod-002, Botella pequeña, 1-10 unidades...");
    
    const { data, error } = await supabase
      .from("prices_by_quantity")
      .insert([
        {
          product_id: "prod-002",
          packaging: "Botella pequeña",
          volume: 1,
          unit_type: "L",
          min_quantity: 1,
          max_quantity: 10,
          price_per_unit: 35000,
          currency: "COP"
        }
      ])
      .select();

    if (error) {
      console.error("Error al agregar precio:", error);
    } else {
      console.log("Precio agregado correctamente:", data[0]);
    }

  } catch (error) {
    console.error("Error general:", error);
  }
}

addPrice();