<?php
/**
 * Chats API - BionanoAYT
 * Handles real-time messaging between visitors and administrators.
 */

$method = $_SERVER['REQUEST_METHOD'];
$id = $parts[1] ?? null; // Can be chat_id or visitor_id
if ($method === 'GET') {
    if ($id) {
        // Fetch specific chat history
        $stmt = $pdo->prepare("SELECT * FROM chats WHERE id = ? OR visitor_id = ? ORDER BY created_at DESC LIMIT 1");
        $stmt->execute([$id, $id]);
        $chat = $stmt->fetch();

        if ($chat) {
            // Auto-ping: Update activity based on requester role
            $role = $_GET['role'] ?? 'visitor';
            $pingField = ($role === 'admin') ? 'last_active_admin' : 'last_active_visitor';
            $pdo->prepare("UPDATE chats SET $pingField = NOW() WHERE id = ?")->execute([$chat['id']]);

            // Calculate statuses in PHP to avoid DB-Server timezone mismatches
            $nowTime = time();
            $chat['is_admin_typing'] = $chat['admin_typing_until'] && strtotime($chat['admin_typing_until']) > $nowTime;
            $chat['is_visitor_typing'] = $chat['visitor_typing_until'] && strtotime($chat['visitor_typing_until']) > $nowTime;
            $chat['is_admin_online'] = $chat['last_active_admin'] && strtotime($chat['last_active_admin']) > ($nowTime - 45);
            $chat['is_visitor_online'] = $chat['last_active_visitor'] && strtotime($chat['last_active_visitor']) > ($nowTime - 45);

            $stmt = $pdo->prepare("SELECT * FROM chat_messages WHERE chat_id = ? ORDER BY created_at ASC");
            $stmt->execute([$chat['id']]);
            $messages = $stmt->fetchAll();
            echo json_encode([
                "chat" => $chat, 
                "messages" => $messages
            ]);
        } else {
            echo json_encode(["chat" => null, "messages" => []]);
        }
    } else {
        // Admin: List all conversations
        $stmt = $pdo->query("
            SELECT 
                c.*, 
                MAX(l.name) as lead_name, 
                MAX(l.email) as lead_email,
                MAX(l.status) as lead_status
            FROM chats c 
            LEFT JOIN leads l ON c.visitor_id = l.visitor_id 
            GROUP BY c.id
            ORDER BY c.updated_at DESC
        ");
        $chats = $stmt->fetchAll();
        $nowTime = time();

        foreach ($chats as &$c) {
            $c['is_admin_typing'] = $c['admin_typing_until'] && strtotime($c['admin_typing_until']) > $nowTime;
            $c['is_visitor_typing'] = $c['visitor_typing_until'] && strtotime($c['visitor_typing_until']) > $nowTime;
            $c['is_admin_online'] = $c['last_active_admin'] && strtotime($c['last_active_admin']) > ($nowTime - 45);
            $c['is_visitor_online'] = $c['last_active_visitor'] && strtotime($c['last_active_visitor']) > ($nowTime - 45);
        }

        echo json_encode($chats);
    }
} else if ($method === 'POST') {
    // ... existing POST logic remains for sending messages ...
    $data = json_decode(file_get_contents('php://input'), true);
    $visitor_id = $data['visitor_id'] ?? null;
    $sender_type = $data['sender_type'] ?? 'visitor'; // 'visitor' or 'admin'
    $message = $data['content'] ?? $data['message'] ?? '';
    
    if (!$visitor_id && $sender_type === 'visitor') {
        http_response_code(400);
        echo json_encode(["error" => "visitor_id is required for visitor messages"]);
        exit;
    }

    // 1. Find or create the conversation
    $chatId = null;
    if ($visitor_id) {
        $stmt = $pdo->prepare("SELECT id FROM chats WHERE visitor_id = ? LIMIT 1");
        $stmt->execute([$visitor_id]);
        $existing = $stmt->fetch();
        if ($existing) {
            $chatId = $existing['id'];
        }
    }

    if (!$chatId) {
        $chatId = bin2hex(random_bytes(10));
        $stmt = $pdo->prepare("INSERT INTO chats (id, visitor_id, status) VALUES (?, ?, 'open')");
        $stmt->execute([$chatId, $visitor_id]);
    }

    // 2. Insert the message
    $sender_id = $data['sender_id'] ?? ($sender_type === 'visitor' ? $visitor_id : 'admin');
    $stmt = $pdo->prepare("INSERT INTO chat_messages (chat_id, sender_type, sender_id, content) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $chatId,
        $sender_type,
        $sender_id,
        $message
    ]);

    // 3. Update chat header (unread and snippet)
    $unreadField = ($sender_type === 'visitor') ? 'unread_count_admin' : 'unread_count_visitor';
    // When sending a message, also reset typing status for the sender
    $typingField = ($sender_type === 'visitor') ? 'visitor_typing_until' : 'admin_typing_until';
    $stmt = $pdo->prepare("UPDATE chats SET last_message = ?, $unreadField = $unreadField + 1, $typingField = NULL, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$message, $chatId]);

    // 4. Lead Integration
    if ($sender_type === 'visitor' && $visitor_id) {
        $checkLead = $pdo->prepare("SELECT id FROM leads WHERE visitor_id = ? LIMIT 1");
        $checkLead->execute([$visitor_id]);
        if (!$checkLead->fetch()) {
            $leadId = bin2hex(random_bytes(10));
            $stmt = $pdo->prepare("INSERT INTO leads (id, visitor_id, name, lead_type, status) VALUES (?, ?, ?, 'Chat', 'new')");
            $stmt->execute([$leadId, $visitor_id, 'Visitante de Chat']);
        }
    }

    echo json_encode(["success" => true, "chat_id" => $chatId]);

} else if ($method === 'PATCH' && $id) {
    // Handle specific actions like typing
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action'] ?? '';

    if ($action === 'typing') {
        $role = $data['role'] ?? 'visitor';
        $isTyping = $data['is_typing'] ?? false;
        $field = ($role === 'admin') ? 'admin_typing_until' : 'visitor_typing_until';
        $val = $isTyping ? date('Y-m-d H:i:s', time() + 7) : null; // 7 seconds typing window
        
        $stmt = $pdo->prepare("UPDATE chats SET $field = ? WHERE id = ? OR visitor_id = ?");
        $stmt->execute([$val, $id, $id]);
        echo json_encode(["success" => true]);
    }
} else if ($method === 'PUT' && $id) {
    // Mark as read
    $data = json_decode(file_get_contents('php://input'), true);
    $target = $data['target'] ?? 'admin'; // 'admin' clears unread_count_admin
    $field = ($target === 'admin') ? 'unread_count_admin' : 'unread_count_visitor';
    
    $stmt = $pdo->prepare("UPDATE chats SET $field = 0 WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["success" => true]);
}
