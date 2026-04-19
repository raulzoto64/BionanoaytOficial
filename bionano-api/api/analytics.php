<?php
$method = $_SERVER['REQUEST_METHOD'];
$sub = $parts[1] ?? '';

if ($method === 'POST' && $sub === 'track') {
    // La tabla correcta es site_analytics (no analytics_events)
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("
        INSERT INTO site_analytics (visitor_id, user_id, event_type, page_url, metadata)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['session_id'] ?? null,
        $data['user_id'] ?? null,
        $data['event_name'] ?? $data['event_type'] ?? 'page_view',
        $data['page_url'] ?? null,
        json_encode($data['event_data'] ?? $data['metadata'] ?? [])
    ]);
    echo json_encode(["success" => true]);

} else if ($method === 'GET' && $sub === 'carts') {
    $stmt = $pdo->query("
        SELECT 
            COALESCE(user_id, guest_id) as identifier,
            COUNT(*) as items_count,
            MAX(updated_at) as last_activity
        FROM cart_items
        GROUP BY identifier
        ORDER BY last_activity DESC
    ");
    echo json_encode($stmt->fetchAll() ?: []);

} else if ($method === 'GET' && $sub === 'summary') {
    // Resumen general para el dashboard admin
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM site_analytics WHERE DATE(created_at) = CURDATE()");
    $today = $stmt->fetch();
    echo json_encode(["today_events" => $today['total']]);

} else {
    echo json_encode(["success" => true]);
}
