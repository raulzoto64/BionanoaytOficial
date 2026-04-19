<?php
/**
 * Herramienta de Diagnóstico BionanoAYT
 * Úsese para verificar la salud del servidor HostGator
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<html><head><title>Debug Backend</title><style>
    body { font-family: sans-serif; background: #1a1a1a; color: #eee; padding: 20px; }
    .card { background: #2a2a2a; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 5px solid #444; }
    .ok { border-left-color: #4caf50; }
    .error { border-left-color: #f44336; }
    h2 { margin-top: 0; color: #4fc3f7; }
    pre { background: #000; padding: 10px; overflow: auto; }
</style></head><body>";

echo "<h1>🩺 Escáner Médico del Servidor</h1>";

// 1. Verificar PHP
echo "<div class='card ok'><h2>PHP Info</h2>";
echo "Versión PHP: " . phpversion() . "<br>";
echo "Soporte JSON: " . (function_exists('json_decode') ? "✅ OK" : "❌ NO") . "<br>";
echo "PDO MySQL: " . (extension_loaded('pdo_mysql') ? "✅ OK" : "❌ NO") . "<br>";
echo "</div>";

// 2. Verificar Base de Datos
echo "<div class='card'>";
try {
    require_once 'db.php';
    if (isset($pdo)) {
        echo "<h2 style='color:#4caf50'>Conexión BD: ✅ EXITOSA</h2>";
        
        // Verificar tabla users
        $stmt = $pdo->query("SELECT COUNT(*) FROM users");
        $count = $stmt->fetchColumn();
        echo "Usuarios registrados: <strong>$count</strong><br>";
        
        // Verificar estructura
        $cols = $pdo->query("DESCRIBE users")->fetchAll(PDO::FETCH_ASSOC);
        echo "<h3>Columnas detectadas en 'users':</h3><ul>";
        foreach($cols as $col) {
            echo "<li>{$col['Field']} ({$col['Type']})</li>";
        }
        echo "</ul>";
        
    } else {
        echo "<h2 style='color:#f44336'>Conexión BD: ❌ FALLIDA (pdo no definido)</h2>";
    }
} catch (Exception $e) {
    echo "<h2 style='color:#f44336'>Conexión BD: ❌ ERROR</h2>";
    echo "<pre>" . $e->getMessage() . "</pre>";
}
echo "</div>";

// 3. Verificar Archivos Críticos
echo "<div class='card ok'><h2>Archivos en el servidor</h2>";
$files = ['.htaccess', 'index.php', 'db.php', 'api/auth.php', 'api/blog.php'];
foreach($files as $f) {
    echo "$f: " . (file_exists($f) ? "✅" : "❓ No encontrado") . "<br>";
}
echo "</div>";

// 4. Test de Entrada de Datos
echo "<div class='card ok'><h2>Prueba de Entrada (php://input)</h2>";
$input = file_get_contents('php://input');
echo "Tamaño del buffer de entrada: " . strlen($input) . " bytes<br>";
echo "Método de petición: " . $_SERVER['REQUEST_METHOD'] . "<br>";
echo "</div>";

echo "</body></html>";
