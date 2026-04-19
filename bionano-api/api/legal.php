<?php
$slug = $parts[1] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($slug) {
        // Tabla correcta: legal_pages (no legal_content)
        $stmt = $pdo->prepare("SELECT * FROM legal_pages WHERE slug = ? AND is_active = 1");
        $stmt->execute([$slug]);
        echo json_encode($stmt->fetch() ?: (object)[]);
    } else {
        $stmt = $pdo->query("SELECT id, slug, title_es, title_en FROM legal_pages WHERE is_active = 1");
        echo json_encode($stmt->fetchAll() ?: []);
    }
}
