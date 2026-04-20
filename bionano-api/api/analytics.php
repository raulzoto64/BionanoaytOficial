<?php
$method = $_SERVER['REQUEST_METHOD'];
$sub  = $parts[1] ?? '';
$sub2 = $parts[2] ?? ''; // el identifier cuando llega /carts/{identifier}

if ($method === 'POST' && $sub === 'track') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $pdo->prepare("
        INSERT INTO site_analytics (visitor_id, user_id, event_type, page_url, metadata)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $data['visitor_id'] ?? $data['session_id'] ?? null,
        $data['user_id']    ?? null,
        $data['event_name'] ?? $data['event_type'] ?? 'page_view',
        $data['page_url']   ?? null,
        json_encode($data['event_data'] ?? $data['metadata'] ?? [])
    ]);
    echo json_encode(["success" => true]);

} else if ($method === 'GET' && $sub === 'carts' && $sub2 !== '') {
    // ── GET /analytics/carts/{identifier}  ────────────────────────────────
    // Devuelve los items del carrito de ese visitor/user con datos del producto
    $identifier = $sub2;
    $stmt = $pdo->prepare("
        SELECT
            ci.id,
            ci.quantity,
            ci.packaging,
            ci.product_id,
            p.slug,
            p.image
        FROM cart_items ci
        LEFT JOIN products p ON p.id = ci.product_id
        WHERE ci.user_id = :id OR ci.guest_id = :id
        ORDER BY ci.updated_at DESC
    ");
    $stmt->execute(['id' => $identifier]);
    $items = $stmt->fetchAll();

    $result = [];
    foreach ($items as $row) {
        $result[] = [
            'id'        => $row['id'],
            'quantity'  => (int)$row['quantity'],
            'packaging' => $row['packaging'],
            'product'   => [
                'slug'  => $row['slug'] ?? 'producto',
                'image' => $row['image'] ?? ''
            ]
        ];
    }

    echo json_encode($result);

} else if ($method === 'GET' && $sub === 'carts') {
    // ── GET /analytics/carts  ──────────────────────────────────────────────
    // Lista de carritos agrupados por identifier con totales e items_list
    $stmt = $pdo->query("
        SELECT
            COALESCE(ci.user_id, ci.guest_id) AS identifier,
            COUNT(DISTINCT ci.id)             AS total_items,
            SUM(ci.quantity)                  AS total_quantity,
            MAX(ci.updated_at)                AS last_activity,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'name',     COALESCE(p.slug, 'producto'),
                    'quantity', ci.quantity
                )
            ) AS items_list
        FROM cart_items ci
        LEFT JOIN products p ON p.id = ci.product_id
        GROUP BY identifier
        ORDER BY last_activity DESC
    ");
    $rows = $stmt->fetchAll();

    // items_list viene como string JSON desde MySQL, hay que decodificarla
    foreach ($rows as &$row) {
        $row['total_items']    = (int)$row['total_items'];
        $row['total_quantity'] = (int)$row['total_quantity'];
        if (is_string($row['items_list'])) {
            $row['items_list'] = json_decode($row['items_list'], true) ?: [];
        }
    }
    unset($row);

    echo json_encode($rows ?: []);

} else if ($method === 'GET' && $sub === 'funnel') {
    // ── GET /analytics/funnel?start_date=...&end_date=...  ─────────────────
    $startDate = $_GET['start_date'] ?? date('Y-m-d H:i:s', strtotime('-30 days'));
    $endDate = $_GET['end_date'] ?? date('Y-m-d H:i:s');
    
    // Asegurar que las fechas tengan formato SQL correcto
    $startStr = date('Y-m-d H:i:s', strtotime($startDate));
    $endStr   = date('Y-m-d H:i:s', strtotime($endDate));

    $stmt = $pdo->prepare("
        SELECT
            (SELECT COUNT(DISTINCT visitor_id) FROM site_analytics WHERE created_at BETWEEN :s1 AND :e1) AS total_unique_visitors,
            (SELECT COUNT(*) FROM site_analytics WHERE event_type = 'page_view' AND created_at BETWEEN :s2 AND :e2) AS total_page_views,
            (SELECT COUNT(*) FROM site_analytics WHERE event_type = 'add_to_cart' AND created_at BETWEEN :s3 AND :e3) AS total_cart_additions,
            (SELECT COUNT(DISTINCT visitor_id) FROM leads WHERE status IN ('checkout_started', 'in_progress', 'contacted', 'new') AND created_at BETWEEN :s4 AND :e4) AS total_checkouts_started,
            (SELECT COUNT(DISTINCT visitor_id) FROM leads WHERE status IN ('closed','Vendido', 'Pagado', 'Completed', 'customer') AND created_at BETWEEN :s5 AND :e5) AS total_sales_closed,
            0 AS avg_session_duration
    ");
    $stmt->execute([
        's1' => $startStr, 'e1' => $endStr,
        's2' => $startStr, 'e2' => $endStr,
        's3' => $startStr, 'e3' => $endStr,
        's4' => $startStr, 'e4' => $endStr,
        's5' => $startStr, 'e5' => $endStr
    ]);
    $result = $stmt->fetch();
    
    echo json_encode([
        "total_unique_visitors"   => (int)($result['total_unique_visitors'] ?? 0),
        "total_page_views"        => (int)($result['total_page_views'] ?? 0),
        "total_cart_additions"    => (int)($result['total_cart_additions'] ?? 0),
        "total_checkouts_started" => (int)($result['total_checkouts_started'] ?? 0),
        "total_sales_closed"      => (int)($result['total_sales_closed'] ?? 0),
        "avg_session_duration"    => 0,
        "_debug" => [
            "range" => ["start" => $startStr, "end" => $endStr],
            "raw" => $result
        ]
    ]);

} else if ($method === 'GET' && $sub === 'summary') {
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM site_analytics WHERE DATE(created_at) = CURDATE()");
    $today = $stmt->fetch();
    echo json_encode(["today_events" => $today['total']]);

} else {
    echo json_encode(["success" => true]);
}
