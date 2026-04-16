import { useEffect, useState } from 'react';

const VISITOR_ID_KEY = 'bionano_visitor_id';

export function useVisitor() {
  const [visitorId, setVisitorId] = useState<string | null>(null);

  useEffect(() => {
    // Obtener o crear ID unico de visitante persistente
    let storedId = localStorage.getItem(VISITOR_ID_KEY);
    
    if (!storedId) {
      // Generar UUID v4 simplificado
      storedId = crypto.randomUUID ? crypto.randomUUID() : generateFallbackUUID();
      localStorage.setItem(VISITOR_ID_KEY, storedId);
    }

    setVisitorId(storedId);
  }, []);

  const generateFallbackUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  return {
    visitorId,
    setVisitorId
  };
}