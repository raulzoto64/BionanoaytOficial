import fs from 'fs';
const path = 'sql/seed.sql';
let content = fs.readFileSync(path, 'utf8');

// Eliminar el bloque de PREPARACION con los ALTER TABLE conflictivos
const startMarker = "-- 0. PREPARACION";
const endMarker = "-- 1. SITE SETTINGS";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex > startIndex) {
    const newContent = content.substring(0, startIndex) + content.substring(endIndex);
    fs.writeFileSync(path, newContent, 'utf8');
    console.log("Seed.sql limpiado de sentencias ALTER TABLE para compatibilidad.");
} else {
    console.error("No se encontró el bloque de preparación para limpiar.");
}
