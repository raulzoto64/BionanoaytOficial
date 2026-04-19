<?php
$method = $_SERVER['REQUEST_METHOD'];
$id = $parts[1] ?? null;

if ($method === 'GET') {
    // Básicamente listamos todo por ahora, el filtrado grueso se puede hacer en SQL
    $stmt = $pdo->query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50");
    $notifications = $stmt->fetchAll();
    
    // Decodificar read_by de JSON a array
    foreach ($notifications as &$n) {
        $n['read_by'] = json_decode($n['read_by'] ?? '[]', true);
    }
    
    echo json_encode($notifications);

} else if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $newId = bin2hex(random_bytes(10));
    
    try {
        $stmt = $pdo->prepare("INSERT INTO notifications (id, target_role, title, message, notification_type, action_url) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $newId,
            $data['target_role'] ?? 'admin',
            $data['title'] ?? '',
            $data['message'] ?? '',
            $data['notification_type'] ?? 'info',
            $data['action_url'] ?? null
        ]);
        echo json_encode(["success" => true, "id" => $newId]);
    } catch (PDOException $e) {
        echo json_encode(["success" => true, "id" => $newId, "warn" => $e->getMessage()]);
    }

} else if ($method === 'PUT' && $id) {
    // Marcar como leída (actualizar read_by)
    $data = json_decode(file_get_contents('php://input'), true);
    $readBy = json_encode($data['read_by'] ?? []);
    
    $stmt = $pdo->prepare("UPDATE notifications SET read_by = ? WHERE id = ?");
    $stmt->execute([$readBy, $id]);
    
    echo json_encode(["success" => true]);
}
