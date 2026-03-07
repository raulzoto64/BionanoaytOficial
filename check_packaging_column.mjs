import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkPackagingColumn() {
  console.log("Verificando columna packaging en la tabla prices_by_quantity...");
  
  try {
    const { data, error } = await supabase
      .from("prices_by_quantity")
      .select("*")
      .limit(5);

    if (error) {
      console.error("Error al obtener precios:", error);
      return;
    }

    if (data.length > 0) {
      const hasPackagingColumn = 'packaging' in data[0];
      
      console.log(`\nColumna packaging: ${hasPackagingColumn ? '✅' : '❌'}`);
      
      if (!hasPackagingColumn) {
        console.log("\n⚠️  Debe ejecutar el script SQL para agregar la columna packaging:");
        console.log(`\n${`--`.repeat(50)}
-- Ejecute este SQL en el editor SQL de Supabase:
-- ${`--`.repeat(50)}
ALTER TABLE public.prices_by_quantity
ADD COLUMN packaging text NOT NULL DEFAULT 'Botella pequeña';

CREATE INDEX idx_prices_by_quantity_packaging ON public.prices_by_quantity(packaging);

CREATE INDEX idx_prices_by_quantity_product_packaging ON public.prices_by_quantity(product_id, packaging);
${`--`.repeat(50)}`);
      } else {
        console.log("\n✅ La columna packaging existe en la tabla prices_by_quantity");
        console.log("\nPrecios encontrados:");
        console.log(data);
      }
    } else {
      console.log("\n⚠️  La tabla prices_by_quantity está vacía");
    }
  } catch (error) {
    console.error("Error general:", error);
  }
}

checkPackagingColumn();