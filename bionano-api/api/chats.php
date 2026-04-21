<?php
/**
 * Controlador de Chats
 * Implementación del flujo correcto:
 * 1. /init -> crea/obtiene chat ANTES de cualquier mensaje
 * 2. 1 chat = 1 visitante (visitor_id UNIQUE)
 * 3. Todas las operaciones usan chat_id siempre
 */

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../db.php';

// ✅ LOG DE DEBUG para todos los requests
file_put_contents(__DIR__ . '/../chat_debug.log', 
    date('Y-m-d H:i:s') . " | " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI'] . PHP_EOL, 
    FILE_APPEND | LOCK_EX
);

// ✅ MANEJADOR DE ERRORES GLOBAL PARA ESTE CONTROLADOR
function chatErrorHandler($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => $errstr,
        "file" => $errfile,
        "line" => $errline
    ]);
    exit;
}

set_error_handler('chatErrorHandler');

function chatExceptionHandler($e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine(),
        "trace" => $e->getTraceAsString()
    ]);
    exit;
}

set_exception_handler('chatExceptionHandler');

$subResource = $parts[1] ?? '';

// ==============================================
// ✅ ENDPOINT: POST /chats/init
// ==============================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $subResource === 'init') {
    $data = json_decode(file_get_contents('php://input'), true);
    $visitor_id = trim($data['visitor_id'] ?? '');

    if (empty($visitor_id)) {
        http_response_code(400);
        echo json_encode(["error" => "visitor_id es requerido"]);
        exit;
    }

    // ✅ Buscar chat existente primero
    $stmt = $pdo->prepare("SELECT id, status, created_at FROM chats WHERE visitor_id = ? LIMIT 1");
    $stmt->execute([$visitor_id]);
    $chat = $stmt->fetch();

    if ($chat) {
        // ✅ Chat ya existe, devolver directamente
        echo json_encode([
            "id" => $chat['id'],
            "status" => $chat['status'],
            "created_at" => $chat['created_at'],
            "existing" => true
        ]);
        exit;
    }

    // ✅ Crear NUEVO chat
    $chatId = bin2hex(random_bytes(10));

    $stmt = $pdo->prepare("
        INSERT INTO chats (id, visitor_id, status, created_at, updated_at)
        VALUES (?, ?, 'open', NOW(), NOW())
    ");

    $stmt->execute([$chatId, $visitor_id]);

    echo json_encode([
        "id" => $chatId,
        "status" => "open",
        "existing" => false
    ]);
    exit;
}

// ==============================================
// GET /chats/:id
// ==============================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !empty($parts[1])) {
    $chatId = $parts[1];
    
    $stmt = $pdo->prepare("SELECT * FROM chats WHERE id = ? LIMIT 1");
    $stmt->execute([$chatId]);
    $chat = $stmt->fetch();
    
    if (!$chat) {
        http_response_code(404);
        echo json_encode(["error" => "Chat no encontrado"]);
        exit;
    }
    
    // Obtener mensajes
    $stmt = $pdo->prepare("SELECT * FROM chat_messages WHERE chat_id = ? ORDER BY created_at ASC");
    $stmt->execute([$chatId]);
    $messages = $stmt->fetchAll();
    
    echo json_encode([
        "chat" => $chat,
        "messages" => $messages
    ]);
    exit;
}

// ==============================================
// POST /chats/:id/messages
// ==============================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $parts[2] ?? '' === 'messages') {
    $chatId = $parts[1];
    $data = json_decode(file_get_contents('php://input'), true);
    
  // ✅ Convertir cualquier nombre a 'agent'
    $senderType = in_array($data['sender_type'], ['admin', 'agent', 'administrador']) ? 'agent' : 'visitor';
    
    try {
        // ✅ VERIFICAR COLUMNAS EXISTENTES ANTES
        $check = $pdo->query("DESCRIBE chat_messages");
        $columns = [];
        while($row = $check->fetch()) {
            $columns[] = $row['Field'];
        }
        
        file_put_contents(__DIR__ . '/../chat_debug.log', 
            date('Y-m-d H:i:s') . " | COLUMNAS chat_messages: " . json_encode($columns) . PHP_EOL, 
            FILE_APPEND | LOCK_EX
        );

        $stmt = $pdo->prepare("
            INSERT INTO chat_messages (chat_id, sender_type, sender_id, content, created_at)
            VALUES (?, ?, ?, ?, NOW())
        ");

        $stmt->execute([
            $chatId,
            $senderType,
            $data['sender_id'],
            $data['content']
        ]);
    } catch (Exception $e) {
        chatExceptionHandler($e);
    }
    
    $messageId = $pdo->lastInsertId();
    
    // Actualizar last_message en chat
    $stmt = $pdo->prepare("
        UPDATE chats 
        SET last_message = ?, updated_at = NOW() 
        WHERE id = ?
    ");
    $stmt->execute([substr($data['content'], 0, 100), $chatId]);
    
    echo json_encode([
        "id" => $messageId,
        "success" => true
    ]);
    exit;
}

// ==============================================
// PUT /chats/:id/typing
// ==============================================
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $parts[2] ?? '' === 'typing') {
    $chatId = $parts[1];
    $data = json_decode(file_get_contents('php://input'), true);
    
    // ✅ Aceptar tambien 'admin' aqui tambien
    $field = in_array($data['sender_type'], ['visitor', 'visitante'])
        ? 'is_visitor_typing' 
        : 'is_agent_typing';
    
    $stmt = $pdo->prepare("UPDATE chats SET {$field} = ? WHERE id = ?");
    $stmt->execute([$data['is_typing'] ? 1 : 0, $chatId]);
    
    echo json_encode(["success" => true]);
    exit;
}

// ==============================================
// PUT /chats/:id/read
// ==============================================
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $parts[2] ?? '' === 'read') {
    $chatId = $parts[1];
    $data = json_decode(file_get_contents('php://input'), true);
    
    // ✅ OPCIÓN 1: Aceptar todos los nombres posibles
    $field = in_array($data['actor'], ['visitor', 'user', 'visitante']) 
        ? 'unread_count_visitor' 
        : 'unread_count_agent';
    
    $stmt = $pdo->prepare("UPDATE chats SET {$field} = 0 WHERE id = ?");
    $stmt->execute([$chatId]);
    
    echo json_encode(["success" => true]);
    exit;
}

// ==============================================
// GET /chats (admin list)
// ==============================================
if ($_SERVER['REQUEST_METHOD'] === 'GET' && empty($parts[1])) {
    $stmt = $pdo->query("
        SELECT c.*, l.name as lead_name, l.email as lead_email 
        FROM chats c
        LEFT JOIN leads l ON c.visitor_id = l.guest_id
        ORDER BY c.updated_at DESC
    ");
    $chats = $stmt->fetchAll();
    
    echo json_encode($chats);
    exit;
}

http_response_code(404);
echo json_encode(["error" => "Ruta no encontrada"]);