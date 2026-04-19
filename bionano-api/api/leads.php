<?php
$method = $_SERVER['REQUEST_METHOD'];
$id = $parts[1] ?? null;

if ($method === 'GET') {
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM leads WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if ($row) {
            $row['metadata'] = json_decode($row['metadata'] ?? '{}', true) ?: (object)[];
        }
        echo json_encode($row ?: (object)[]);
    } else {
        $stmt = $pdo->query("SELECT * FROM leads ORDER BY created_at DESC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$item) {
            $item['metadata'] = json_decode($item['metadata'] ?? '{}', true) ?: (object)[];
        }
        echo json_encode($rows);
    }
} else if ($method === 'POST' && $id === 'sync') {
    // Upsert por email: sincroniza o crea un lead según si ya existe
    $data = json_decode(file_get_contents('php://input'), true);
    $metadata = json_encode($data['metadata'] ?? (object)[]);
    
    // Mapear status enviados por el frontend a valores ENUM válidos de la DB
    $statusMap = [
        'in_progress'        => 'new',
        'checkout_started'   => 'contacted',
        'checkout_lead'      => 'contacted',
        'cart_progress'      => 'new',
        'new'                => 'new',
        'contacted'          => 'contacted',
        'qualified'          => 'qualified',
        'converted'          => 'customer',
        'customer'           => 'customer',
        'lost'               => 'lost',
    ];
    $rawStatus = strtolower($data['status'] ?? 'new');
    $safeStatus = $statusMap[$rawStatus] ?? 'new';

    // Buscar si ya existe por email
    $check = $pdo->prepare("SELECT id FROM leads WHERE email = ? LIMIT 1");
    $check->execute([$data['email'] ?? '']);
    $existing = $check->fetch();

    if ($existing) {
        // Actualizar
        $stmt = $pdo->prepare("UPDATE leads SET name=?, phone=?, status=?, metadata=?, lead_type=?, updated_at=NOW() WHERE id=?");
        $stmt->execute([
            $data['name'] ?? '',
            $data['phone'] ?? null,
            $safeStatus,
            $metadata,
            $data['lead_type'] ?? 'website',
            $existing['id']
        ]);
        echo json_encode(["success" => true, "id" => $existing['id'], "action" => "updated"]);
    } else {
        // Crear nuevo
        $newId = bin2hex(random_bytes(10));
        $stmt = $pdo->prepare("INSERT INTO leads (id, name, email, phone, lead_type, status, visitor_id, user_id, metadata, page_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $newId,
            $data['name'] ?? '',
            $data['email'] ?? '',
            $data['phone'] ?? null,
            $data['lead_type'] ?? 'website',
            $safeStatus,
            $data['visitor_id'] ?? null,
            $data['user_id'] ?? null,
            $metadata,
            $data['page_url'] ?? ''
        ]);
        echo json_encode(["success" => true, "id" => $newId, "action" => "created"]);
    }

} else if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id = bin2hex(random_bytes(10));
    $metadata = json_encode($data['metadata'] ?? (object)[]);
    
    $statusMap = ['in_progress'=>'new','checkout_started'=>'contacted','new'=>'new','contacted'=>'contacted','qualified'=>'qualified','converted'=>'customer','customer'=>'customer','lost'=>'lost'];
    $safeStatus = $statusMap[strtolower($data['status'] ?? 'new')] ?? 'new';
    
    $stmt = $pdo->prepare("INSERT INTO leads (id, name, email, phone, message, lead_type, status, visitor_id, user_id, metadata, page_url, referrer, is_anonymous) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $id,
        $data['name'] ?? '',
        $data['email'] ?? '',
        $data['phone'] ?? null,
        $data['message'] ?? null,
        $data['lead_type'] ?? 'website',
        $safeStatus,
        $data['visitor_id'] ?? null,
        $data['user_id'] ?? null,
        $metadata,
        $data['page_url'] ?? '',
        $data['referrer'] ?? '',
        $data['is_anonymous'] ? 1 : 0
    ]);
    echo json_encode(["success" => true, "id" => $id]);

} else if ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    // Dinámicamente actualizamos campos presentes
    $fields = [];
    $params = [];
    $allowedFields = ['name', 'last_name', 'email', 'phone', 'status', 'message', 'metadata', 'lead_type', 'page_url', 'referrer'];
    $statusMap = [
        'new' => 'new',
        'contacted' => 'contacted',
        'in_progress' => 'new',
        'checkout_started' => 'contacted',
        'qualified' => 'qualified',
        'converted' => 'customer',
        'customer' => 'customer',
        'lost' => 'lost',
        'closed' => 'lost'
    ];

    foreach ($allowedFields as $f) {
        if (isset($data[$f])) {
            // Ignorar last_name si no existe en la DB (según init.sql)
            if ($f === 'last_name') continue;

            $fields[] = "$f = ?";
            $val = $data[$f];
            if ($f === 'status') {
                $statusKey = strtolower($val);
                $val = $statusMap[$statusKey] ?? 'new';
            }
            $params[] = ($f === 'metadata') ? json_encode($val) : $val;
        }
    }
    
    if (empty($fields)) {
        echo json_encode(["success" => true, "message" => "No fields to update"]);
        exit;
    }
    
    $params[] = $id;
    $stmt = $pdo->prepare("UPDATE leads SET " . implode(", ", $fields) . " WHERE id = ?");
    $stmt->execute($params);
    echo json_encode(["success" => true]);

} else if ($method === 'DELETE' && $id) {
    $stmt = $pdo->prepare("DELETE FROM leads WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
}
