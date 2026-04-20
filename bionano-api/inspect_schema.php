<?php
require_once 'db.php';
$table = $_GET['table'] ?? 'cart_items';
try {
    $stmt = $pdo->query("DESCRIBE $table");
    echo json_encode($stmt->fetchAll());
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
