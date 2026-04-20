<?php
$method = $_SERVER['REQUEST_METHOD'];
$idOrAction = $parts[1] ?? null;

if ($method === 'GET') {
    if ($idOrAction === 'categories') {
        $sub = $parts[2] ?? '';
        if ($sub && ($parts[3] ?? '') === 'translation') {
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
        $lang = $parts[2] ?? 'es';
        $stmt = $pdo->prepare("
            SELECT bp.id as id, bp.slug, bp.status, bp.author, bp.cover_image, bp.featured, bp.views, bp.created_at, bp.updated_at, bp.type, bp.category_name,
                   bpt.title, bpt.excerpt, bpt.content, bpt.meta_title, bpt.meta_description, bpt.meta_keywords
            FROM blog_posts bp
            LEFT JOIN blog_post_translations bpt ON bp.id = bpt.post_id AND bpt.language = ?
            WHERE bp.status = 'published'
            ORDER BY bp.created_at DESC
        ");
        $stmt->execute([$lang]);
        echo json_encode($stmt->fetchAll() ?: []);

    } else if ($idOrAction === 'posts') {
        $status_filter = $_GET['status'] ?? null;
        if ($status_filter) {
            $stmt = $pdo->prepare("SELECT * FROM blog_posts WHERE status = ? ORDER BY created_at DESC");
            $stmt->execute([$status_filter]);
        } else {
            $stmt = $pdo->query("SELECT * FROM blog_posts ORDER BY created_at DESC");
        }
        echo json_encode($stmt->fetchAll() ?: []);

    } else if ($idOrAction) {
        $sub = $parts[2] ?? '';
        if ($sub === 'translation') {
            $lang = $parts[3] ?? 'es';
            $stmt = $pdo->prepare("SELECT * FROM blog_post_translations WHERE post_id = ? AND language = ?");
            $stmt->execute([$idOrAction, $lang]);
            echo json_encode($stmt->fetch() ?: (object)[]);
        } else if ($sub === 'categories') {
            $stmt = $pdo->prepare("SELECT * FROM blog_post_categories WHERE post_id = ?");
            $stmt->execute([$idOrAction]);
            echo json_encode($stmt->fetchAll() ?: []);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM blog_posts WHERE id = ? OR slug = ?");
            $stmt->execute([$idOrAction, $idOrAction]);
            echo json_encode($stmt->fetch() ?: (object)[]);
        }

    } else {
        $stmt = $pdo->query("SELECT * FROM blog_posts WHERE status = 'published' ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll() ?: []);
    }
}

// ============================================================
// POST: Crear post o UPSERT traducción (incluyendo content)
// ============================================================
if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    // POST /api/blog/{id}/translation/{lang}
    if ($idOrAction && ($parts[2] ?? '') === 'translation') {
        $postId = $idOrAction;
        $lang   = $parts[3] ?? 'es';

        $title            = array_key_exists('title', $body)            ? $body['title']            : null;
        $excerpt          = array_key_exists('excerpt', $body)          ? $body['excerpt']          : null;
        $content          = array_key_exists('content', $body)          ? $body['content']          : null;
        $meta_title       = array_key_exists('meta_title', $body)       ? $body['meta_title']       : null;
        $meta_description = array_key_exists('meta_description', $body) ? $body['meta_description'] : null;
        $meta_keywords    = array_key_exists('meta_keywords', $body)    ? $body['meta_keywords']    : null;

        // Verificar si ya existe la traducción
        $check = $pdo->prepare("SELECT post_id FROM blog_post_translations WHERE post_id = ? AND language = ?");
        $check->execute([$postId, $lang]);
        $exists = $check->fetch();

        if ($exists) {
            $fields = [];
            $params = [];
            if ($title            !== null) { $fields[] = 'title = ?';            $params[] = $title; }
            if ($excerpt          !== null) { $fields[] = 'excerpt = ?';          $params[] = $excerpt; }
            if ($content          !== null) { $fields[] = 'content = ?';          $params[] = $content; }
            if ($meta_title       !== null) { $fields[] = 'meta_title = ?';       $params[] = $meta_title; }
            if ($meta_description !== null) { $fields[] = 'meta_description = ?'; $params[] = $meta_description; }
            if ($meta_keywords    !== null) { $fields[] = 'meta_keywords = ?';    $params[] = $meta_keywords; }

            if (!empty($fields)) {
                // Resolver el ID si se pasó un slug
                $idStmt = $pdo->prepare("SELECT id FROM blog_posts WHERE id = ? OR slug = ?");
                $idStmt->execute([$postId, $postId]);
                $realPostId = $idStmt->fetchColumn() ?: $postId;

                $params[] = $realPostId;
                $params[] = $lang;
                $sql = "UPDATE blog_post_translations SET " . implode(', ', $fields) . " WHERE post_id = ? AND language = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
            }
        } else {
            $stmt = $pdo->prepare("
                INSERT INTO blog_post_translations (post_id, language, title, excerpt, content, meta_title, meta_description, meta_keywords)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$postId, $lang, $title, $excerpt, $content, $meta_title, $meta_description, $meta_keywords]);
        }

        http_response_code(200);
        echo json_encode(['success' => true, 'post_id' => $postId, 'language' => $lang]);
        exit;
    }

    // POST /api/blog → crear nuevo post
    $id            = $body['id']            ?? uniqid('blog-');
    $slug          = $body['slug']          ?? $id;
    $status        = $body['status']        ?? 'draft';
    $author        = $body['author']        ?? '';
    $cover_image   = $body['cover_image']   ?? '';
    $type          = $body['type']          ?? 'article';
    $category_name = $body['category_name'] ?? '';

    $stmt = $pdo->prepare("
        INSERT INTO blog_posts (id, slug, status, author, cover_image, type, category_name)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        AS new_post
        ON DUPLICATE KEY UPDATE 
            status = new_post.status, 
            author = new_post.author,
            cover_image = new_post.cover_image, 
            type = new_post.type, 
            category_name = new_post.category_name
    ");
    $stmt->execute([$id, $slug, $status, $author, $cover_image, $type, $category_name]);

    http_response_code(201);
    echo json_encode(['success' => true, 'id' => $id]);
    exit;
}

// ============================================================
// PUT: Actualizar metadatos del post (author, cover_image, type, etc.)
// ============================================================
if ($method === 'PUT' && $idOrAction) {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];

    $fields = [];
    $params = [];
    $allowed = ['author', 'cover_image', 'type', 'category_name', 'status', 'slug'];
    foreach ($allowed as $field) {
        if (array_key_exists($field, $body)) {
            $fields[] = "`$field` = ?";
            $params[] = $body[$field];
        }
    }

    if (!empty($fields)) {
        $params[] = $idOrAction;
        $params[] = $idOrAction;
        $sql = "UPDATE blog_posts SET " . implode(', ', $fields) . " WHERE id = ? OR slug = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
    }

    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}

// ============================================================
// DELETE: Eliminar post y sus traducciones
// ============================================================
if ($method === 'DELETE' && $idOrAction) {
    $pdo->prepare("DELETE FROM blog_post_translations WHERE post_id = ?")->execute([$idOrAction]);
    $pdo->prepare("DELETE FROM blog_posts WHERE id = ?")->execute([$idOrAction]);
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}
