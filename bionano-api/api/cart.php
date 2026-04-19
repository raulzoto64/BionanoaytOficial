<?php
$method = $_SERVER['REQUEST_METHOD'];
$id = $parts[1] ?? null;

if ($method === 'POST' && $id === 'merge') {
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data['user_id'] ?? null;
    $guestId = $data['guest_id'] ?? null;
    
    if ($userId && $guestId) {
        // Transferir items del guest al user
        $stmt = $pdo->prepare("UPDATE cart_items SET user_id = ?, guest_id = NULL WHERE guest_id = ?");
        $stmt->execute([$userId, $guestId]);
        echo json_encode(["success" => true]);
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Faltan IDs"]);
    }
    exit;
}

if ($method === 'GET' && $id) {
    // JOIN con product_translations para obtener nombre, y prices_by_quantity para precio base
    $stmt = $pdo->prepare("
        SELECT 
            ci.*,
            COALESCE(pt.name, 'Producto') as name,
            p.image as image_url,
            p.slug,
            COALESCE(pbq.price_per_unit, 0) as price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        LEFT JOIN product_translations pt ON ci.product_id = pt.product_id AND pt.language = 'es'
        LEFT JOIN (
            SELECT product_id, MIN(price_per_unit) as price_per_unit
            FROM prices_by_quantity
            GROUP BY product_id
        ) pbq ON ci.product_id = pbq.product_id
        WHERE ci.guest_id = ? OR ci.user_id = ?
    ");
    $stmt->execute([$id, $id]);
    echo json_encode($stmt->fetchAll());

} else if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $userId = !empty($data['user_id']) ? $data['user_id'] : null;
    $guestId = !empty($data['guest_id']) ? $data['guest_id'] : null;
    $productId = $data['product_id'] ?? null;
    $quantity = $data['quantity'] ?? 1;
    $packaging = $data['packaging'] ?? 'standard';

    if (!$productId) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Falta product_id"]);
        exit;
    }

    if ($userId) {
        $userId = trim($userId);
        $userIdNoHyphens = str_replace('-', '', $userId);
        
        // Búsqueda flexible: exacto, sin guiones, o case-insensitive
        $check = $pdo->prepare("
            SELECT id FROM users 
            WHERE id = ? 
               OR REPLACE(id, '-', '') = ?
               OR LOWER(id) = LOWER(?)
            LIMIT 1
        ");
        $check->execute([$userId, $userIdNoHyphens, $userId]);
        $dbUser = $check->fetch();
        
        if (!$dbUser) {
            http_response_code(403);
            echo json_encode([
                "success" => false, 
                "error" => "Usuario no encontrado en la base de datos."
            ]);
            exit;
        }
        $userId = $dbUser['id'];
    }

    // Si viene guest_id, asegurarse de que existe en la tabla guests (FK constraint)
    if ($guestId) {
        try {
            $pdo->prepare("INSERT IGNORE INTO guests (id, created_at) VALUES (?, NOW())")->execute([$guestId]);
        } catch (PDOException $ge) {
            // Si la tabla guests tiene estructura diferente, intentar sin created_at
            try {
                $pdo->prepare("INSERT IGNORE INTO guests (id) VALUES (?)")->execute([$guestId]);
            } catch (PDOException $ge2) {
                // Si no se puede registrar el guest, continuar sin guest_id (evitar bloqueo total)
                $guestId = null;
            }
        }
    }

    $stmt = $pdo->prepare("
        INSERT INTO cart_items (id, guest_id, user_id, product_id, quantity, packaging) 
        VALUES (UUID(), ?, ?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)
    ");
    
    try {
        $stmt->execute([$guestId, $userId, $productId, $quantity, $packaging]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false, 
            "error" => "Fallo de base de datos: " . $e->getMessage(),
            "debug" => [
                "user_id" => $userId,
                "guest_id" => $guestId,
                "product_id" => $productId
            ]
        ]);
    }
    exit;

} else if ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("UPDATE cart_items SET quantity = ? WHERE id = ?");
    $stmt->execute([$data['quantity'], $id]);
    echo json_encode(["success" => true]);

} else if ($method === 'DELETE' && $id) {
    if (strlen($id) > 10) {
        $stmt = $pdo->prepare("DELETE FROM cart_items WHERE guest_id = ? OR user_id = ?");
        $stmt->execute([$id, $id]);
    } else {
        $stmt = $pdo->prepare("DELETE FROM cart_items WHERE id = ?");
        $stmt->execute([$id]);
    }
    echo json_encode(["success" => true]);

} else {
    // Sin ID: devolver array vacío (no error)
    echo json_encode([]);
}
