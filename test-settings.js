// Script de prueba para la función updateSiteSettings
import { supabaseAPI } from './src/app/data/supabase.js';

async function testUpdateSettings() {
    console.log('Prueba de updateSiteSettings');
    try {
        // Obtener la configuración actual
        const currentSettings = await supabaseAPI.getSiteSettings();
        console.log('Configuración actual:', currentSettings);
        
        // Modificar algunos campos
        const updatedSettings = {
            ...currentSettings,
            site_name: 'BionanoAyt Test',
            site_email: 'test@bionanoayt.com',
            site_phone: '+51 987 654 321',
            site_address: 'Calle Test 123, Lima, Perú'
        };
        
        // Guardar la configuración
        const result = await supabaseAPI.updateSiteSettings(updatedSettings);
        console.log('Configuración actualizada:', result);
        
        // Verificar que los cambios se guardaron
        const checkSettings = await supabaseAPI.getSiteSettings();
        console.log('Verificación de cambios:', checkSettings);
        
        console.log('✅ Prueba completada exitosamente');
    } catch (error) {
        console.error('❌ Error en la prueba:', error);
    }
}

testUpdateSettings();