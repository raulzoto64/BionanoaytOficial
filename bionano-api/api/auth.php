<?php
/**
 * Controlador de Autenticación - BionanoAYT
 * VERSION 4.0 - MODO LABORATORIO
 */
header('Content-Type: application/json');
$action = $parts[1] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);
    
    // Si el JSON falla, intentar leer de $_POST (por si Hostgator lo procesa antes)
    if (empty($data) && !empty($_POST)) {
        $data = $_POST;
    }

    if ($action === 'login') {
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';
        
        $debug = [
            "api_version" => "4.0-LAB",
            "received_email" => $email,
            "password_length" => strlen($password),
            "raw_input_preview" => substr($rawInput, 0, 50),
            "json_error" => json_last_error_msg()
        ];
        
        $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user) {
            $debug["user_found"] = true;
            
            // TESTS DE CONTRASEÑA
            $verify_hash = password_verify($password, $user['password']);
            $verify_plain = ($password === $user['password']);
            
            $debug["verify_hash"] = $verify_hash;
            $debug["verify_plain"] = $verify_plain;
            $debug["db_hash_start"] = substr($user['password'], 0, 10);

            if ($verify_hash || $verify_plain) {
                unset($user['password']);
                echo json_encode([
                    "success" => true,
                    "message" => "¡Acceso concedido!",
                    "user" => $user,
                    "token" => "tk_" . bin2hex(random_bytes(10)),
                    "debug" => $debug
                ]);
            } else {
                http_response_code(401);
                // Si falla todo, enviamos una "pista" técnica para saber por qué falló password_verify
                $debug["rehashed_test"] = substr(password_hash($password, PASSWORD_DEFAULT), 0, 10);
                echo json_encode([
                    "success" => false, 
                    "message" => "La contraseña no coincide con el registro", 
                    "debug" => $debug
                ]);
            }
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "message" => "Usuario no registrado", "debug" => $debug]);
        }
        exit;

    } else if ($action === 'register') {
        // Lógica de registro... (mantenemos la misma robusta anterior)
        $name = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';
        $hashed = password_hash($password, PASSWORD_DEFAULT);
        
        $q = $pdo->query("SELECT COUNT(*) FROM users");
        $role = ($q->fetchColumn() == 0) ? 'admin' : 'customer';
        $id = bin2hex(random_bytes(18));
        
        try {
            $stmt = $pdo->prepare("INSERT INTO users (id, name, email, password, role, status) VALUES (?, ?, ?, ?, ?, 'active')");
            $stmt->execute([$id, $name, $email, $hashed, $role]);
            
            echo json_encode(["success"=>true, "message"=>"OK", "user"=>["email"=>$email, "role"=>$role]]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success"=>false, "message"=>$e->getMessage()]);
        }
    }
}
