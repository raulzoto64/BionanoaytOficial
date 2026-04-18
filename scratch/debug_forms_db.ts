import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jzmdfoptxmqywihyhoty.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jIQS9Mg3gRqdIE8BJe4s4Q_3-iqvH15";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkForms() {
    console.log("🔍 Consultando tabla 'forms'...");
    const { data, error } = await supabase.from("forms").select("*");
    
    if (error) {
        console.error("❌ ERROR:", error.message);
        if (error.message.includes("does not exist")) {
            console.log("💡 La tabla 'forms' NO existe en el esquema público.");
        }
    } else {
        console.log("✅ ÉXITO. Filas encontradas:", data.length);
        console.log("Datos:", JSON.stringify(data, null, 2));
    }
}

checkForms();
