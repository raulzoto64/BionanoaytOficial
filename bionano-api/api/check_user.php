<?php
require_once 'db.php';
$id = '77f80d8629e063b902207cd714c74baa03ae';
$stmt = $pdo->prepare("SELECT id, email, name FROM users WHERE id = ?");
$stmt->execute([$id]);
print_r($stmt->fetch());

$stmt = $pdo->query("SELECT id, email, name FROM users LIMIT 5");
print_r($stmt->fetchAll());
