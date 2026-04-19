<?php
$method = $_SERVER['REQUEST_METHOD'];
$idOrAction = $parts[1] ?? null;

if ($method === 'GET') {
    if ($idOrAction === 'categories') {
        // GET /api/blog/categories o /api/blog/categories/{id}/translation/{lang}
        $sub = $parts[2] ?? '';
        if ($sub && $parts[3] === 'translation') {
            $catId = $sub;
            $lang = $parts[4] ?? 'es';
            $stmt = $pdo->prepare("SELECT * FROM blog_category_translations WHERE category_id = ? AND language = ?");
            $stmt->execute([$catId, $lang]);
            echo json_encode($stmt->fetch() ?: (object)[]);
        } else {
            $stmt = $pdo->prepare("
                SELECT bc.*, bct.name, bct.description
                FROM blog_categories bc
                LEFT JOIN blog_category_translations bct ON bc.id = bct.category_id AND bct.language = 'es'
                WHERE bc.status = 'active'
                ORDER BY bc.`order` ASC
            ");
            $stmt->execute();
            echo json_encode($stmt->fetchAll() ?: []);
        }

    } else if ($idOrAction === 'translations') {
        // Columna correcta: language (no language_code)
        $lang = $parts[2] ?? 'es';
        $stmt = $pdo->prepare("
            SELECT bp.*, bpt.* 
            FROM blog_posts bp
            JOIN blog_post_translations bpt ON bp.id = bpt.post_id
            WHERE bpt.language = ? AND bp.status = 'published'
            ORDER BY bp.created_at DESC
        ");
        $stmt->execute([$lang]);
        echo json_encode($stmt->fetchAll() ?: []);

    } else if ($idOrAction === 'posts') {
        $stmt = $pdo->query("SELECT * FROM blog_posts WHERE status = 'published' ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll() ?: []);

    } else if ($idOrAction) {
        $sub = $parts[2] ?? '';
        if ($sub === 'translation') {
            $lang = $parts[3] ?? 'es';
            $stmt = $pdo->prepare("SELECT * FROM blog_post_translations WHERE post_id = ? AND language = ?");
            $stmt->execute([$idOrAction, $lang]);
            echo json_encode($stmt->fetch() ?: (object)[]);
        } else if ($sub === 'categories') {
            // GET /api/blog/posts/{id}/categories
            $stmt = $pdo->prepare("SELECT * FROM blog_post_categories WHERE post_id = ?");
            $stmt->execute([$idOrAction]);
            echo json_encode($stmt->fetchAll() ?: []);
        } else {
            // Buscar por id o slug, con JOIN a traducciones
            $stmt = $pdo->prepare("SELECT * FROM blog_posts WHERE id = ? OR slug = ?");
            $stmt->execute([$idOrAction, $idOrAction]);
            echo json_encode($stmt->fetch() ?: (object)[]);
        }

    } else {
        $stmt = $pdo->query("SELECT * FROM blog_posts WHERE status = 'published' ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll() ?: []);
    }
}
