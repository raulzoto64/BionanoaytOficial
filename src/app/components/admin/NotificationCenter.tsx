import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Loader2, Info } from 'lucide-react';
import { supabaseAPI } from '../../data/supabase';
import { useAuth } from '../../hooks/useAuth';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  action_url: string | null;
  created_at: string;
  read_by: string[];
}

export function NotificationCenter({ collapsed }: { collapsed?: boolean }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(
    (n) => user?.id && !n.read_by.includes(user.id)
  ).length;

  // Cargar Notificaciones
  const loadNotifications = async () => {
    console.log('[NOTIFICATIONS] loadNotifications initiated');
    if (!user) {
      console.log('[NOTIFICATIONS] Aborting: No user found');
      return;
    }

    setLoading(true);
    try {
      const data = await supabaseAPI.getNotifications();
      console.log('[NOTIFICATIONS] API Response:', data ? data.length : 0, 'rows');

      // Filtrar por rol en el frontend si es necesario (ya que el PHP devuelve todo por ahora)
      const role = user.user_metadata?.role || 'admin';
      let filteredData = data;
      
      if (role !== 'admin' && role !== 'superadmin') {
        filteredData = data.filter((n: any) => 
          n.target_role === 'all' || n.target_role === role || n.target_role === user.id
        );
      }

      // Filtrar las leídas para que desaparezcan de la lista
      const unreadData = (filteredData as Notification[]).filter(n => !n.read_by.includes(user.id));
      setNotifications(unreadData);
    } catch (e) {
      console.error('[NOTIFICATIONS] Error fetching notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const markAsRead = async (id: string, currentReadBy: string[], actionUrl?: string | null) => {
    if (!user) return;
    if (currentReadBy.includes(user.id)) {
      if (actionUrl) {
        setOpen(false);
        navigate(actionUrl);
      }
      return;
    }

    const newReadBy = [...currentReadBy, user.id];

    // UI estético optimizado (Optimistic UI): DESAPARECER de la lista
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    await supabaseAPI.markNotificationAsRead(id, newReadBy);

    if (actionUrl) {
      setOpen(false); // Cerramos el popover de las notificaciones
      navigate(actionUrl); // Navegamos instantáneamente sin recargar
    }
  };

  const markAllAsRead = async () => {
    if (!user || unreadCount === 0) return;

    // Obtenemos todos los IDs no leídos
    const unreadIds = notifications.map(n => n.id);

    // UI optimizado: Limpiar toda la tabla
    setNotifications([]);

    // Iteramos por DB de forma rápida pero sin fallar
    for (const id of unreadIds) {
      const note = notifications.find(n => n.id === id);
      if (note) {
        await supabaseAPI.markNotificationAsRead(id, [...note.read_by, user.id]);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) loadNotifications();
    }}>
      <PopoverTrigger asChild>
        <button className="text-white hover:text-[#19FF00] relative p-2 rounded-lg transition-colors hover:bg-white/10 outline-none">
          <Bell size={20} className={unreadCount > 0 ? 'animate-pulse' : ''} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#19FF00] border-2 border-[#1C5D15] rounded-full shadow-lg"></span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-80 p-0 rounded-2xl shadow-2xl border border-gray-100 mt-2 z-[9999]"
        align="start"
        side="right"
        sideOffset={25}
      >
        <div className="bg-[#1C5D15] text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm tracking-widest uppercase flex items-center gap-2">
              <Bell size={14} className="text-[#19FF00]" /> Notificaciones
            </h3>
            {unreadCount > 0 && (
              <p className="text-[10px] text-[#19FF00] font-black">{unreadCount} nuevas</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[10px] hover:text-[#19FF00] transition-colors border border-white/20 px-2 py-1 rounded"
            >
              Marcar todo leído
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto bg-[#F7F9CE]">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-5 h-5 text-[#1C5D15] animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Info size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm font-bold">Todo al día</p>
              <p className="text-[10px]">No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1C5D15]/5">
              {notifications.map((n) => {
                const isRead = user?.id ? n.read_by.includes(user.id) : false;

                return (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id, n.read_by, n.action_url)}
                    className={`block p-4 transition-colors cursor-pointer hover:bg-white ${isRead ? 'opacity-60 bg-transparent' : 'bg-white'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-xs ${isRead ? 'font-bold' : 'font-black'} ${n.notification_type === 'lead_alert' ? 'text-orange-600' : 'text-[#1C5D15]'}`}>
                        {n.title}
                      </h4>
                      {!isRead && <span className="w-2 h-2 bg-orange-500 rounded-full shrink-0 mt-1"></span>}
                    </div>
                    <p className={`text-[10px] leading-relaxed mb-2 ${isRead ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>
                      {n.message}
                    </p>
                    <span className="text-[8px] font-bold text-gray-400 tracking-widest uppercase">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: es })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
