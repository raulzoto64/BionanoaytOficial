<?php
$method = $_SERVER['REQUEST_METHOD'];
$idOrAction = $parts[1] ?? null;

if ($method === 'GET') {
    if ($idOrAction === 'translations') {
        // Columna correcta: language (no language_code)
        $lang = $parts[2] ?? 'es';
        $stmt = $pdo->prepare("SELECT * FROM category_translations WHERE language = ?");
        $stmt->execute([$lang]);
        echo json_encode($stmt->fetchAll() ?: []);

    } else if ($idOrAction) {
        $sub = $parts[2] ?? '';
        if ($sub === 'translation') {
            $lang = $parts[3] ?? 'es';
            $stmt = $pdo->prepare("SELECT * FROM category_translations WHERE category_id = ? AND language = ?");
            $stmt->execute([$idOrAction, $lang]);
            echo json_encode($stmt->fetch() ?: (object)[]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = ? OR slug = ?");
            $stmt->execute([$idOrAction, $idOrAction]);
            echo json_encode($stmt->fetch() ?: (object)[]);
        }

    } else {
        $where = isset($_GET['all']) ? "1=1" : "status = 'active'";
        $stmt = $pdo->query("SELECT * FROM categories WHERE $where ORDER BY `order` ASC");
        echo json_encode($stmt->fetchAll() ?: []);
    }
}
