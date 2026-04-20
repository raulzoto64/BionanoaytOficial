<?php
$method = $_SERVER['REQUEST_METHOD'];
$slugOrId = $parts[1] ?? '';
$lang = $parts[3] ?? 'es';

if ($method === 'GET' && !$slugOrId) {
    $stmt = $pdo->query("SELECT * FROM pages ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($method === 'GET' && $slugOrId) {
    // La tabla se llama page_contents (plural) y la columna de idioma es 'language'
    $stmt = $pdo->prepare("
        SELECT pc.sections FROM page_contents pc
        JOIN pages p ON pc.page_id = p.id
        WHERE (p.slug = ? OR p.slug = CONCAT('/', ?) OR p.id = ?) AND pc.language = ?
    ");
    $stmt->execute([$slugOrId, $slugOrId, $slugOrId, $lang]);
    $row = $stmt->fetch();

    if ($row) {
        $sections = json_decode($row['sections'], true);
        // Devuelve el objeto que espera el frontend: { page_id, language, sections }
        echo json_encode([
            "page_id" => $slugOrId,
            "language" => $lang,
            "sections" => is_array($sections) ? $sections : []
        ]);
    } else {
        // Si la página no tiene contenido aún, devolver estructura vacía (no 500)
        echo json_encode([
            "page_id" => $slugOrId,
            "language" => $lang,
            "sections" => []
        ]);
    }

} else if ($method === 'PUT' && $slugOrId) {
    $data = json_decode(file_get_contents('php://input'), true);
    $sections = $data['sections'] ?? [];

    // Primero buscamos el page_id real
    $pageStmt = $pdo->prepare("SELECT id FROM pages WHERE slug = ? OR id = ? LIMIT 1");
    $pageStmt->execute([$slugOrId, $slugOrId]);
    $page = $pageStmt->fetch();

    if (!$page) {
        http_response_code(404);
        echo json_encode(["error" => "Página no encontrada"]);
        return;
    }

    $pageId = $page['id'];
    $sectionsJson = json_encode($sections);

    // UPSERT: si ya existe el registro lo actualiza, sino lo inserta
    $upsertStmt = $pdo->prepare("
        INSERT INTO page_contents (page_id, language, sections)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE sections = VALUES(sections)
    ");
    $upsertStmt->execute([$pageId, $lang, $sectionsJson]);

    echo json_encode(["success" => true]);
} else if ($method === 'POST') {
    // Create new page
    $data = json_decode(file_get_contents('php://input'), true);
    $slug = $data['slug'] ?? 'nueva-pagina-' . time();
    $type = $data['type'] ?? 'custom';
    $status = $data['status'] ?? 'published';
    $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );

    // Verify if slug exists
    $checkStmt = $pdo->prepare("SELECT id FROM pages WHERE slug = ?");
    $checkStmt->execute([$slug]);
    if ($checkStmt->fetch()) {
        $slug = $slug . '-' . time();
    }

    $stmt = $pdo->prepare("INSERT INTO pages (id, slug, type, status) VALUES (?, ?, ?, ?)");
    $stmt->execute([$id, $slug, $type, $status]);

    // Retrieve the created page
    $getStmt = $pdo->prepare("SELECT * FROM pages WHERE id = ?");
    $getStmt->execute([$id]);
    echo json_encode($getStmt->fetch());
} else if ($method === 'DELETE' && $slugOrId) {
    // Delete a page and its content (cascade might handle content, but just in case)
    $pdo->prepare("DELETE FROM page_contents WHERE page_id = ?")->execute([$slugOrId]);
    $stmt = $pdo->prepare("DELETE FROM pages WHERE id = ? OR slug = ?");
    $stmt->execute([$slugOrId, $slugOrId]);
    echo json_encode(["success" => true]);
}

