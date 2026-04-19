<?php
require_once 'db.php';
$tables = ['users', 'cart_items'];
foreach ($tables as $table) {
    echo "TABLE: $table\n";
    $stmt = $pdo->query("DESCRIBE $table");
    print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
    $stmt = $pdo->query("SHOW CREATE TABLE $table");
    print_r($stmt->fetch(PDO::FETCH_ASSOC));
    echo "\n";
}
