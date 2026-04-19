<?php
$method = $_SERVER['REQUEST_METHOD'];
$id = $parts[1] ?? null;

if ($method === 'GET') {
    if ($id && strpos($id, 'prod-') === 0) {
        // Get prices by product ID
        $stmt = $pdo->prepare("SELECT * FROM prices_by_quantity WHERE product_id = ? ORDER BY min_quantity ASC");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetchAll());
    } else if ($id) {
        // Get single price by ID
        $stmt = $pdo->prepare("SELECT * FROM prices_by_quantity WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode($stmt->fetch() ?: (object)[]);
    } else {
        // Get all prices
        $stmt = $pdo->query("SELECT * FROM prices_by_quantity");
        echo json_encode($stmt->fetchAll());
    }
} else if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = bin2hex(random_bytes(10));
    
    $stmt = $pdo->prepare("INSERT INTO prices_by_quantity (id, product_id, min_quantity, max_quantity, price_per_unit, currency, packaging) VALUES (?, ?, ?, ?, ?, ?, ?)");
    try {
        $stmt->execute([
            $id,
            $data['product_id'],
            $data['min_quantity'],
            $data['max_quantity'] ?? null,
            $data['price_per_unit'],
            $data['currency'] ?? 'COP',
            $data['packaging'] ?? null
        ]);
        echo json_encode(["success" => true, "id" => $id]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }

} else if ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $pdo->prepare("UPDATE prices_by_quantity SET min_quantity=?, max_quantity=?, price_per_unit=?, currency=?, packaging=? WHERE id=?");
    try {
        $stmt->execute([
            $data['min_quantity'],
            $data['max_quantity'] ?? null,
            $data['price_per_unit'],
            $data['currency'] ?? 'COP',
            $data['packaging'] ?? null,
            $id
        ]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }

} else if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare("DELETE FROM prices_by_quantity WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
}
