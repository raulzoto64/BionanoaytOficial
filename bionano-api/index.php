<?php
/**
 * ARCHIVO: index.php
 * Enrutador principal de la API con CORS reforzado
 */

// 1. Cabeceras CORS (Permitir todo desde cualquier origen para desarrollo)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// 2. Manejo de Preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. Cargar la Base de Datos
require_once 'db.php';

// 4. Enrutamiento Básico
$request_uri = $_SERVER['REQUEST_URI'];
$base_path = '/api/';

// Limpiar la URI para obtener la ruta relativa a /api/
$path = str_replace($base_path, '', parse_url($request_uri, PHP_URL_PATH));
$parts = explode('/', trim($path, '/'));

$resource = $parts[0] ?? '';

// 5. Cargar el controlador correspondiente
$controller = "api/{$resource}.php";

if (!empty($resource) && file_exists($controller)) {
    try {
        require_once $controller;
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            "error" => "Error interno",
            "message" => $e->getMessage()
        ]);
    }
} else {
    http_response_code(404);
    echo json_encode([
        "error" => "Ruta no encontrada",
        "path" => $path,
        "resource" => $resource
    ]);
}
