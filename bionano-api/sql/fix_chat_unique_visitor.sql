-- ✅ MIGRACIÓN ACTUALIZADA: Solo agrega el constraint UNIQUE
-- Tu tabla ya tiene todos los campos, solo falta garantizar 1 chat = 1 visitante

-- Primero elimina chats duplicados (mantiene el mas reciente)
DELETE c1 FROM chats c1
INNER JOIN chats c2 
WHERE 
  c1.id < c2.id 
  AND c1.visitor_id = c2.visitor_id;

-- ✅ Agregar constraint UNIQUE para siempre
ALTER TABLE chats 
ADD CONSTRAINT unique_visitor_chat 
UNIQUE (visitor_id);