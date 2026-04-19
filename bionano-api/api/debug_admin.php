<?php
require_once 'db.php';
$email = 'administrador4@atbionano.com';
$stmt = $pdo->prepare("SELECT id, email, name FROM users WHERE LOWER(email) = LOWER(?)");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user) {
    echo "USUARIO ENCONTRADO:\n";
    echo "ID: [" . $user['id'] . "]\n";
    echo "EMAIL: [" . $user['email'] . "]\n";
    echo "LONGITUD ID: " . strlen($user['id']) . "\n";
} else {
    echo "USUARIO NO ENCONTRADO POR EMAIL: $email\n";
    echo "Todos los usuarios:\n";
    $all = $pdo->query("SELECT id, email FROM users LIMIT 10")->fetchAll();
    print_r($all);
}
