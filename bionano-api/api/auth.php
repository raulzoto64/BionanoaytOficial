<?php

// ================= CONFIG GLOBAL =================
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// ================= MANEJO GLOBAL DE ERRORES =================
set_exception_handler(function($e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Excepción no controlada',
        'debug' => [
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ]);
    exit;
});

register_shutdown_function(function() {
    $error = error_get_last();
    if ($error) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Error fatal',
            'debug' => $error
        ]);
        exit;
    }
});

// ================= CORS PRE-FLIGHT =================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ================= DEPENDENCIAS =================
require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../api/EmailService.php';

// ================= CONFIG =================
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$action = basename($uri);
$emailService = new EmailService();

// ================= LOGGER =================
function logDebug($msg, $data = []) {
    file_put_contents(
        __DIR__ . '/../debug.log',
        date('Y-m-d H:i:s') . " | $msg | " . json_encode($data) . "\n",
        FILE_APPEND
    );
}

// ================= HELPERS =================
function getJSON() {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if ($data === null) {
        throw new Exception("JSON inválido");
    }

    return $data;
}

// ================= ROUTER =================
try {

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido");
    }

    switch ($action) {

        // =====================================================
        // REGISTRO
        // =====================================================
        case 'register':

            $data = getJSON();

            $email = trim($data['email'] ?? '');
            $nombre = trim($data['nombre'] ?? '');
            $password = $data['password'] ?? '';

            logDebug("REGISTER_INICIO", compact('email', 'nombre'));

            // Validaciones
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception("Email inválido");
            }

            if (strlen($password) < 6) {
                throw new Exception("La contraseña debe tener al menos 6 caracteres");
            }

            // Verificar si existe
            $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);

            if ($stmt->fetch()) {
                throw new Exception("El correo ya está registrado");
            }

            // Generar código
            $codigo = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $expiracion = date('Y-m-d H:i:s', strtotime('+15 minutes'));

            $passwordHash = password_hash($password, PASSWORD_DEFAULT);

            if (!$passwordHash) {
                throw new Exception("Error al encriptar contraseña");
            }

            // Insertar pendiente
            $stmt = $pdo->prepare("
                INSERT INTO usuarios_pendientes 
                (email, nombre, password, codigo_verificacion, expiracion_codigo, created_at)
                VALUES (?, ?, ?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE
                    nombre = VALUES(nombre),
                    password = VALUES(password),
                    codigo_verificacion = VALUES(codigo_verificacion),
                    expiracion_codigo = VALUES(expiracion_codigo)
            ");

            $stmt->execute([$email, $nombre, $passwordHash, $codigo, $expiracion]);

            logDebug("REGISTER_DB_OK", ['email' => $email]);

            // Enviar email
            $emailResult = $emailService->enviarCodigoVerificacion($email, $codigo, $nombre);

            if ($emailResult['status'] !== 'success') {
                throw new Exception("Error enviando correo: " . $emailResult['message']);
            }

            echo json_encode([
                'status' => 'success',
                'message' => 'Código enviado correctamente',
                'redirect' => '/verificar-codigo?email=' . urlencode($email)
            ]);

            break;

        // =====================================================
        // VERIFICAR CODIGO
        // =====================================================
        case 'verify-code':

            $data = getJSON();

            $email = $data['email'] ?? '';
            $codigo = $data['codigo'] ?? '';

            $stmt = $pdo->prepare("SELECT * FROM usuarios_pendientes WHERE email = ?");
            $stmt->execute([$email]);

            $user = $stmt->fetch();

            if (!$user) {
                throw new Exception("No existe registro pendiente");
            }

            if ($codigo !== $user['codigo_verificacion']) {
                throw new Exception("Código incorrecto");
            }

            if (new DateTime() > new DateTime($user['expiracion_codigo'])) {
                throw new Exception("Código expirado");
            }

            $pdo->beginTransaction();

            $stmt = $pdo->prepare("
                INSERT INTO users (email, name, password, email_verified, created_at)
                VALUES (?, ?, ?, 1, NOW())
            ");
            $stmt->execute([$email, $user['nombre'], $user['password']]);

            $stmt = $pdo->prepare("DELETE FROM usuarios_pendientes WHERE email = ?");
            $stmt->execute([$email]);

            $pdo->commit();

            // obtener usuario recién creado
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$userFinal = $stmt->fetch();

// 🔐 generar token simple (puedes mejorar luego con JWT)
$token = bin2hex(random_bytes(32));

echo json_encode([
    'status' => 'success',
    'message' => 'Cuenta verificada',
    'token' => $token,
    'user' => [
        'id' => $userFinal['id'],
        'email' => $userFinal['email'],
        'name' => $userFinal['name'],
        'role' => $userFinal['role'] ?? 'user'
    ],
    'redirect' => '/'
]);

            break;

        // =====================================================
        // REENVIAR CODIGO
        // =====================================================
        case 'resend-code':

            $data = getJSON();
            $email = $data['email'] ?? '';

            $stmt = $pdo->prepare("SELECT nombre FROM usuarios_pendientes WHERE email = ?");
            $stmt->execute([$email]);

            $user = $stmt->fetch();

            if (!$user) {
                throw new Exception("No existe registro pendiente");
            }

            $codigo = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $expiracion = date('Y-m-d H:i:s', strtotime('+15 minutes'));

            $stmt = $pdo->prepare("
                UPDATE usuarios_pendientes 
                SET codigo_verificacion = ?, expiracion_codigo = ?
                WHERE email = ?
            ");
            $stmt->execute([$codigo, $expiracion, $email]);

            $emailResult = $emailService->enviarCodigoVerificacion($email, $codigo, $user['nombre']);

            if ($emailResult['status'] !== 'success') {
                throw new Exception("Error enviando correo");
            }

            echo json_encode([
                'status' => 'success',
                'message' => 'Código reenviado'
            ]);

            break;

        // =====================================================
        // LOGIN
        // =====================================================
        case 'login':

            $data = getJSON();
            $email = trim($data['email'] ?? '');
            $password = $data['password'] ?? '';

            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if (!$user) {
                throw new Exception("Email o contraseña incorrectos");
            }

            if (!password_verify($password, $user['password'])) {
                throw new Exception("Email o contraseña incorrectos");
            }

            // Generar token
            $token = bin2hex(random_bytes(32));

            echo json_encode([
                'status' => 'success',
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'name' => $user['name'],
                    'role' => $user['role'] ?? 'user'
                ]
            ]);

            break;

        default:
            throw new Exception("Acción no válida");
    }

} catch (Exception $e) {

    logDebug("ERROR", ['msg' => $e->getMessage()]);

    // ✅ SOLO 500 PARA ERRORES DEL SERVIDOR, PARA EL RESTO 400 BAD REQUEST
    $statusCode = 400;

    // Si es error verdadero del sistema devolvemos 500
    if (str_contains($e->getMessage(), 'SQLSTATE') 
        || str_contains($e->getMessage(), 'Error fatal') 
        || str_contains($e->getMessage(), 'Excepción no controlada')) {
        $statusCode = 500;
    }

    http_response_code($statusCode);

    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
