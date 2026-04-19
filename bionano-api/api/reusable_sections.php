<?php
$method = $_SERVER['REQUEST_METHOD'];
$id = $parts[1] ?? null;

// Initialize table if it doesn't exist (basic auto-migration for convenience)
$pdo->exec("
    CREATE TABLE IF NOT EXISTS reusable_sections (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        content JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
");

if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM reusable_sections WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if ($row) {
            $row['content'] = json_decode($row['content'], true);
            echo json_encode($row);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Not found"]);
        }
    } else {
        $stmt = $pdo->query("SELECT * FROM reusable_sections ORDER BY updated_at DESC");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as &$r) {
            $r['content'] = json_decode($r['content'], true);
        }
        echo json_encode($rows);
    }
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    // If it comes with ID, UPSERT, otherwise Generate UUID
    $sectionId = $data['id'] ?? null;
    if (!$sectionId) {
        $sectionId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
    
    $name = $data['name'] ?? 'Sección Sin Nombre';
    $type = $data['type'] ?? 'custom';
    $contentJson = json_encode($data['content'] ?? []);
    
    $stmt = $pdo->prepare("
        INSERT INTO reusable_sections (id, name, type, content)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), type = VALUES(type), content = VALUES(content), updated_at = CURRENT_TIMESTAMP
    ");
    $stmt->execute([$sectionId, $name, $type, $contentJson]);
    
    echo json_encode(["success" => true, "id" => $sectionId]);
    
} elseif ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare("DELETE FROM reusable_sections WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
}
