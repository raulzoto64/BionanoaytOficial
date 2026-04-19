<?php
$method  = $_SERVER['REQUEST_METHOD'];
$idOrSlug = $parts[1] ?? null;

// ============================================================
// GET: Listar páginas legales o una por ID/slug
// ============================================================
if ($method === 'GET') {
    if ($idOrSlug) {
        // Intentar primero por id, luego por slug
        $stmt = $pdo->prepare("SELECT * FROM legal_pages WHERE (id = ? OR slug = ?) AND is_active = 1");
        $stmt->execute([$idOrSlug, $idOrSlug]);
        $row = $stmt->fetch();
        echo json_encode($row ?: (object)[]);
    } else {
        $stmt = $pdo->query("SELECT id, slug, title_es, title_en FROM legal_pages WHERE is_active = 1 ORDER BY id ASC");
        echo json_encode($stmt->fetchAll() ?: []);
    }
    exit;
}

// ============================================================
// POST: Crear nueva página legal
// ============================================================
if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    $id         = $body['id']         ?? uniqid('legal-');
    $slug       = $body['slug']       ?? $id;
    $title_es   = $body['title_es']   ?? '';
    $title_en   = $body['title_en']   ?? '';
    $content_es = $body['content_es'] ?? null;
    $content_en = $body['content_en'] ?? null;
    $is_active  = $body['is_active']  ?? 1;

    $stmt = $pdo->prepare("
        INSERT INTO legal_pages (id, slug, title_es, title_en, content_es, content_en, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            title_es   = VALUES(title_es),
            title_en   = VALUES(title_en),
            content_es = VALUES(content_es),
            content_en = VALUES(content_en),
            is_active  = VALUES(is_active)
    ");
    $stmt->execute([$id, $slug, $title_es, $title_en, $content_es, $content_en, $is_active]);

    http_response_code(201);
    echo json_encode(['success' => true, 'id' => $id]);
    exit;
}

// ============================================================
// PUT: Actualizar página legal existente (contenido, títulos)
// ============================================================
if ($method === 'PUT' && $idOrSlug) {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    $fields = [];
    $params = [];
    $allowed = ['title_es', 'title_en', 'content_es', 'content_en', 'slug', 'is_active'];
    foreach ($allowed as $field) {
        if (array_key_exists($field, $body)) {
            $fields[] = "`$field` = ?";
            $params[] = $body[$field];
        }
    }

    if (!empty($fields)) {
        $params[] = $idOrSlug;
        $params[] = $idOrSlug;
        $sql = "UPDATE legal_pages SET " . implode(', ', $fields) . " WHERE id = ? OR slug = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
    }

    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}

// ============================================================
// DELETE: Desactivar página legal (soft delete)
// ============================================================
if ($method === 'DELETE' && $idOrSlug) {
    $stmt = $pdo->prepare("UPDATE legal_pages SET is_active = 0 WHERE id = ? OR slug = ?");
    $stmt->execute([$idOrSlug, $idOrSlug]);
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}
