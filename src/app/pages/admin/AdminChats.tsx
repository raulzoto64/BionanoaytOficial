import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MessageCircle, 
  User, 
  Send, 
  CheckCheck, 
  Check,
  Loader2,
} from 'lucide-react';
import { supabaseAPI, Chat, ChatMessage } from '../../data/supabase';
import { toast } from 'sonner';

export default function AdminChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<any>(null);

  useEffect(() => {
    loadChats();
    // Poll for global updates every 4 seconds to catch typing indicators
    const interval = setInterval(loadChats, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      loadMessages();
      // Poll for specific message updates every 4 seconds
      if (pollInterval.current) clearInterval(pollInterval.current);
      pollInterval.current = setInterval(loadMessages, 4000);
      
      // Mark as read
      markAsRead(selectedChatId);
    }
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [selectedChatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadChats = async () => {
    try {
      const data = await supabaseAPI.getChats();
      setChats(data);
    } catch (e) {
      console.error('Error loading chats:', e);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!selectedChatId) return;
    try {
      const data = await supabaseAPI.getChatHistory(selectedChatId, 'admin');
      if (data && data.messages) {
        setMessages(data.messages);
        
        // Update typing and online status of the visitor from the specific chat data
        setChats(prev => prev.map(c => 
          c.id === data.chat.id ? { 
            ...c, 
            is_visitor_typing: data.chat.is_visitor_typing,
            is_visitor_online: data.chat.is_visitor_online,
            is_admin_online: data.chat.is_admin_online,
            is_admin_typing: data.chat.is_admin_typing
          } : c
        ));
      }
    } catch (e) {
      console.error('Error loading messages:', e);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await supabaseAPI.markChatAsRead(id, 'admin');
      // Update local state unread count
      setChats(prev => prev.map(c => c.id === id ? { ...c, unread_count_admin: 0 } : c));
    } catch (e) {}
  };

  const typingTimeoutRef = useRef<any>(null);
  const lastTypingSentRef = useRef<number>(0);

  const handleTyping = () => {
    if (!selectedChatId) return;
    
    const now = Date.now();
    // Only send typing update every 4 seconds to avoid spamming
    if (now - lastTypingSentRef.current > 4000) {
      supabaseAPI.setTypingStatus(selectedChatId, true, 'admin');
      lastTypingSentRef.current = now;
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      supabaseAPI.setTypingStatus(selectedChatId, false, 'admin');
      lastTypingSentRef.current = 0;
    }, 5000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChatId || sending) return;

    const content = newMessage.trim();
    const currentChat = chats.find(c => c.id === selectedChatId);
    if (!currentChat) return;

    setNewMessage('');
    setSending(true);
    
    // Stop typing indicator immediately
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    supabaseAPI.setTypingStatus(selectedChatId, false, 'admin');
    lastTypingSentRef.current = 0;

    try {
      await supabaseAPI.sendChatMessage({
        visitor_id: currentChat.visitor_id,
        sender_type: 'admin',
        sender_id: 'admin',
        content: content
      });
      await loadMessages();
    } catch (e) {
      toast.error('Error al enviar mensaje');
    } finally {
      setSending(false);
    }
  };

  const filteredChats = chats.filter(chat => {
    const matchesSearch = 
      (chat.lead_name || 'Visitante').toLowerCase().includes(search.toLowerCase()) ||
      (chat.lead_email || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || chat.unread_count_admin > 0;
    return matchesSearch && matchesFilter;
  });

  const selectedChat = chats.find(c => c.id === selectedChatId);

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl border border-[#629960]/20 overflow-hidden shadow-xl">
      {/* SIDEBAR: Lista de Chats */}
      <div className="w-80 border-r border-[#629960]/20 flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-[#629960]/20 bg-white">
          <h2 className="text-xl font-bold text-[#1C5D15] mb-4 flex items-center gap-2">
            <MessageCircle className="w-6 h-6" /> Chat de Soporte
          </h2>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversación..."
              className="w-full pl-9 pr-3 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1C5D15] outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`flex-1 py-1 px-3 rounded-lg text-xs font-semibold transition-all ${filter === 'all' ? 'bg-[#1C5D15] text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`flex-1 py-1 px-3 rounded-lg text-xs font-semibold transition-all ${filter === 'unread' ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
            >
              No leídos
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#1C5D15]" /></div>
          ) : filteredChats.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No hay conversaciones</div>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`w-full p-4 flex gap-3 border-b border-[#629960]/10 transition-colors text-left ${
                  selectedChatId === chat.id ? 'bg-[#1C5D15]/5 border-r-4 border-r-[#1C5D15]' : 'hover:bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#1C5D15]/10 flex items-center justify-center flex-shrink-0 relative">
                  <User className="text-[#1C5D15] w-6 h-6" />
                  {chat.is_visitor_online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#19FF00] border-2 border-gray-50 rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-gray-800 truncate">
                      {chat.lead_name || 'Visitante Anónimo'}
                    </h4>
                    {chat.unread_count_admin > 0 && (
                      <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {chat.unread_count_admin}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#1C5D15] truncate italic">
                    {chat.is_visitor_typing ? 'Escribiendo...' : (chat.last_message || 'Inició un chat')}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400">
                    {new Date(chat.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChatId ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-[#629960]/20 flex justify-between items-center pr-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1C5D15] flex items-center justify-center relative">
                  <User className="text-white w-5 h-5" />
                  {selectedChat?.is_visitor_online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#19FF00] border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{selectedChat?.lead_name || 'Visitante Anónimo'}</h3>
                  <p className="text-xs text-[#1C5D15]">
                    {selectedChat?.is_visitor_typing ? 'Escribiendo...' : (selectedChat?.is_visitor_online ? 'En línea ahora' : (selectedChat?.lead_email || 'Sin correo registrado'))}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                   selectedChat?.lead_status === 'new' ? 'bg-blue-100 text-blue-700' :
                   selectedChat?.lead_status === 'customer' ? 'bg-[#1C5D15]/10 text-[#1C5D15]' :
                   'bg-gray-100 text-gray-600'
                 }`}>
                   Lead: {selectedChat?.lead_status || 'desconocido'}
                 </span>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30"
            >
              {messages.map((msg, i) => {
                const isAdmin = msg.sender_type === 'admin';
                // Logic for "seen": if it's an admin message and visitor has 0 unread, it's seen
                // If it's an older message (not in the last 'unread' count), it's also seen
                const isSeen = isAdmin && (selectedChat?.unread_count_visitor === 0);
                
                return (
                  <div key={i} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${isAdmin ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                        isAdmin 
                          ? 'bg-[#1C5D15] text-white rounded-tr-none' 
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 px-1 flex items-center gap-1">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isAdmin && (
                          isSeen ? (
                            <CheckCheck className="w-3 h-3 text-[#1C5D15]" />
                          ) : (
                            <Check className="w-3 h-3 text-gray-400" />
                          )
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Visitor Typing indicator */}
              {selectedChat?.is_visitor_typing && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#629960]/20 flex gap-2">
              <input
                type="text"
                placeholder="Escribe tu respuesta..."
                className="flex-1 px-4 py-2 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-[#1C5D15] outline-none"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="px-6 py-2 bg-[#1C5D15] text-white rounded-xl font-bold hover:bg-[#1C5D15]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Responder
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Bandeja de Entrada</h3>
            <p className="max-w-xs text-gray-500">Selecciona una conversación de la izquierda para empezar a chatear con tus visitantes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
