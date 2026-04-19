<?php
require_once 'db.php';
$stmt = $pdo->query("SELECT id, email FROM users");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "LISTA DE USUARIOS:\n";
foreach($users as $u) {
    echo "ID: [" . $u['id'] . "] - EMAIL: [" . $u['email'] . "]\n";
}
echo "\nBUSCANDO 77f80d8629e063b902207cd714c74baa03ae ...\n";
$stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE id = ?");
$stmt->execute(['77f80d8629e063b902207cd714c74baa03ae']);
echo "COINCIDENCIAS: " . $stmt->fetchColumn() . "\n";
