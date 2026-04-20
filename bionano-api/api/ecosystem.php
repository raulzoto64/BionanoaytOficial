<?php
$method = $_SERVER['REQUEST_METHOD'];
$idOrAction = $parts[1] ?? null;

if ($method === 'GET') {
    if ($idOrAction === 'translations') {
        // GET /api/ecosystem/translations/{lang}
        $lang = $parts[2] ?? 'es';
        $stmt = $pdo->prepare("SELECT * FROM ecosystem_member_translations WHERE language = ?");
        $stmt->execute([$lang]);
        echo json_encode($stmt->fetchAll() ?: []);

    } else if ($idOrAction === 'members' || $idOrAction === null) {
        // Admin or Public list
        $all = isset($_GET['all']) && $_GET['all'] === 'true';
        $where = $all ? "" : "WHERE em.status = 'active'";
        
        $stmt = $pdo->prepare("
            SELECT 
                em.*,
                COALESCE(et.name, em.slug) as name,
                COALESCE(et.description, '') as description
            FROM ecosystem_members em
            LEFT JOIN ecosystem_member_translations et 
                ON em.id = et.member_id AND et.language = 'es'
            $where
            ORDER BY COALESCE(et.name, em.slug) ASC
        ");
        $stmt->execute();
        $rows = $stmt->fetchAll();
        foreach ($rows as &$item) {
            $item['social_media'] = json_decode($item['social_media'] ?? '{}', true) ?: (object)[];
            $item['youtube_videos'] = json_decode($item['youtube_videos'] ?? '[]', true) ?: [];
            $item['short_videos'] = json_decode($item['short_videos'] ?? '[]', true) ?: [];
        }
        echo json_encode($rows ?: []);

    } else {
        $sub = $parts[2] ?? '';
        if ($sub === 'translation') {
            $lang = $parts[3] ?? 'es';
            $stmt = $pdo->prepare("SELECT * FROM ecosystem_member_translations WHERE member_id = ? AND language = ?");
            $stmt->execute([$idOrAction, $lang]);
            echo json_encode($stmt->fetch() ?: (object)[]);
        } else {
            $stmt = $pdo->prepare("SELECT * FROM ecosystem_members WHERE id = ? OR slug = ?");
            $stmt->execute([$idOrAction, $idOrAction]);
            $row = $stmt->fetch();
            if ($row) {
                $row['social_media'] = json_decode($row['social_media'] ?? '{}', true) ?: (object)[];
                $row['youtube_videos'] = json_decode($row['youtube_videos'] ?? '[]', true) ?: [];
                $row['short_videos'] = json_decode($row['short_videos'] ?? '[]', true) ?: [];
            }
            echo json_encode($row ?: (object)[]);
        }
    }
} else if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($idOrAction === 'members' || $idOrAction === null) {
        // Create Member
        $id = 'eco-' . strtolower(substr(md5(uniqid()), 0, 8));
        $slug = $data['slug'] ?? $id;
        $status = $data['status'] ?? 'draft';
        $image = $data['image'] ?? '';
        $sector = $data['sector'] ?? '';
        $social_media = json_encode($data['social_media'] ?? (object)[]);
        $youtube_videos = json_encode($data['youtube_videos'] ?? []);
        $short_videos = json_encode($data['short_videos'] ?? []);
        
        $stmt = $pdo->prepare("INSERT INTO ecosystem_members (id, slug, status, image, sector, social_media, youtube_videos, short_videos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $slug, $status, $image, $sector, $social_media, $youtube_videos, $short_videos]);
        
        $getStmt = $pdo->prepare("SELECT * FROM ecosystem_members WHERE id = ?");
        $getStmt->execute([$id]);
        echo json_encode($getStmt->fetch());
        
    } else {
        // Update Translation (POST /api/ecosystem/{id}/translation/{lang})
        $sub = $parts[2] ?? '';
        if ($sub === 'translation') {
            $lang = $parts[3] ?? 'es';
            $name = $data['name'] ?? '';
            $description = $data['description'] ?? '';
            
            $stmt = $pdo->prepare("
                INSERT INTO ecosystem_member_translations (member_id, language, name, description)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)
            ");
            $stmt->execute([$idOrAction, $lang, $name, $description]);
            
            $getStmt = $pdo->prepare("SELECT * FROM ecosystem_member_translations WHERE member_id = ? AND language = ?");
            $getStmt->execute([$idOrAction, $lang]);
            echo json_encode($getStmt->fetch());
        }
    }
} else if ($method === 'PUT' && $idOrAction) {
    // Update Member
    $data = json_decode(file_get_contents('php://input'), true);
    
    $fields = [];
    $params = [];
    
    $allowedFields = ['slug', 'status', 'image', 'sector', 'social_media', 'youtube_videos', 'short_videos'];
    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $fields[] = "$field = ?";
            if (is_array($data[$field]) || is_object($data[$field])) {
                $params[] = json_encode($data[$field]);
            } else {
                $params[] = $data[$field];
            }
        }
    }
    
    if (empty($fields)) {
        echo json_encode(["error" => "No hay campos para actualizar"]);
        exit;
    }
    
    $params[] = $idOrAction;
    $sql = "UPDATE ecosystem_members SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode(["success" => true]);

} else if ($method === 'DELETE' && $idOrAction) {
    // Delete Member and translations
    $pdo->prepare("DELETE FROM ecosystem_member_translations WHERE member_id = ?")->execute([$idOrAction]);
    $stmt = $pdo->prepare("DELETE FROM ecosystem_members WHERE id = ?");
    $stmt->execute([$idOrAction]);
    echo json_encode(["success" => true]);
}
