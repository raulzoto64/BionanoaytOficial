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
        $stmt = $pdo->prepare("
            SELECT 
                em.*,
                COALESCE(et.name, em.slug) as name,
                COALESCE(et.description, '') as description
            FROM ecosystem_members em
            LEFT JOIN ecosystem_member_translations et 
                ON em.id = et.member_id AND et.language = 'es'
            WHERE em.status = 'active'
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
}
