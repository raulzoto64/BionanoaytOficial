import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Loader2 } from 'lucide-react';
import { supabaseAPI, ChatMessage } from '../../data/supabase';
import { useAuth } from '../../hooks/useAuth';

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);
  const [isOverDarkBg, setIsOverDarkBg] = useState(false);


  // Get or create visitor_id
  const getVisitorId = () => {
    let id = localStorage.getItem('guest_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('guest_id', id);
    }
    return id;
  };

  const visitorId = getVisitorId();

  // Initial load and polling
  useEffect(() => {
    loadChat();

    // Detección de fondo oscuro (para invertir colores cuando se solapa con el footer)
    const handleScroll = () => {
      const bubble = containerRef.current;
      if (!bubble) return;

      const bubbleRect = bubble.getBoundingClientRect();
      
      // Buscamos todas las secciones que tengan el fondo verde de marca
      const darkSections = document.querySelectorAll('footer, .bg-\\[\\#1C5D15\\]');
      let overlaps = false;

      for (const section of Array.from(darkSections)) {
        const rect = section.getBoundingClientRect();
        if (
          bubbleRect.bottom > rect.top &&
          bubbleRect.top < rect.bottom
        ) {
          overlaps = true;
          break;
        }
      }

      setIsOverDarkBg(overlaps);
    };


    const handleOpenExternal = () => setIsOpen(true);
    window.addEventListener('chat:open', handleOpenExternal);


    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Verificación inicial
    
    // Poll for new messages every 4 seconds
    pollInterval.current = setInterval(() => {
      loadChat(true); // silent update
    }, 4000);

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('chat:open', handleOpenExternal);
    };
  }, []);


  // Update unread count when chat is closed
  useEffect(() => {
    if (isOpen && chatId) {
      markAsRead();
    }
  }, [isOpen, chatId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAdminTyping]);

  const loadChat = async (silent = false) => {
    try {
      const data = await supabaseAPI.getChatHistory(visitorId, 'visitor');
      if (data && data.chat) {
        setChatId(data.chat.id);
        setMessages(data.messages);
        
        // Advanced features logic
        setIsAdminTyping(!!data.chat.is_admin_typing);
        setIsAdminOnline(!!data.chat.is_admin_online);

        const newUnread = data.chat.unread_count_visitor || 0;
        
        // AUTO-OPEN: if new messages from admin and bubble is closed
        if (!isOpen && newUnread > unreadCount && newUnread > 0) {
          setIsOpen(true);
        }
        
        setUnreadCount(newUnread);
      }
    } catch (e) {
      if (!silent) console.error('Error loading chat:', e);
    }
  };

  const handleTyping = () => {
    if (!chatId) return;
    
    // Inform API that visitor is typing
    supabaseAPI.setTypingStatus(chatId, true, 'visitor');

    // Debounce: Clear flag after 3 seconds of no typing
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      supabaseAPI.setTypingStatus(chatId, false, 'visitor');
    }, 3000);
  };

  const markAsRead = async () => {
    if (!chatId) return;
    try {
      await supabaseAPI.markChatAsRead(chatId, 'visitor');
      setUnreadCount(0);
    } catch (e) {}
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const content = message.trim();
    setMessage('');
    setLoading(true);
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    supabaseAPI.setTypingStatus(chatId!, false, 'visitor');

    try {
      await supabaseAPI.sendChatMessage({
        visitor_id: visitorId,
        sender_type: 'visitor',
        sender_id: user?.id || visitorId,
        content: content
      });
      await loadChat();
    } catch (e) {
      console.error('Error sending message:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Botón Flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 relative ${
          isOpen 
            ? 'bg-red-500 rotate-90' 
            : (isOverDarkBg 
                ? 'bg-white hover:scale-110 shadow-white/20' 
                : 'bg-[#19FF00] hover:scale-110')
        }`}
      >
        {isOpen ? (
          <X className="text-white w-6 h-6" />
        ) : (
          <>
            <MessageCircle className={`${isOverDarkBg ? 'text-[#1C5D15]' : 'text-[#1C5D15]'} w-7 h-7 transition-colors duration-300`} />
            {unreadCount > 0 && (
              <span className={`absolute -top-1 -right-1 ${isOverDarkBg ? 'bg-[#1C5D15] text-white border-white' : 'bg-[#1C5D15] text-white border-white'} text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 animate-bounce`}>
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>


      {/* Ventana de Chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-[#1C5D15] p-4 flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-[#19FF00]/20 flex items-center justify-center relative">
              <User className="text-[#19FF00]" />
              {isAdminOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#19FF00] border-2 border-[#1C5D15] rounded-full"></span>
              )}
            </div>
            <div>
              <h3 className="font-bold">BionanoAYT Support</h3>
              <p className="text-xs text-[#19FF00]">
                {isAdminOnline ? 'En línea ahora' : 'Respondemos pronto'}
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="text-gray-400 w-8 h-8" />
                </div>
                <h4 className="font-semibold text-gray-700">¡Hola!</h4>
                <p className="text-sm text-gray-500">¿En qué podemos ayudarte hoy? Escribe tu mensaje abajo.</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.sender_type === 'visitor';
                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                      isMe 
                        ? 'bg-[#1C5D15] text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}

            {/* Typing Indicator */}
            {isAdminTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex justify-end pr-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#1C5D15]" />
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Escribe un mensaje..."
              className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#1C5D15] outline-none"
            />
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="w-10 h-10 bg-[#1C5D15] text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-[#1C5D15]/90 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
