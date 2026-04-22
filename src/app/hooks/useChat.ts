/**
 * Hook para controlar el chat globalmente desde cualquier componente
 * Permite abrir, cerrar y verificar estado del chat sin navegar a rutas
 */
export function useChat() {
  
  const openChat = () => {
    window.dispatchEvent(new Event('chat:open'));
  };

  const closeChat = () => {
    window.dispatchEvent(new Event('chat:close'));
  };

  const toggleChat = () => {
    window.dispatchEvent(new Event('chat:toggle'));
  };

  return {
    openChat,
    closeChat,
    toggleChat
  };
}

/**
 * Funcion helper estatica para usar fuera de componentes React
 */
export const openChatGlobal = () => {
  window.dispatchEvent(new Event('chat:open'));
};