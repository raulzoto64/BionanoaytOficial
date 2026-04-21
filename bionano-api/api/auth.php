<?php

// ✅ MANEJO GLOBAL DE ERRORES - NUNCA MAS RESPUESTA HTML
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Capturar TODOS los errores fatales, warnings, notices
function manejarErrorFatal() {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Error interno del servidor',
            'debug' => [
                'archivo' => $error['file'],
                'linea' => $error['line'],
                'error' => $error['message']
            ]
        ]);
        exit();
    }
}

// Capturar excepciones no capturadas
function manejarExcepcion($e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage(),
        'debug' => [
            'archivo' => $e->getFile(),
            'linea' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]
    ]);
    exit();
}

// ❌ ELIMINADO: estas funciones matan PHP cuando se carga el archivo via require_once desde index.php
// register_shutdown_function('manejarErrorFatal');
// set_exception_handler('manejarExcepcion');

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../EmailService.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$action = $_GET['action'] ?? '';
$emailService = new EmailService();

// ──────────────────────────────────────────────
// FUNCIÓN CENTRAL DE LOGGING
// ──────────────────────────────────────────────
function authLog(string $nivel, string $accion, array $datos = []): void {
    $logFile = __DIR__ . '/../auth_debug.log';
    $ts      = date('Y-m-d H:i:s');
    $extra   = empty($datos) ? '' : ' | ' . json_encode($datos, JSON_UNESCAPED_UNICODE);
    $linea   = "[$ts][$nivel][$accion]$extra\n";
    file_put_contents($logFile, $linea, FILE_APPEND | LOCK_EX);
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        switch ($action) {
            case 'register':
                $rawInput = file_get_contents('php://input');
                $data = json_decode($rawInput, true);

                authLog('INFO', 'REGISTER_INICIO', [
                    'ip'         => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
                    'raw_bytes'  => strlen($rawInput),
                    'json_ok'    => ($data !== null),
                    'fields_recv'=> array_keys($data ?? [])
                ]);
                
                $email = trim($data['email'] ?? '');
                $nombre = trim($data['nombre'] ?? '');
                $password = $data['password'] ?? '';

                authLog('INFO', 'REGISTER_DATOS', [
                    'email'         => $email,
                    'nombre'        => $nombre,
                    'password_len'  => strlen($password)
                ]);
                
                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    authLog('WARN', 'REGISTER_EMAIL_INVALIDO', ['email' => $email]);
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Correo electrónico inválido']);
                    exit();
                }
                
                if (strlen($password) < 6) {
                    authLog('WARN', 'REGISTER_PASSWORD_CORTA', ['len' => strlen($password)]);
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'La contraseña debe tener al menos 6 caracteres']);
                    exit();
                }
                
                // ── ¿Ya existe en users? ──
                authLog('INFO', 'REGISTER_CHECK_USERS_TABLE', ['email' => $email]);
                $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
                $stmt->execute([$email]);
                
                if ($stmt->rowCount() > 0) {
                    authLog('WARN', 'REGISTER_EMAIL_YA_EXISTE_EN_USERS', ['email' => $email]);
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Este correo ya está registrado']);
                    exit();
                }
                authLog('INFO', 'REGISTER_EMAIL_LIBRE', ['email' => $email]);
                
                $codigo = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
                $expiracion = date('Y-m-d H:i:s', strtotime('+15 minutes'));

                authLog('INFO', 'REGISTER_CODIGO_GENERADO', [
                    'email'      => $email,
                    'codigo'     => $codigo,
                    'expiracion' => $expiracion
                ]);
                
                // ── Insertar/actualizar en usuarios_pendientes ──
                authLog('INFO', 'REGISTER_INSERT_USUARIOS_PENDIENTES', ['email' => $email]);
                $stmt = $pdo->prepare("
                    INSERT INTO usuarios_pendientes (email, nombre, password, codigo_verificacion, expiracion_codigo, created_at)
                    VALUES (?, ?, ?, ?, ?, NOW())
                    ON DUPLICATE KEY UPDATE
                    nombre = VALUES(nombre),
                    password = VALUES(password),
                    codigo_verificacion = VALUES(codigo_verificacion),
                    expiracion_codigo = VALUES(expiracion_codigo),
                    created_at = NOW()
                ");
                
                if (!password_hash($password, PASSWORD_DEFAULT)) {
                    authLog('ERROR', 'REGISTER_PASSWORD_HASH_FAILED', ['email' => $email, 'password_len' => strlen($password)]);
                    http_response_code(500);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Error interno al procesar la contraseña',
                        'debug' => [
                            'email' => $email,
                            'password_len' => strlen($password),
                            'php_version' => PHP_VERSION,
                            'memory_usage' => memory_get_usage(),
                            'execution_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']
                        ]
                    ]);
                    exit();
                }

                $passwordHash = password_hash($password, PASSWORD_DEFAULT);
                $stmt->execute([$email, $nombre, $passwordHash, $codigo, $expiracion]);
                $rowsAffected = $stmt->rowCount();

                authLog('INFO', 'REGISTER_INSERT_RESULT', [
                    'email'         => $email,
                    'rows_affected' => $rowsAffected
                ]);
                
                // ── Mantener log legado también ──
                $logData = date('Y-m-d H:i:s') . " | REGISTRO | Email: $email | Codigo: $codigo | Generado correctamente\n";
                file_put_contents(__DIR__ . '/../email_logs.txt', $logData, FILE_APPEND | LOCK_EX);

                // ── Enviar correo de verificación ──
                authLog('INFO', 'REGISTER_ENVIANDO_EMAIL', ['email' => $email, 'nombre' => $nombre]);
                $resultadoEmail = $emailService->enviarCodigoVerificacion($email, $codigo, $nombre);

                authLog(
                    $resultadoEmail['status'] === 'success' ? 'INFO' : 'ERROR',
                    'REGISTER_EMAIL_RESULTADO',
                    [
                        'email'   => $email,
                        'status'  => $resultadoEmail['status'],
                        'message' => $resultadoEmail['message'] ?? null,
                        'smtp_error' => $resultadoEmail['smtp_error'] ?? null
                    ]
                );
                
                $logData = date('Y-m-d H:i:s') . " | ENVIO_EMAIL | Email: $email | Status: " . $resultadoEmail['status'];
                if (isset($resultadoEmail['message'])) {
                    $logData .= " | Error: " . $resultadoEmail['message'];
                }
                $logData .= "\n";
                file_put_contents(__DIR__ . '/../email_logs.txt', $logData, FILE_APPEND | LOCK_EX);
                
                if ($resultadoEmail['status'] === 'success') {
                    $respuesta = [
                        'status' => 'success',
                        'message' => 'Código de verificación enviado correctamente',
                        'redirect' => '/verificar-codigo?email=' . urlencode($email),
                        'debug' => [
                            'email_enviado' => $email,
                            'codigo_generado' => $codigo,
                            'expiracion' => $expiracion,
                            'php_version' => PHP_VERSION,
                            'memory_usage' => memory_get_usage(),
                            'execution_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']
                        ]
                    ];
                    
                    authLog('INFO', 'REGISTER_EXITO_COMPLETO', ['email' => $email, 'redirect' => $respuesta['redirect']]);
                    $logData = date('Y-m-d H:i:s') . " | RESPUESTA | " . json_encode($respuesta) . "\n";
                    file_put_contents(__DIR__ . '/../email_logs.txt', $logData, FILE_APPEND | LOCK_EX);
                    
                    echo json_encode($respuesta);
                } else {
                    authLog('ERROR', 'REGISTER_FALLO_EMAIL_RESPUESTA', [
                        'email'   => $email,
                        'error'   => $resultadoEmail['message'] ?? 'desconocido'
                    ]);
                    http_response_code(500);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Error al enviar el correo: ' . $resultadoEmail['message'],
                        'debug' => [
                            'email' => $email,
                            'smtp_error' => $resultadoEmail['smtp_error'] ?? null,
                            'php_version' => PHP_VERSION,
                            'memory_usage' => memory_get_usage(),
                            'execution_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']
                        ]
                    ]);
                }
                break;
                
            case 'verify-code':
                $data = json_decode(file_get_contents('php://input'), true);
                
                $email = trim($data['email'] ?? '');
                $codigo = trim($data['codigo'] ?? '');

                authLog('INFO', 'VERIFY_INICIO', [
                    'email'      => $email,
                    'codigo_len' => strlen($codigo)
                ]);
                
                if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($codigo) !== 6) {
                    authLog('WARN', 'VERIFY_DATOS_INVALIDOS', ['email' => $email, 'codigo_len' => strlen($codigo)]);
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Datos inválidos']);
                    exit();
                }
                
                authLog('INFO', 'VERIFY_BUSCANDO_EN_USUARIOS_PENDIENTES', ['email' => $email]);
                $stmt = $pdo->prepare("
                    SELECT id, nombre, password, codigo_verificacion, expiracion_codigo 
                    FROM usuarios_pendientes 
                    WHERE email = ? LIMIT 1
                ");
                $stmt->execute([$email]);
                $usuarioPendiente = $stmt->fetch();
                
                if (!$usuarioPendiente) {
                    authLog('WARN', 'VERIFY_NO_PENDIENTE_ENCONTRADO', ['email' => $email]);
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'No hay solicitud de registro para este correo']);
                    exit();
                }

                authLog('INFO', 'VERIFY_PENDIENTE_ENCONTRADO', [
                    'email'      => $email,
                    'nombre'     => $usuarioPendiente['nombre'],
                    'expiracion' => $usuarioPendiente['expiracion_codigo']
                ]);
                
                if (new DateTime() > new DateTime($usuarioPendiente['expiracion_codigo'])) {
                    authLog('WARN', 'VERIFY_CODIGO_EXPIRADO', [
                        'email'      => $email,
                        'expiracion' => $usuarioPendiente['expiracion_codigo'],
                        'ahora'      => date('Y-m-d H:i:s')
                    ]);
                    http_response_code(410);
                    echo json_encode(['status' => 'error', 'message' => 'El código ha expirado, por favor solicita uno nuevo']);
                    exit();
                }
                
                if ($codigo !== $usuarioPendiente['codigo_verificacion']) {
                    authLog('WARN', 'VERIFY_CODIGO_INCORRECTO', [
                        'email'           => $email,
                        'codigo_recibido' => $codigo
                    ]);
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Código incorrecto']);
                    exit();
                }

                authLog('INFO', 'VERIFY_CODIGO_CORRECTO_INICIANDO_TX', ['email' => $email]);
                $pdo->beginTransaction();
                
                try {
                    // ── Insertar en users ──
                    authLog('INFO', 'VERIFY_INSERT_USERS', ['email' => $email]);
                    $stmt = $pdo->prepare("
                        INSERT INTO users (email, name, password, email_verified, created_at)
                        VALUES (?, ?, ?, 1, NOW())
                    ");
                    $stmt->execute([
                        $email,
                        $usuarioPendiente['nombre'],
                        $usuarioPendiente['password']
                    ]);
                    
                    $usuarioId = $pdo->lastInsertId();
                    authLog('INFO', 'VERIFY_INSERT_USERS_OK', ['email' => $email, 'nuevo_id' => $usuarioId]);

                    // ── Borrar de usuarios_pendientes ──
                    authLog('INFO', 'VERIFY_DELETE_PENDIENTE', ['email' => $email]);
                    $stmt = $pdo->prepare("DELETE FROM usuarios_pendientes WHERE email = ?");
                    $stmt->execute([$email]);
                    $deletedRows = $stmt->rowCount();
                    authLog('INFO', 'VERIFY_DELETE_PENDIENTE_OK', ['email' => $email, 'rows_deleted' => $deletedRows]);
                    
                    $pdo->commit();
                    authLog('INFO', 'VERIFY_COMMIT_OK', ['email' => $email, 'usuario_id' => $usuarioId]);
                    
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Cuenta verificada correctamente',
                        'usuario_id' => $usuarioId,
                        'redirect' => '/dashboard',
                        'debug' => [
                            'email' => $email,
                            'usuario_id' => $usuarioId,
                            'php_version' => PHP_VERSION,
                            'memory_usage' => memory_get_usage(),
                            'execution_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']
                        ]
                    ]);
                    
                } catch (Exception $e) {
                    $pdo->rollBack();
                    authLog('ERROR', 'VERIFY_EXCEPCION_ROLLBACK', [
                        'email'   => $email,
                        'error'   => $e->getMessage(),
                        'archivo' => $e->getFile(),
                        'linea'   => $e->getLine()
                    ]);
                    http_response_code(500);
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'Error al crear la cuenta: ' . $e->getMessage(),
                        'debug' => [
                            'email' => $email,
                            'error' => $e->getMessage(),
                            'archivo' => $e->getFile(),
                            'linea' => $e->getLine(),
                            'trace' => $e->getTraceAsString(),
                            'php_version' => PHP_VERSION,
                            'memory_usage' => memory_get_usage(),
                            'execution_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']
                        ]
                    ]);
                }
                break;
                
            case 'resend-code':
                $data = json_decode(file_get_contents('php://input'), true);
                $email = trim($data['email'] ?? '');

                authLog('INFO', 'RESEND_INICIO', ['email' => $email]);
                
                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    authLog('WARN', 'RESEND_EMAIL_INVALIDO', ['email' => $email]);
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Correo inválido']);
                    exit();
                }
                
                $stmt = $pdo->prepare("SELECT nombre FROM usuarios_pendientes WHERE email = ? LIMIT 1");
                $stmt->execute([$email]);
                $usuario = $stmt->fetch();
                
                if (!$usuario) {
                    authLog('WARN', 'RESEND_NO_PENDIENTE', ['email' => $email]);
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'No hay registro pendiente para este correo']);
                    exit();
                }
                
                $nuevoCodigo = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
                $nuevaExpiracion = date('Y-m-d H:i:s', strtotime('+15 minutes'));

                authLog('INFO', 'RESEND_NUEVO_CODIGO', [
                    'email'      => $email,
                    'codigo'     => $nuevoCodigo,
                    'expiracion' => $nuevaExpiracion
                ]);
                
                $stmt = $pdo->prepare("
                    UPDATE usuarios_pendientes 
                    SET codigo_verificacion = ?, expiracion_codigo = ?
                    WHERE email = ?
                ");
                $stmt->execute([$nuevoCodigo, $nuevaExpiracion, $email]);
                authLog('INFO', 'RESEND_UPDATE_OK', ['email' => $email, 'rows' => $stmt->rowCount()]);
                
                authLog('INFO', 'RESEND_ENVIANDO_EMAIL', ['email' => $email]);
                $resultado = $emailService->enviarCodigoVerificacion($email, $nuevoCodigo, $usuario['nombre']);

                authLog(
                    $resultado['status'] === 'success' ? 'INFO' : 'ERROR',
                    'RESEND_EMAIL_RESULTADO',
                    [
                        'email'      => $email,
                        'status'     => $resultado['status'],
                        'message'    => $resultado['message'] ?? null,
                        'smtp_error' => $resultado['smtp_error'] ?? null
                    ]
                );
                
                if ($resultado['status'] === 'success') {
                    echo json_encode([
                        'status' => 'success',
                        'message' => 'Nuevo código enviado correctamente',
                        'debug' => [
                            'email' => $email,
                            'nuevo_codigo' => $nuevoCodigo,
                            'php_version' => PHP_VERSION,
                            'memory_usage' => memory_get_usage(),
                            'execution_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']
                        ]
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode([
                        'status' => 'error',
                        'message' => $resultado['message'] ?? 'Error desconocido',
                        'debug' => [
                            'email' => $email,
                            'smtp_error' => $resultado['smtp_error'] ?? null,
                            'php_version' => PHP_VERSION,
                            'memory_usage' => memory_get_usage(),
                            'execution_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']
                        ]
                    ]);
                }
                break;
        }
        break;
}
?>