import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkPricesTable() {
  console.log("Verificando estructura de la tabla prices_by_quantity...");
  
  try {
    const { data, error } = await supabase
      .from("prices_by_quantity")
      .select("*")
      .limit(5);

    if (error) {
      console.error("Error al obtener precios:", error);
      return;
    }

    console.log("\nPrecios encontrados:");
    console.log(data);

    if (data.length > 0) {
      console.log("\nCampos en la tabla prices_by_quantity:");
      console.log(Object.keys(data[0]));
      
      // Verificar si existen las nuevas columnas
      const hasVolumeColumn = 'volume' in data[0];
      const hasUnitTypeColumn = 'unit_type' in data[0];
      
      console.log(`\nColumnas nuevas:
- volume: ${hasVolumeColumn ? '✅' : '❌'}`);
      console.log(`- unit_type: ${hasUnitTypeColumn ? '✅' : '❌'}`);
      
      if (!hasVolumeColumn || !hasUnitTypeColumn) {
        console.log("\n⚠️  Debe ejecutar el script SQL para agregar las columnas faltantes:");
        console.log(`\n${`--`.repeat(50)}
-- Ejecute este SQL en el editor SQL de Supabase:
-- ${`--`.repeat(50)}
ALTER TABLE public.prices_by_quantity
ADD COLUMN volume numeric NOT NULL DEFAULT 1;

ALTER TABLE public.prices_by_quantity
ADD COLUMN unit_type text NOT NULL DEFAULT 'L';

CREATE INDEX idx_prices_by_quantity_volume ON public.prices_by_quantity(volume);
CREATE INDEX idx_prices_by_quantity_unit_type ON public.prices_by_quantity(unit_type);

CREATE INDEX idx_prices_by_quantity_product_volume ON public.prices_by_quantity(product_id, volume, unit_type);
${`--`.repeat(50)}`);
      } else {
        console.log("\n✅ La tabla prices_by_quantity tiene todas las columnas necesarias");
      }
    } else {
      console.log("\n⚠️  La tabla prices_by_quantity está vacía");
    }
  } catch (error) {
    console.error("Error general:", error);
  }
}

checkPricesTable();