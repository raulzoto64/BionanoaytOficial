import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function updateUniqueConstraint() {
  console.log("Actualizando restricción única en la tabla prices_by_quantity...");
  
  try {
    // Ejecutar el script SQL
    const { data, error } = await supabase.rpc('run_sql', {
      sql: `
        -- First, drop the existing unique constraint
        ALTER TABLE public.prices_by_quantity
        DROP CONSTRAINT prices_by_quantity_product_id_min_quantity_max_quantity_key;

        -- Then, create a new unique constraint that includes packaging
        ALTER TABLE public.prices_by_quantity
        ADD CONSTRAINT prices_by_quantity_product_id_packaging_min_quantity_max_quantity_key
        UNIQUE (product_id, packaging, min_quantity, max_quantity);
      `
    });

    if (error) {
      console.error("Error al ejecutar la migración:", error);
    } else {
      console.log("✅ Restricción única actualizada correctamente!");
      console.log("La nueva restricción incluye el campo packaging, lo que permite:");
      console.log("- Precios con la misma cantidad para diferentes embases");
      console.log("- Evita duplicados para la misma combinación de product_id, packaging, min_quantity y max_quantity");
    }

  } catch (error) {
    console.error("Error general:", error);
  }
}

updateUniqueConstraint();