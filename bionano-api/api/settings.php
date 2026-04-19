<?php
$subResource = $parts[1] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    switch ($subResource) {
        case 'site':
            $stmt = $pdo->query("SELECT * FROM site_settings LIMIT 1");
            $row = $stmt->fetch();
            if ($row) {
                $row['social_media'] = json_decode($row['social_media'] ?? '{}', true) ?: (object)[];
                $row['seo'] = json_decode($row['seo'] ?? '{}', true) ?: (object)[];
                $row['colors'] = json_decode($row['colors'] ?? '{}', true) ?: (object)[];
            }
            echo json_encode($row ?: (object)[]);
            break;

        case 'footer':
            $stmt = $pdo->query("SELECT * FROM footer_settings LIMIT 1");
            $row = $stmt->fetch();
            if ($row) {
                // Decodificar los campos JSON almacenados como string
                $row['columns']      = json_decode($row['columns'] ?? '[]', true) ?: [];
                $row['contact_info'] = json_decode($row['contact_info'] ?? '{}', true) ?: (object)[];
                $row['social_media'] = json_decode($row['social_media'] ?? '{}', true) ?: (object)[];
            }
            echo json_encode($row ?: (object)[]);
            break;

        case 'translations':
            $stmt = $pdo->query("SELECT * FROM translations");
            $translations = $stmt->fetchAll();

            // El frontend espera: [{ key, es, en }, ...]  — columna 'key' (no 'key_name')
            $output = [];
            foreach ($translations as $row) {
                $output[] = [
                    'key' => $row['key'],   // ← corregido: era $row['key_name']
                    'es'  => $row['es'],
                    'en'  => $row['en']
                ];
            }
            echo json_encode($output);
            break;

        default:
            http_response_code(404);
            echo json_encode(["error" => "Configuración no encontrada"]);
            break;
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Actualizar site_settings desde el panel admin
    $data = json_decode(file_get_contents('php://input'), true);
    switch ($subResource) {
        case 'site':
            $stmt = $pdo->prepare("
                INSERT INTO site_settings (id, site_name, site_email, site_phone, site_address, social_media, seo, colors)
                VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    site_name = VALUES(site_name),
                    site_email = VALUES(site_email),
                    site_phone = VALUES(site_phone),
                    site_address = VALUES(site_address),
                    social_media = VALUES(social_media),
                    seo = VALUES(seo),
                    colors = VALUES(colors)
            ");
            $stmt->execute([
                $data['site_name'] ?? 'A&T BioNano',
                $data['site_email'] ?? '',
                $data['site_phone'] ?? '',
                $data['site_address'] ?? '',
                json_encode($data['social_media'] ?? []),
                json_encode($data['seo'] ?? []),
                json_encode($data['colors'] ?? [])
            ]);
            echo json_encode(["success" => true]);
            break;

        case 'footer':
            $stmt = $pdo->prepare("
                INSERT INTO footer_settings (id, columns, contact_info, social_media, copyright_text_es, copyright_text_en)
                VALUES (UUID(), ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    columns = VALUES(columns),
                    contact_info = VALUES(contact_info),
                    social_media = VALUES(social_media),
                    copyright_text_es = VALUES(copyright_text_es),
                    copyright_text_en = VALUES(copyright_text_en)
            ");
            $stmt->execute([
                json_encode($data['columns'] ?? []),
                json_encode($data['contact_info'] ?? []),
                json_encode($data['social_media'] ?? []),
                $data['copyright_text_es'] ?? '© {{year}} A&T BioNano. Todos los derechos reservados.',
                $data['copyright_text_en'] ?? '© {{year}} A&T BioNano. All rights reserved.'
            ]);
            echo json_encode(["success" => true]);
            break;

        default:
            http_response_code(404);
            echo json_encode(["error" => "Configuración no encontrada"]);
    }
}
