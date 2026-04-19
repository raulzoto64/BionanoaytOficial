<?php
$method = $_SERVER['REQUEST_METHOD'];
$id = $parts[1] ?? null;

if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM forms WHERE id = ? OR slug = ?");
        $stmt->execute([$id, $id]);
        $row = $stmt->fetch();
        if ($row) {
            $row['fields'] = json_decode($row['fields'] ?? '[]', true) ?: [];
        }
        echo json_encode($row ?: (object)[]);
    } else {
        $stmt = $pdo->query("SELECT * FROM forms ORDER BY created_at DESC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$item) {
            $item['fields'] = json_decode($item['fields'] ?? '[]', true) ?: [];
        }
        echo json_encode($rows);
    }
} else if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = bin2hex(random_bytes(10));
    $fields = json_encode($data['fields'] ?? []);
    
    $stmt = $pdo->prepare("INSERT INTO forms (id, name, slug, title_es, title_en, subtitle_es, subtitle_en, image_url, fields, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $id, $data['name'], $data['slug'] ?? $id, $data['title_es'] ?? '', $data['title_en'] ?? '',
        $data['subtitle_es'] ?? '', $data['subtitle_en'] ?? '', $data['image_url'] ?? '',
        $fields, $data['is_active'] ? 1 : 0
    ]);
    echo json_encode(["success" => true, "id" => $id]);

} else if ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $fields = json_encode($data['fields'] ?? []);
    
    $stmt = $pdo->prepare("UPDATE forms SET name=?, title_es=?, title_en=?, subtitle_es=?, subtitle_en=?, image_url=?, fields=?, is_active=? WHERE id=?");
    $stmt->execute([
        $data['name'], $data['title_es'], $data['title_en'],
        $data['subtitle_es'], $data['subtitle_en'], $data['image_url'],
        $fields, $data['is_active'] ? 1 : 0, $id
    ]);
    echo json_encode(["success" => true]);

} else if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare("DELETE FROM forms WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
}
