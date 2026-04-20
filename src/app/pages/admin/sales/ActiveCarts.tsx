import { useState, useEffect } from "react";
import { supabaseAPI } from "../../../data/supabase";
import { ShoppingCart, User, Search, Loader2, MapPin } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export function ActiveCarts() {
  const [carts, setCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCart, setSelectedCart] = useState<any | null>(null);
  const [cartDetails, setCartDetails] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [userLead, setUserLead] = useState<any | null>(null);

  useEffect(() => {
    loadCarts();
  }, []);

  const loadCarts = async () => {
    try {
      setLoading(true);
      const data = await supabaseAPI.getActiveCarts();
      setCarts(data);
    } catch (err) {
      toast.error("Error al cargar carritos");
    } finally {
      setLoading(false);
    }
  };

  const viewCartDetails = async (cart: any) => {
    try {
      setSelectedCart(cart);
      setLoadingDetails(true);
      setCartDetails([]);
      setUserLead(null);

      const items = await supabaseAPI.getCartByIdentifier(cart.identifier);
      setCartDetails(items);

      const leads = await supabaseAPI.getLeadByIdentifier(cart.identifier);

      if (leads && leads.length > 0) {
        setUserLead(leads[0]);
      } else {
        const newLead = await supabaseAPI.createLead({
          name: cart.user_id ? 'Usuario Registrado' : 'Visitante Anónimo',
          lead_type: 'System Auto-Generated',
          metadata: {
            source: 'active_cart_inspection',
            cart_identifier: cart.identifier
          }
        });
        setUserLead(newLead);
      }
    } catch (err) {
      toast.error("Error al cargar detalle");
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredCarts = carts.filter(c =>
    c.identifier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-transparent">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Relación de Carritos</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white border-none shadow-sm rounded-xl w-64 font-bold text-xs h-10"
            />
          </div>
          <Button onClick={loadCarts} disabled={loading} className="rounded-xl h-10 px-6 bg-[#1C5D15] hover:text-[#1C5D15] font-black uppercase tracking-widest text-[9px]">
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Actualizar"}
          </Button>
        </div>
      </div>

      {/* Tabla Estilo Leads */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100" style={{ overflow: 'visible' }}>
        <div style={{ overflow: 'visible' }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identificador</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Unidades</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Última Actividad</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCarts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center italic text-gray-300 font-bold">Sin actividad detectada</td>
                </tr>
              ) : filteredCarts.map((cart) => (
                <tr key={cart.identifier} className="hover:bg-[#19FF00]/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-[#1C5D15] group-hover:bg-[#1C5D15] group-hover:text-white transition-all">
                        <User size={14} />
                      </div>
                      <span className="text-xs font-black text-[#1C5D15] truncate max-w-[200px]">{cart.identifier}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block group/tooltip">
                      <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase cursor-help">
                        {cart.total_items} Posiciones
                      </span>
                      
                      {/* Tooltip Pro que se abre HASTA LA DERECHA en vez de ARRIBA para no tocar el borde superior nunca */}
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 w-64 bg-[#1C5D15] text-white p-4 rounded-2xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[9999] pointer-events-none">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-[#19FF00] mb-3 border-b border-white/10 pb-2">Contenido del Carrito</h4>
                        <ul className="space-y-2">
                          {cart.items_list?.map((item: any, idx: number) => (
                            <li key={idx} className="text-[10px] flex justify-between gap-4">
                              <span className="font-bold truncate opacity-80">{item.name?.replace(/-/g, ' ')}</span>
                              <span className="font-black text-[#19FF00] whitespace-nowrap">{item.quantity} un.</span>
                            </li>
                          ))}
                        </ul>
                        {/* Flecha apuntando a la izquierda hacia la burbuja */}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 w-3 h-3 bg-[#1C5D15] -rotate-45 -mr-1.5 border-t border-l border-transparent"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black bg-orange-50 text-orange-600 px-3 py-1 rounded-full uppercase">{cart.total_quantity} Unid.</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700">{format(new Date(cart.last_activity), "d MMM, yyyy", { locale: es })}</span>
                      <span className="text-[10px] text-gray-400 font-medium">{format(new Date(cart.last_activity), "HH:mm:ss")}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      onClick={() => viewCartDetails(cart)}
                      className="bg-white border-2 border-[#1C5D15]/10 text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white rounded-xl h-9 px-4 text-[9px] font-black uppercase tracking-widest transition-all shadow-sm"
                    >
                      Ver Carrito
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Lateral Estilo Pro */}
      {selectedCart && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-end" onClick={() => setSelectedCart(null)}>
          <div className="w-full max-w-lg bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
            <div className="h-full flex flex-col">
              <header className="p-8 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-[#1C5D15] uppercase tracking-tighter italic">Detalle de Actividad</h2>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ID: {selectedCart.identifier}</p>
                </div>
                <button onClick={() => setSelectedCart(null)} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">×</button>
              </header>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar scrollbar-hide">
                {/* Info Lead */}
                <section className="mb-10">
                  <h3 className="text-[10px] font-black text-[#19FF00] uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#19FF00] rounded-full"></div> Información del Cliente
                  </h3>
                  <div className="bg-gray-50 rounded-3xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Nombre</p>
                        <p className="text-xs font-black text-[#1C5D15]">{userLead?.name || 'Anónimo'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Teléfono</p>
                        <p className="text-xs font-black text-[#1C5D15]">{userLead?.phone || '-'}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Email</p>
                      <p className="text-xs font-black text-[#1C5D15]">{userLead?.email || '-'}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
                      <MapPin size={12} className="text-[#19FF00]" />
                      <span className="text-[10px] font-bold text-[#629960] uppercase">{userLead?.country ? `${userLead.city}, ${userLead.country}` : 'Ubicación no disponible'}</span>
                    </div>
                  </div>
                </section>

                {/* Carrito */}
                <section>
                  <h3 className="text-[10px] font-black text-[#1C5D15] uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShoppingCart size={14} /> Ítems en Carrito
                  </h3>
                  <div className="space-y-3">
                    {loadingDetails ? (
                      <Loader2 className="animate-spin mx-auto my-10 text-[#19FF00]" />
                    ) : cartDetails.map((item, i) => (
                      <div key={i} className="flex gap-4 items-center bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                        <img src={item.product?.image} className="w-12 h-12 object-cover rounded-xl bg-gray-50" alt="" />
                        <div className="flex-1">
                          <p className="text-[11px] font-black text-[#1C5D15] uppercase tracking-tight">{item.product?.slug?.replace(/-/g, ' ')}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{item.packaging} — Cantidad: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <footer className="p-8 border-t bg-gray-50">
                <Button className="w-full bg-[#1C5D15] hover:text-[#1C5D15] text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-[#1C5D15]/10">
                  Crear Ticket de Seguimiento
                </Button>
              </footer>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
