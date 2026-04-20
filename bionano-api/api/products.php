<?php
$method = $_SERVER['REQUEST_METHOD'];
$idOrSlug = $parts[1] ?? null;
$subAction = $parts[2] ?? '';

if ($method === 'GET') {
    if ($idOrSlug === 'slug') {
        $slug = $parts[2] ?? '';
        $stmt = $pdo->prepare("SELECT * FROM products WHERE slug = ?");
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        if ($row) {
            $row['images'] = json_decode($row['images'] ?? '[]', true) ?: [];
        }
        echo json_encode($row ?: (object)[]);

    } else if ($idOrSlug === 'translations') {
        $lang = $parts[2] ?? 'es';
        $stmt = $pdo->prepare("SELECT * FROM product_translations WHERE language = ?");
        $stmt->execute([$lang]);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$item) {
            $item['features'] = json_decode($item['features'] ?? '[]', true) ?: [];
            $item['benefits'] = json_decode($item['benefits'] ?? '[]', true) ?: [];
            $item['technical_specs'] = json_decode($item['technical_specs'] ?? '{}', true) ?: (object)[];
            $item['sections'] = json_decode($item['sections'] ?? '[]', true) ?: [];
        }
        echo json_encode($rows ?: []);

    } else if ($idOrSlug === 'prices') {
        $productId = $parts[2] ?? null;
        if ($productId) {
            $stmt = $pdo->prepare("SELECT * FROM prices_by_quantity WHERE product_id = ? ORDER BY min_quantity ASC");
            $stmt->execute([$productId]);
        } else {
            $stmt = $pdo->query("SELECT * FROM prices_by_quantity ORDER BY product_id, min_quantity ASC");
        }
        echo json_encode($stmt->fetchAll() ?: []);

    } else if ($idOrSlug && $subAction === 'translation') {
        $lang = $parts[3] ?? 'es';
        $stmt = $pdo->prepare("SELECT * FROM product_translations WHERE product_id = ? AND language = ?");
        $stmt->execute([$idOrSlug, $lang]);
        $row = $stmt->fetch();
        if ($row) {
            $row['features'] = json_decode($row['features'] ?? '[]', true) ?: [];
            $row['benefits'] = json_decode($row['benefits'] ?? '[]', true) ?: [];
            $row['technical_specs'] = json_decode($row['technical_specs'] ?? '{}', true) ?: (object)[];
            $row['sections'] = json_decode($row['sections'] ?? '[]', true) ?: [];
        }
        echo json_encode($row ?: (object)[]);

    } else if ($idOrSlug) {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? OR slug = ?");
        $stmt->execute([$idOrSlug, $idOrSlug]);
        $row = $stmt->fetch();
        if ($row) {
            $row['images'] = json_decode($row['images'] ?? '[]', true) ?: [];
        }
        echo json_encode($row ?: (object)[]);

    } else {
        // Soporte para listar todos (para Admin)
        $where = isset($_GET['all']) ? "1=1" : "status = 'active'";
        $stmt = $pdo->query("SELECT * FROM products WHERE $where ORDER BY created_at DESC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$item) {
            $item['images'] = json_decode($item['images'] ?? '[]', true) ?: [];
        }
        echo json_encode($rows ?: []);
    }

} else if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Si la acción es traducción (usando ?id=xxx/translation/es)
    if ($subAction === 'translation' && $idOrSlug) {
        $lang = $parts[3] ?? 'es';
        $features = json_encode($data['features'] ?? []);
        $benefits = json_encode($data['benefits'] ?? []);
        $specs = json_encode($data['technical_specs'] ?? (object)[]);
        
        // Asegurar que la columna sections existe (Lazy Migration)
        try { $pdo->exec("ALTER TABLE product_translations ADD COLUMN sections JSON AFTER meta_description"); } catch (Exception $e) {}

        $stmt = $pdo->prepare("
            INSERT INTO product_translations (product_id, language, name, description, short_description, features, benefits, technical_specs, meta_title, meta_description, sections)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                name=VALUES(name), description=VALUES(description), short_description=VALUES(short_description),
                features=VALUES(features), benefits=VALUES(benefits), technical_specs=VALUES(technical_specs),
                meta_title=VALUES(meta_title), meta_description=VALUES(meta_description), sections=VALUES(sections)
        ");
        $stmt->execute([
            $idOrSlug, $lang, $data['name'] ?? '', $data['description'] ?? '', $data['short_description'] ?? '',
            $features, $benefits, $specs, $data['meta_title'] ?? '', $data['meta_description'] ?? '', $data['sections'] ?? '[]'
        ]);
        echo json_encode(["success"=>true]);
        exit;
    }

    // Crear producto normal
    $id = bin2hex(random_bytes(10));
    $images = json_encode($data['images'] ?? []);
    $stmt = $pdo->prepare("INSERT INTO products (id, slug, category, status, image, images, featured) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $id, $data['slug'], $data['category'] ?? 'cat-001', $data['status'] ?? 'draft',
        $data['image'] ?? '', $images, $data['featured'] ? 1 : 0
    ]);
    echo json_encode(["success"=>true, "id"=>$id]);

} else if ($method === 'PUT' && $idOrSlug) {
    if ($subAction === 'translation') {
        // En POST/UPSERT ya lo manejamos arriba, pero por si acaso
        echo json_encode(["error"=>"Use POST for translation upsert"]);
        exit;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $images = json_encode($data['images'] ?? []);
    $stmt = $pdo->prepare("UPDATE products SET slug=?, category=?, status=?, image=?, images=?, featured=? WHERE id=?");
    $stmt->execute([
        $data['slug'], $data['category'], $data['status'],
        $data['image'], $images, $data['featured'] ? 1 : 0, $idOrSlug
    ]);
    echo json_encode(["success"=>true]);

} else if ($method === 'DELETE' && $idOrSlug) {
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$idOrSlug]);
    echo json_encode(["success"=>true]);
}
